/* CH-015 tâche 2 : cherche, parmi ce que le lot sait AVANT la pose d'un cut, des règles simples qui prédisent (D) un différé ou (F) une pose décalée > 100 mm.
 * Usage : node predicteurs.cjs <outils-banane> <dossier-lot> <cuts-p20.json> <partie> <sortie.json>
 * Descripteurs : uniquement des champs consignés par le lot à la décision du cut (moteur, décision sur le lot, GCV2-L1, règles métier en ombre,
 * nuage capturé) et le résultat des cuts PRÉCÉDENTS du lot (différé ou posé). Jamais le résultat du cut lui-même ni celui des suivants.
 * D se mesure sur les cibles (889) ; F sur les posés jugés contre l'Écho (172, échantillon biaisé vers les différés), coût = posés écartés. */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, cutsFic, partieS, sortie] = process.argv.slice(2);
const partie = Number(partieS);
const Poses = require(path.join(outils, 'precision-poses.cjs'));
const journal = Poses.lireJournalDir(lotDir);
const cuts = JSON.parse(fs.readFileSync(cutsFic));
const t = e => Date.parse(e.timestamp || '');
const ev = journal.events.filter(e => Number.isFinite(t(e))).sort((a, b) => t(a) - t(b));
const t0 = Math.min(...ev.filter(e => e.type === 'batch-started' && e.identity && e.identity.part === partie).map(t));
const par = (type, f = e => true) => { const m = new Map(); for (const e of ev) if (e.type === type && e.identity && e.identity.part === partie && f(e)) m.set(e.identity.cut, e); return m; };
const shadow = par('gcv1-shadow-observed'), regles = par('regles-metier-ombre'), prop = par('proposed'), cap = par('adapter-result', e => e.action === 'capture' && e.lastStage === 'capture-ready');
const finiN = v => Number.isFinite(v) ? v : null;
const diffSet = new Set(cuts.filter(c => !c.pose).map(c => c.cut));
const rows = cuts.map(c => {
  const s = shadow.get(c.cut), L = s && s.lotObservation || {}, R = regles.get(c.cut), P = prop.get(c.cut), K = cap.get(c.cut);
  const rails = P && P.proposal && P.proposal.rails || {};
  const nonRes = ['left', 'right'].filter(x => rails[x] && rails[x].status === 'unresolved').length;
  const dernier5 = [1, 2, 3, 4, 5].filter(k => diffSet.has(c.cut - k)).length;
  const gcv = x => rails[x] && rails[x].gcv1 && rails[x].gcv1.motif;
  return {
    cut: c.cut, D: !c.pose, pose: c.pose, jug: c.pose && (c.etat === 'corrige' || c.etat === 'controle'), F: !!c.mauvaiseVoie, G20: c.pose && c.mm > 20,
    stage: L.stage || null, chemin: L.command ? L.command.action + ':' + L.command.reason : null, nonResolus: nonRes,
    appuis: L.anchorsUsed ? L.anchorsUsed.length : (L.l1 && L.l1.chaine ? L.l1.chaine.appuis : null), flushPct: finiN(L.flushPct),
    fauxVert: L.fauxVertOmbre ? L.fauxVertOmbre.verdict : null, l1etat: L.l1 ? L.l1.etat : null, l1p: L.l1 ? finiN(L.l1.p) : null, l1zone: L.l1 ? L.l1.zone : null,
    advOmbre: R && R.zone ? String(R.zone.adv) : null, pn: R && R.zone ? !!R.zone.pn : null, grappeDiff: R && R.zone && R.zone.grappe ? R.zone.grappe.differes : null, grappeProche: R && R.zone && R.zone.grappe ? R.zone.grappe.plusProche : null,
    quadMin: R && R.surface ? finiN(R.surface.quadMin) : null, advRails: R && R.surface ? finiN(R.surface.advRails) : null,
    points: K && K.lastDetail ? finiN(K.lastDetail.points) : null, noeuds: K && K.lastDetail ? finiN(K.lastDetail.nodes) : null,
    precedentDiffere: diffSet.has(c.cut - 1), deuxPrecedentsDiffere: diffSet.has(c.cut - 1) || diffSet.has(c.cut - 2), diffDans5: dernier5,
    deplacementMm: R && R.reel ? finiN(R.reel.deplacementMm) : null, gaugeMm: R && R.reel ? finiN(R.reel.ecartementMm) : null,
    motifG: gcv('left'), motifD: gcv('right'),
    cutMod100: c.cut % 100, minute: c.minute,
  };
});
const cat = ['stage', 'chemin', 'nonResolus', 'fauxVert', 'l1etat', 'l1zone', 'advOmbre', 'pn', 'precedentDiffere', 'deuxPrecedentsDiffere', 'diffDans5', 'motifG', 'motifD', 'grappeDiff'];
const num = ['appuis', 'flushPct', 'l1p', 'grappeProche', 'quadMin', 'advRails', 'points', 'noeuds', 'deplacementMm', 'gaugeMm'];
function evaluer(pop, cible, pred) {
  const flagged = pop.filter(pred), tp = flagged.filter(r => r[cible]).length, pos = pop.filter(r => r[cible]).length;
  return { signales: flagged.length, vrais: tp, positifs: pos, precision: flagged.length ? tp / flagged.length : null, rappel: pos ? tp / pos : null };
}
const cibles = { D: { pop: r => true, nom: 'différé (sur les cibles)' }, F: { pop: r => r.jug, nom: 'pose à plus de 100 mm latéral (sur les jugés)' }, G20: { pop: r => r.jug, nom: 'pose à plus de 20 mm (sur les jugés)' } };
const out = { partie, n: rows.length, regles: {} };
for (const [cl, def] of Object.entries(cibles)) {
  const pop = rows.filter(def.pop), cand = [];
  for (const f of cat) for (const v of new Set(pop.map(r => r[f]))) if (v !== null) cand.push({ regle: `${f} = ${v}`, pred: r => r[f] === v });
  for (const f of num) {
    const vals = [...new Set(pop.map(r => r[f]).filter(v => v !== null))].sort((a, b) => a - b);
    const seuils = vals.length > 40 ? Array.from({ length: 39 }, (_, i) => vals[Math.floor((i + 1) * vals.length / 40)]) : vals;
    for (const s of seuils) { cand.push({ regle: `${f} >= ${s}`, pred: r => r[f] !== null && r[f] >= s }); cand.push({ regle: `${f} <= ${s}`, pred: r => r[f] !== null && r[f] <= s }); }
  }
  const sc = cand.map(c => ({ ...c, ...evaluer(pop, cl, c.pred) })).filter(c => c.signales >= 5 && c.vrais >= 3);
  const f1 = c => 2 * c.precision * c.rappel / (c.precision + c.rappel || 1);
  sc.sort((a, b) => f1(b) - f1(a));
  const base = pop.filter(r => r[cl]).length / pop.length;
  out.regles[cl] = { population: def.nom, n: pop.length, positifs: pop.filter(r => r[cl]).length, tauxBase: base,
    meilleures: sc.slice(0, 12).map(c => ({ regle: c.regle, signales: c.signales, vrais: c.vrais, precision: +c.precision.toFixed(3), rappel: +c.rappel.toFixed(3), sursaut: +(c.precision / base).toFixed(2),
      coutPosesEcartes: cl === 'D' ? null : rows.filter(r => r.pose).filter(c.pred).length })) };
}
fs.writeFileSync(sortie, JSON.stringify(out, null, 1));
fs.writeFileSync(sortie.replace(/\.json$/, '-descripteurs.json'), JSON.stringify(rows));
for (const [cl, o] of Object.entries(out.regles)) { console.log('##', cl, o.population, 'n', o.n, 'positifs', o.positifs, 'taux de base', o.tauxBase.toFixed(3)); for (const r of o.meilleures) console.log('  ', r.regle.padEnd(34), 'signalés', String(r.signales).padStart(3), 'vrais', String(r.vrais).padStart(3), 'précision', r.precision, 'rappel', r.rappel, 'x' + r.sursaut, r.coutPosesEcartes !== null ? 'coût(posés écartés) ' + r.coutPosesEcartes : ''); }
