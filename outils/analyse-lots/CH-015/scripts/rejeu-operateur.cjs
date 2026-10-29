/* CH-015 tâche 7 : pose écrite par le rejeu (maquette) contre la pose de l'OPÉRATEUR (Écho), là où l'Écho existe.
 * node rejeu-operateur.cjs <racine-banane-ou-tronc> <outils-banane> <export-reduit> <lignes-echo.json> <cuts-p20.json> <sortie.json> nom=rapport.json [...]
 * Pose rejouée : corps d'écriture reçu par la maquette (monde) − T (monde − scène, mesurée sur les écritures de l'export comme le fait le lecteur) → scène ;
 * décalage depuis la pose de départ d'ESV dans le repère profil du départ (J.ecartRail) ; pose de l'opérateur = J.micDepuisDepart. Écart d'un cut = pire rail, (latéral, vertical), mm. */
const fs = require('node:fs'), path = require('node:path');
const [racine, outils, expDir, lignesFic, cutsFic, sortie, ...runs] = process.argv.slice(2);
const J = require(path.join(outils, 'jointure-echo-orbite.cjs')); const { charger } = require(path.join(racine, 'tests/esv-maquette/lecteur-export.cjs'));
const doc = charger(expDir); const id = r => r.identity || (r.before && r.before.identity) || (Number.isInteger(r.cut) ? { part: r.part, cut: r.cut } : null);
const lignes = new Map(JSON.parse(fs.readFileSync(lignesFic)).lignes.map(l => [l.cut, l])); const orig = new Map(JSON.parse(fs.readFileSync(cutsFic)).map(c => [c.cut, c]));
const E = ['XLeftEdge', 'YLeftEdge', 'ZLeftEdge', 'XRightEdge', 'YRightEdge', 'ZRightEdge'];
/* pose de départ d'ESV : rails.*.initial (cuts posés) ou before.rails.* (cuts différés) */
const depart = (r, c) => (r.rails && r.rails[c] && r.rails[c].initial) || (r.before && r.before.rails && r.before.rails[c]) || null;
const recDe = new Map(); for (const r of doc.records) { const i = id(r); const L = depart(r, 'left'), Rr = depart(r, 'right'); if (i && !recDe.has(i.cut) && L && Rr && L.positionSceneRelative && Rr.positionSceneRelative) recDe.set(i.cut, { left: L, right: Rr }); }
/* T monde − scène */
const Ts = []; for (const e of doc.events) { if (!(e.body && E.every(k => Number.isFinite(e.body[k])))) continue; const r = doc.records.find(r => id(r) && id(r).cut === e.rowIndex && r.rails && r.rails.left && r.rails.left.corrected && r.rails.right && r.rails.right.corrected && r.rails.left.corrected.positionSceneRelative); if (!r) continue;
  const dl = [0, 1, 2].map(i => e.body[E[i]] - r.rails.left.corrected.positionSceneRelative[i]), dr = [0, 1, 2].map(i => e.body[E[3 + i]] - r.rails.right.corrected.positionSceneRelative[i]); Ts.push([0, 1, 2].map(i => (dl[i] + dr[i]) / 2)); }
const med = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; }; const T = [0, 1, 2].map(i => med(Ts.map(t => t[i])));
const out = { T_mesures: Ts.length, runs: {} };
for (const nr of runs) {
  const [nom, f] = nr.split('=', 2); const rep = JSON.parse(fs.readFileSync(f)).journal.events; const w = new Map();
  for (const e of rep) if (e.type === 'esv-observation' && e.kind === 'write' && e.body && E.every(k => Number.isFinite(e.body[k])) && Number.isInteger(e.rowIndex)) w.set(e.rowIndex, e.body);
  const lignesRes = [];
  for (const [cut, b] of w) {
    const l = lignes.get(cut), r = recDe.get(cut); if (!l || !r || l.referenceHumaine !== 'observee') continue; const ref = J.micDepuisDepart(l); if (!ref) continue;
    const d = {}; for (const [cote, en, off] of [['gauche', 'left', 0], ['droite', 'right', 3]]) {
      const pos = [0, 1, 2].map(i => b[E[off + i]] - T[i]); const ec = J.ecartRail(r[en], { positionSceneRelative: pos }); if (!ec || ec.repere !== 'profil') { d[cote] = null; continue; }
      const v = ref[en]; d[cote] = v ? Math.hypot(ec.lateralMm - v[1], ec.verticalMm - v[2]) : null; }
    const m = Math.max(d.gauche ?? NaN, d.droite ?? NaN); if (!Number.isFinite(m)) continue;
    const o = orig.get(cut); lignesRes.push({ cut, rejeuMm: +m.toFixed(1), origineMm: o && o.pose && Number.isFinite(o.mm) ? o.mm : null, origineEtat: o ? (o.pose ? 'posé' : 'différé') : null });
  }
  const R = lignesRes.map(x => x.rejeuMm), n = R.length, c = t => R.filter(x => x > t).length;
  out.runs[nom] = { posesRejoueesJugeables: n, medianeMm: n ? med(R) : null, plus10: c(10), plus20: c(20), plus50: c(50), cuts: lignesRes };
}
fs.writeFileSync(sortie, JSON.stringify(out, null, 1)); console.log(JSON.stringify({ T_mesures: out.T_mesures, runs: Object.fromEntries(Object.entries(out.runs).map(([k, v]) => [k, { n: v.posesRejoueesJugeables, med: v.medianeMm, plus10: v.plus10, plus20: v.plus20, plus50: v.plus50 }])) }));
