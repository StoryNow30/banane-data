/* CH-015 : détail par cut d'un lot jugé contre l'Écho (parties du journal), pour chercher une cause aux poses fausses et aux différés.
 * Usage : node detail-lot.cjs <outils-banane> <dossier-lot> <lignes-echo.json> <partie> <dossier-sortie>
 * Entrées : le journal (lu dans les zips), la table produite par lignes-echo.cjs. Lecture seule ; mêmes définitions que tools/juger-lot.cjs
 * (cibles, posés, jugés, > 20 mm, mauvaise voie = latéral > 100 mm). Sortie : cuts.json (un enregistrement par cible, numéro de cut), synthese.json. */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, lignesFic, partieS, sortie] = process.argv.slice(2);
const partie = Number(partieS);
const Poses = require(path.join(outils, 'precision-poses.cjs'));
const journal = Poses.lireJournalDir(lotDir);
const lignes = new Map(JSON.parse(fs.readFileSync(lignesFic)).lignes.map(l => [l.cut, l]));
const fini = v => Number.isFinite(v);
const t = e => Date.parse(e.timestamp || '');
const ev = journal.events.filter(e => fini(t(e))).sort((a, b) => t(a) - t(b));
const dep = ev.filter(e => e.type === 'batch-started' && e.batch && e.batch.id && e.identity && e.identity.part === partie).pop();
const B = dep.batch.id, t0 = t(dep);
const arret = ev.find(e => e.type === 'batch-stopped-at-end' && t(e) > t0);
const fin = arret ? t(arret) + 5000 : Infinity;
/* cibles : décision du lot, hors départ sur vert (même règle que juger-lot) */
const cibles = new Set();
for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === partie && Number.isInteger(e.identity.cut)) cibles.add(e.identity.cut);
for (const e of ev) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === partie && t(e) >= t0 && t(e) <= t0 + 30000) cibles.delete(e.identity.cut);
const poses = new Set();
for (const e of ev) {
  if (e.type !== 'esv-observation' || e.kind !== 'write' || t(e) < t0 || t(e) >= fin) continue;
  if (Number.isInteger(e.status) && e.status >= 200 && e.status < 300 && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && cibles.has(e.rowIndex)) poses.add(e.rowIndex);
}
/* index des événements par cut */
const parCut = (type) => { const m = new Map(); for (const e of ev) if (e.type === type && e.identity && e.identity.part === partie && (e.batchId ? e.batchId === B : t(e) >= t0)) m.set(e.identity.cut, e); return m; };
const propose = new Map(); for (const e of ev) if (e.type === 'proposed' && e.proposal) propose.set(e.proposal.id, e);
const applique = parCut('applied-verified'), diffFin = parCut('defer-finalized'), voiePred = parCut('voie-predite-ombre'), passe = new Map();
for (const e of ev) if (e.type === 'passe-differes-ombre' && e.passe === 1 && e.identity && e.identity.part === partie) passe.set(e.identity.cut, e);
const gestes = new Map(); for (const e of ev) if (['molette', 'glisser', 'deplacer-vue', 'clic-hors-vue'].includes(e.type) && e.identity && e.identity.part === partie) { const g = gestes.get(e.identity.cut) || {}; g[e.type] = (g[e.type] || 0) + 1; gestes.set(e.identity.cut, g); }
const rail = (p, c) => { const r = p && p.proposal && p.proposal.rails && p.proposal.rails[c]; return r ? { statut: r.status, source: r.source, confiance: r.confidence, methode: r.method } : null; };
const abs = v => fini(v) ? Math.abs(v) : null;
const cuts = [];
for (const cut of [...cibles].sort((a, b) => a - b)) {
  const pose = poses.has(cut), l = lignes.get(cut);
  const o = { cut, minute: null, pose };
  if (pose) {
    const av = applique.get(cut), pr = av && propose.get(av.proposalId);
    o.minute = av ? Math.round((t(av) - t0) / 6000) / 10 : null;
    o.proposition = { gauche: rail(pr, 'left'), droite: rail(pr, 'right') };
    const vf = av && av.observed && av.observed.vueFin;
    o.vueFin = vf ? { gaucheDansVue: vf.left.dansVue, droiteDansVue: vf.right.dansVue, ndcGauche: vf.left.ndc, ndcDroite: vf.right.ndc } : null;
    if (!l || !l.dansEcho) o.etat = 'sans-echo';
    else if (l.referenceHumaine !== 'observee') o.etat = 'non-juge';
    else if (l.regleVisiteBon) { o.etat = 'controle'; o.mm = 0; o.lat = 0; }
    else if (typeof l.base !== 'string' || !l.base.startsWith('ariane') || !l.ecartHumain || !fini(l.ecartHumain.maxDist3dMm)) o.etat = 'non-juge';
    else {
      o.etat = 'corrige'; o.mm = l.ecartHumain.maxDist3dMm;
      const g = l.ecartHumain.gauche || {}, d = l.ecartHumain.droite || {};
      o.latSigneMm = { gauche: g.lateralMm, droite: d.lateralMm }; o.vertSigneMm = { gauche: g.verticalMm, droite: d.verticalMm };
      const lats = [abs(g.lateralMm), abs(d.lateralMm)].filter(fini); o.lat = lats.length ? Math.max(...lats) : null;
    }
    o.mauvaiseVoie = fini(o.lat) && o.lat > 100;
  } else {
    const df = diffFin.get(cut), vp = voiePred.get(cut), ps = passe.get(cut);
    const m = c => df && df.rails && df.rails[c] && df.rails[c].gcv1 ? df.rails[c].gcv1.motif : null;
    const r = c => df && df.rails && df.rails[c] && df.rails[c].reasons && df.rails[c].reasons[0] || null;
    o.motifs = { gauche: m('left'), droit: m('right') };
    o.raison1 = { gauche: r('left') && r('left').replace(/[0-9]+([.,][0-9]+)?/g, '#').slice(0, 70), droit: r('right') && r('right').replace(/[0-9]+([.,][0-9]+)?/g, '#').slice(0, 70) };
    o.voiePredite = vp ? { raison: vp.raison, etage: vp.etage, posable: vp.verdict && vp.verdict.posable } : null;
    o.passe = ps ? { decision: ps.decision, motif: ps.motif } : null;
    o.dansEcho = !!(l && l.dansEcho);
  }
  o.gestesVue = gestes.get(cut) || null;
  cuts.push(o);
}
/* contiguïté : paquets de numéros de cut consécutifs (un cut = un mètre environ) */
const paquets = (liste, ecart = 1) => { const s = [...liste].sort((a, b) => a - b), P = []; for (const c of s) { const d = P[P.length - 1]; if (d && c - d[d.length - 1] <= ecart) d.push(c); else P.push([c]); } return P; };
const taille = P => { const n = P.map(p => p.length); return { paquets: P.length, tailles: n.sort((a, b) => b - a), plusGrand: Math.max(0, ...n) }; };
const fausses = cuts.filter(c => c.mauvaiseVoie).map(c => c.cut);
const diff = cuts.filter(c => !c.pose).map(c => c.cut);
const jugesC = cuts.filter(c => c.pose && (c.etat === 'corrige' || c.etat === 'controle'));
const compte = (liste, f) => liste.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const fau = jugesC.filter(c => c.mauvaiseVoie), ok = jugesC.filter(c => !c.mauvaiseVoie);
const src = c => c.proposition ? [c.proposition.gauche && c.proposition.gauche.source, c.proposition.droite && c.proposition.droite.source].join('|') : 'inconnu';
const confMin = c => c.proposition && c.proposition.gauche && c.proposition.droite ? Math.min(c.proposition.gauche.confiance, c.proposition.droite.confiance) : null;
const med = a => { const s = a.filter(fini).sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const synthese = {
  partie, lot: B.slice(0, 8), cibles: cibles.size, poses: poses.size, differes: diff.length,
  fausses: { n: fau.length, parmiJuges: jugesC.length, contiguite: taille(paquets(fausses)), contiguite_ecart5: taille(paquets(fausses, 5)),
    minutes: fau.map(c => c.minute).sort((a, b) => a - b), plageCuts: [Math.min(...fausses), Math.max(...fausses)],
    signeLatGaucheDroite: compte(fau, c => c.latSigneMm ? [Math.sign(c.latSigneMm.gauche), Math.sign(c.latSigneMm.droite)].join('/') : 'na'),
    latMedianeMm: med(fau.map(c => c.lat)), latMinMaxMm: [Math.min(...fau.map(c => c.lat)), Math.max(...fau.map(c => c.lat))],
    source: compte(fau, src), sourceAutres: compte(ok, src),
    confianceMinMediane: { fausses: med(fau.map(confMin)), autres: med(ok.map(confMin)) },
    railHorsVue: { fausses: compte(fau, c => c.vueFin ? [c.vueFin.gaucheDansVue, c.vueFin.droiteDansVue].join('/') : 'na'), autres: compte(ok, c => c.vueFin ? [c.vueFin.gaucheDansVue, c.vueFin.droiteDansVue].join('/') : 'na') },
    gestesVue: { fausses: fau.filter(c => c.gestesVue).length, autres: ok.filter(c => c.gestesVue).length },
    voisinsDiffere: { fausses: fausses.filter(c => diff.includes(c - 1) || diff.includes(c + 1)).length, autres: ok.filter(c => diff.includes(c.cut - 1) || diff.includes(c.cut + 1)).length },
    etatsDesFausses: compte(fau, c => c.etat) },
  differes: { n: diff.length, contiguite: taille(paquets(diff)), motifs: compte(cuts.filter(c => !c.pose), c => [c.motifs.gauche, c.motifs.droit].join('|')),
    motifPrincipal: compte(cuts.filter(c => !c.pose), c => c.motifs.gauche === 'gauge-out-of-contract' || c.motifs.droit === 'gauge-out-of-contract' ? 'gauge-out-of-contract' : (c.motifs.gauche || c.motifs.droit || 'inconnu')),
    voiePredite: compte(cuts.filter(c => !c.pose), c => c.voiePredite ? c.voiePredite.raison : 'aucune'),
    passe: compte(cuts.filter(c => !c.pose), c => c.passe ? c.passe.decision : 'aucune'),
    vusParEcho: cuts.filter(c => !c.pose && c.dansEcho).length,
    gestesVue: cuts.filter(c => !c.pose && c.gestesVue).length },
  poses: { vueFin: compte(cuts.filter(c => c.pose), c => c.vueFin ? [c.vueFin.gaucheDansVue, c.vueFin.droiteDansVue].join('/') : 'na') },
  geste: { molette: journal.events.filter(e => e.type === 'molette').length, camera: compte(journal.events.filter(e => e.type === 'molette'), e => e.camera), deplacerVue: compte(journal.events.filter(e => e.type === 'deplacer-vue'), e => e.refus || e.stage), clicHorsVue: journal.events.filter(e => e.type === 'clic-hors-vue').length, clicHorsVueBilan: (journal.events.find(e => e.type === 'clic-hors-vue-bilan') || {}).total },
};
fs.mkdirSync(sortie, { recursive: true });
fs.writeFileSync(path.join(sortie, `cuts-p${partie}.json`), JSON.stringify(cuts, null, 1));
fs.writeFileSync(path.join(sortie, `synthese-p${partie}.json`), JSON.stringify(synthese, null, 1));
console.log(JSON.stringify(synthese, null, 1));
