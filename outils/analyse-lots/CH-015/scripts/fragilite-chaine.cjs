/* CH-015 tâche 5 (B), suite : « fragilité » de la chaîne d'appuis. Un cut posé sans aucun appui est une RACINE (profondeur 0) ; un cut dont un appui a la profondeur p a la profondeur p+1
 * (le plus petit). Taux de poses fausses (latéral > 100 mm) et > 20 mm parmi les jugés selon la profondeur ; puis la règle « R3 : un des 2 cuts précédents est différé ET moins de 2 appuis ».
 * node fragilite-chaine.cjs <outils-banane> <dossier-lot> <partie> <cuts-detail.json> <sortie.json>   (lecture seule) */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, partieS, cutsFic, sortie] = process.argv.slice(2); const partie = Number(partieS);
const Poses = require(path.join(outils, 'precision-poses.cjs')); const j = Poses.lireJournalDir(lotDir); const cuts = JSON.parse(fs.readFileSync(cutsFic)); const par = new Map(cuts.map(c => [c.cut, c]));
const sh = new Map(); for (const e of j.events) if (e.type === 'gcv1-shadow-observed' && e.identity && e.identity.part === partie) sh.set(e.identity.cut, e.lotObservation || {});
const A = c => { const L = sh.get(c); return L && Array.isArray(L.anchorsUsed) ? L.anchorsUsed : null; };
const jug = c => c && c.pose && (c.etat === 'corrige' || c.etat === 'controle');
const memo = new Map();
function depth(c) { if (memo.has(c)) return memo.get(c); const x = par.get(c); let r = null;
  if (x && x.pose) { const a = A(c); if (a !== null) { if (!a.length) r = 0; else { const ds = a.map(k => par.get(k) && par.get(k).pose ? depth(k) : null).filter(v => v !== null); r = ds.length ? 1 + Math.min(...ds) : null; } } }
  memo.set(c, r); return r; }
const tab = {};
for (const c of cuts.filter(x => x.pose)) { const d = depth(c.cut), k = d === null ? 'chaîne inconnue ou sans racine' : d === 0 ? 'racine (0 appui)' : d > 3 ? 'profondeur > 3' : 'profondeur ' + d;
  const t = tab[k] = tab[k] || { posés: 0, jugés: 0, faux: 0, plus20: 0 }; t.posés++; if (jug(c)) { t.jugés++; if (c.mauvaiseVoie) t.faux++; if (c.mm > 20) t.plus20++; } }
const diff = new Set(cuts.filter(c => !c.pose).map(c => c.cut)); const deuxPrec = c => diff.has(c - 1) || diff.has(c - 2);
const r3 = cuts.filter(c => c.pose && deuxPrec(c.cut) && (A(c.cut) || []).length < 2), r3j = r3.filter(jug);
const nFaux = cuts.filter(c => jug(c) && c.mauvaiseVoie).length;
const out = { partie, fragilite: tab, R3: { posésSignalés: r3.length, jugésSignalés: r3j.length, faux: r3j.filter(c => c.mauvaiseVoie).length, plus20: r3j.filter(c => c.mm > 20).length, fauxTotal: nFaux }, fauxParProfondeur: cuts.filter(c => c.mauvaiseVoie).map(c => [c.cut, depth(c.cut)]) };
fs.writeFileSync(sortie, JSON.stringify(out, null, 1)); console.log(JSON.stringify(out.R3), JSON.stringify(out.fragilite));
