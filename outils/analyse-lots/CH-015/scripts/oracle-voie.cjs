/* CH-015 tâche 5 (A) : diagnostic « oracle » du choix de voie. Quand la pose est fausse, la bonne paire de rails (la pose de l'opérateur) est-elle
 * parmi les candidats que le moteur ou la GCV2 avaient devant eux ? Borne haute d'un décodage de voie : si l'oracle ne trouve rien, aucun décodage
 * des candidats existants ne peut gagner.
 * node oracle-voie.cjs <outils-banane> <dossier-lot> <lignes-echo.json> <partie> <cuts-detail.json> <sortie.json>
 * Vérité : pose de l'opérateur en décalage depuis la pose de départ d'ESV (profil, mm), J.micDepuisDepart. Candidats (mm, [latéral, vertical] du même repère) :
 * par rail, v46.delta, astar.delta, next.delta et rawDelta, les alternatives de v46 et astar ; en plus, la paire de GCV2 L1 (l1.paire) si elle existe.
 * Un candidat « trouve » la vérité s'il est à moins de T mm (2D latéral-vertical) ; la paire est trouvée si les deux rails le sont. Lecture seule. */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, lignesFic, partieS, cutsFic, sortie] = process.argv.slice(2); const partie = Number(partieS);
const J = require(path.join(outils, 'jointure-echo-orbite.cjs')), Poses = require(path.join(outils, 'precision-poses.cjs'));
const lignes = new Map(JSON.parse(fs.readFileSync(lignesFic)).lignes.map(l => [l.cut, l])); const cuts = JSON.parse(fs.readFileSync(cutsFic));
const journal = Poses.lireJournalDir(lotDir); const shadow = new Map();
for (const e of journal.events) if (e.type === 'gcv1-shadow-observed' && e.identity && e.identity.part === partie) shadow.set(e.identity.cut, e);
const fini = Number.isFinite, d3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fini) ? [a[1] * 1000, a[2] * 1000] : null, d2 = (a) => Array.isArray(a) && a.length === 2 && a.every(fini) ? [a[0] * 1000, a[1] * 1000] : null;
function candidats(cut, cote) {
  const s = shadow.get(cut); if (!s) return null; const r = s.shadow.rails[cote], out = [];
  const add = (nom, v) => { if (v) out.push({ nom, v }); };
  add('v46', d3(r.v46 && r.v46.delta)); add('astar', d3(r.astar && r.astar.delta)); add('next', d3(r.next && r.next.delta)); add('nextBrut', d3(r.next && r.next.rawDelta));
  add('v46Alt', d2(r.v46 && r.v46.alternative)); add('astarAlt', d2(r.astar && r.astar.alternative));
  const l1 = s.lotObservation && s.lotObservation.l1 && s.lotObservation.l1.paire && s.lotObservation.l1.paire[cote];
  add('l1', Array.isArray(l1) && l1.length === 3 && l1.every(fini) ? [l1[1], l1[2]] : null);
  return out;
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const T = [10, 20, 50], res = { fausses: [], autres: [] };
for (const c of cuts) {
  if (!c.pose || c.etat !== 'corrige') continue;
  const l = lignes.get(c.cut), ref = l && J.micDepuisDepart(l); if (!ref) continue;
  const rec = { cut: c.cut, chemin: null, rails: {} };
  for (const [fr, en] of [['gauche', 'left'], ['droite', 'right']]) {
    const v = ref[en]; if (!v) continue; const truth = [v[1], v[2]], C = candidats(c.cut, en); if (!C || !C.length) continue;
    const ds = C.map(k => ({ nom: k.nom, d: dist(k.v, truth) })).sort((a, b) => a.d - b.d), moteur = ds.filter(k => k.nom !== 'l1');
    rec.rails[en] = { verite: truth.map(x => Math.round(x * 10) / 10), departMm: Math.round(Math.hypot(truth[0], truth[1])), meilleur: ds[0].nom, meilleurMm: Math.round(ds[0].d * 10) / 10, meilleurMoteurMm: moteur.length ? Math.round(moteur[0].d * 10) / 10 : null, n: C.length,
      latCandidatsMm: [Math.min(...C.map(k => k.v[0])), Math.max(...C.map(k => k.v[0]))].map(x => Math.round(x)) };
  }
  if (rec.rails.left && rec.rails.right) (c.mauvaiseVoie ? res.fausses : res.autres).push(rec);
}
const resume = pop => {
  const o = { n: pop.length };
  for (const t of T) {
    const rail = (f) => pop.reduce((a, r) => a + ['left', 'right'].filter(s => f(r.rails[s])).length, 0);
    o['rails_a_moins_de_' + t + 'mm_toutes_sources'] = rail(x => x.meilleurMm < t); o['rails_a_moins_de_' + t + 'mm_moteur_seul'] = rail(x => x.meilleurMoteurMm !== null && x.meilleurMoteurMm < t);
    o['paires_a_moins_de_' + t + 'mm_toutes_sources'] = pop.filter(r => ['left', 'right'].every(s => r.rails[s].meilleurMm < t)).length;
    o['paires_a_moins_de_' + t + 'mm_moteur_seul'] = pop.filter(r => ['left', 'right'].every(s => r.rails[s].meilleurMoteurMm !== null && r.rails[s].meilleurMoteurMm < t)).length;
  }
  const m = a => { a = a.filter(fini).sort((x, y) => x - y); return a.length ? a[a.length >> 1] : null; };
  o.medianeDistanceMeilleurMoteurMm = m(pop.flatMap(r => ['left', 'right'].map(s => r.rails[s].meilleurMoteurMm))); o.medianeDepartVeriteMm = m(pop.flatMap(r => ['left', 'right'].map(s => r.rails[s].departMm)));
  return o;
};
const out = { partie, definition: 'vérité = pose de l\'opérateur (Écho) ; candidat trouvé = à moins de T mm en (latéral, vertical)', fausses: resume(res.fausses), autres_corrigees: resume(res.autres), detailFausses: res.fausses };
fs.writeFileSync(sortie, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ fausses: out.fausses, autres_corrigees: out.autres_corrigees }, null, 1));
