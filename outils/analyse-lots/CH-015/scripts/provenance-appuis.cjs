/* CH-015 tâche 5 (B) : provenance des appuis de la chaîne et propagation des erreurs. Pour chaque cut du lot, ses appuis (lotObservation.anchorsUsed : numéros de cuts)
 * sont classés par provenance : « préexistant » (cut valide avant le lot, hors cibles), « premier passage » (posé par le moteur seul) ou « lot » (posé par une commande du
 * lot : window, choice, crossing, GCV2 L1). Tableau des poses fausses (latéral > 100 mm) et > 20 mm selon le nombre et la provenance des appuis ; justesse des appuis jugés.
 * node provenance-appuis.cjs <outils-banane> <dossier-lot> <partie> <cuts-detail.json> <sortie.json>   (lecture seule ; jugés = cuts-detail de detail-lot.cjs) */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, partieS, cutsFic, sortie] = process.argv.slice(2); const partie = Number(partieS);
const Poses = require(path.join(outils, 'precision-poses.cjs')); const journal = Poses.lireJournalDir(lotDir); const cuts = JSON.parse(fs.readFileSync(cutsFic));
const par = new Map(cuts.map(c => [c.cut, c])); const sh = new Map();
for (const e of journal.events) if (e.type === 'gcv1-shadow-observed' && e.identity && e.identity.part === partie) sh.set(e.identity.cut, e.lotObservation || {});
const chemin = c => { const L = sh.get(c); return L && L.command ? L.command.action + ':' + L.command.reason : 'inconnu'; };
const prov = a => { const c = par.get(a); if (!c) return 'préexistant'; if (!c.pose) return 'différé'; const p = chemin(a); return p === 'engine:first-pass' ? 'premier passage' : p.startsWith('lot:') ? 'lot' : 'autre'; };
const jug = c => c && c.pose && (c.etat === 'corrige' || c.etat === 'controle');
const verdict = c => !jug(c) ? 'non jugé' : c.mauvaiseVoie ? 'faux' : c.mm > 20 ? 'imprécis (>20 mm)' : 'juste';
const rows = cuts.filter(c => c.pose).map(c => {
  const L = sh.get(c.cut) || {}, A = Array.isArray(L.anchorsUsed) ? L.anchorsUsed : null;
  const P = (A || []).map(a => ({ cut: a, prov: prov(a), verdict: verdict(par.get(a)) }));
  const classe = !A ? 'inconnu' : !A.length ? 'aucun appui' : P.some(x => x.prov === 'lot') ? 'au moins un appui posé par le lot' : P.some(x => x.prov === 'autre') ? 'autre' : 'tous préexistants ou premier passage';
  return { cut: c.cut, jug: jug(c), F: !!c.mauvaiseVoie, G20: jug(c) && c.mm > 20, classe, n: A ? A.length : null, appuis: P, chemin: chemin(c.cut) };
});
const tab = {}; for (const r of rows) { const t = tab[r.classe] = tab[r.classe] || { posés: 0, jugés: 0, faux: 0, plus20: 0 }; t.posés++; if (r.jug) { t.jugés++; if (r.F) t.faux++; if (r.G20) t.plus20++; } }
const fausses = rows.filter(r => r.F);
const propag = { appuiFaux: 0, appuiJusteOuPreexistant: 0, appuiNonJuge: 0, sansAppui: 0 };
for (const r of fausses) { if (!r.appuis.length) propag.sansAppui++; else if (r.appuis.some(a => a.verdict === 'faux' || a.verdict === 'imprécis (>20 mm)')) propag.appuiFaux++; else if (r.appuis.some(a => a.verdict === 'non jugé')) propag.appuiNonJuge++; else propag.appuiJusteOuPreexistant++; }
/* parmi les jugés, la justesse selon le verdict de l'appui le plus proche (n-1 si présent) */
const apres = {}; for (const r of rows.filter(x => x.jug && x.appuis.length)) { const a = r.appuis[0]; const k = a.prov + ' / ' + a.verdict; const t = apres[k] = apres[k] || { jugés: 0, faux: 0, plus20: 0 }; t.jugés++; if (r.F) t.faux++; if (r.G20) t.plus20++; }
/* contrefactuel de la règle de provenance : retirer des appuis ceux posés par le lot ; combien de cuts changent, combien perdent tous leurs appuis, quels faux sont concernés */
const cf = { cutsAvecAppuiLot: 0, cutsSansAppuiApres: 0, jugesConcernes: 0, fauxConcernes: 0, fauxSansAppuiApres: 0 };
for (const r of rows) { if (!r.appuis.some(a => a.prov === 'lot')) continue; cf.cutsAvecAppuiLot++; const reste = r.appuis.filter(a => a.prov !== 'lot').length; if (!reste) cf.cutsSansAppuiApres++; if (r.jug) { cf.jugesConcernes++; if (r.F) { cf.fauxConcernes++; if (!reste) cf.fauxSansAppuiApres++; } } }
/* runs de poses fausses consécutives et leur première pose */
const f = fausses.map(r => r.cut).sort((a, b) => a - b), runs = []; for (const c of f) { const d = runs[runs.length - 1]; if (d && c - d[d.length - 1] <= 1) d.push(c); else runs.push([c]); }
const sortieObj = { partie, tableauSelonAppuis: tab, fausses: { n: fausses.length, propagation: propag, runsConsecutifs: runs.map(r => r.length), premieresPosesDesRuns: runs.map(r => r[0]) }, justesseSelonPremierAppui: apres, contrefactuelRegleProvenance: cf, detailFausses: fausses };
fs.writeFileSync(sortie, JSON.stringify(sortieObj, null, 1)); console.log(JSON.stringify({ ...sortieObj, detailFausses: undefined }, null, 1));
