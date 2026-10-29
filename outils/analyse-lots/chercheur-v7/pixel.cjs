#!/usr/bin/env node
'use strict';
/* pixel.cjs — test direct de l'hypothèse « l'écart rejeu-journal est l'arrondi au pixel du clic » (étape 1, réglage seul).
 * Prédiction d'un arrondi au pixel de grain g : le résidu (rejeu moins journal) par axe est uniforme sur un intervalle de largeur g
 * (donc entre −g et 0, ou 0 et g, selon le sens de l'axe), et son module est sous g. On ne peut pas quantifier la pose rejouée sur
 * la grille absolue : la grille de pixels suit la caméra de chaque cut et son origine n'est pas dans le journal. */
const fs = require('node:fs');
const g = 0.386;
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut' && l.reel.pose && l.profils.base.etat === 'pose');
const out = {};
for (const [i, ax] of [[1, 'lat'], [2, 'vert']]) {
  const d = [];
  for (const l of L) for (const s of ['left', 'right']) d.push(l.profils.base.decal[s][i] - l.reel.decal[s][i]);
  d.sort((a, b) => a - b);
  const n = d.length, min = d[0], max = d[n - 1];
  const dansGrain = d.filter(x => x >= -g - 0.02 && x <= 0.02).length;
  const sousDemi = d.filter(x => Math.abs(x) <= g / 2).length;
  const histo = Array(8).fill(0); for (const x of d) histo[Math.max(0, Math.min(7, Math.floor((x + 0.6) / 0.6 * 8)))]++;
  /* KS contre l'uniforme sur [−g, 0] */
  let ks = 0; d.forEach((x, k) => { const F = Math.min(1, Math.max(0, (x + g) / g)); ks = Math.max(ks, Math.abs((k + 1) / n - F), Math.abs(k / n - F)); });
  out[ax] = { n, min: +min.toFixed(3), max: +max.toFixed(3), mediane: +d[n >> 1].toFixed(3), partDansMoinsGrainZero: +(dansGrain / n).toFixed(3), partSousDemiGrain: +(sousDemi / n).toFixed(3),
    ksContreUniforme: +ks.toFixed(3), histo8SurMoins0_6a0: histo, largeurObservee: +(max - min).toFixed(3) };
}
const par = {};
for (const l of L) { const z = l.profils.base.decal; const dv = ['left', 'right'].map(s => Math.hypot(0, z[s][1] - l.reel.decal[s][1], z[s][2] - l.reel.decal[s][2])); par.cuts = (par.cuts || 0) + 1; }
const corr = (() => { const a = [], b = []; for (const l of L) for (const s of ['left', 'right']) { a.push(l.profils.base.decal[s][1] - l.reel.decal[s][1]); b.push(l.profils.base.decal[s][2] - l.reel.decal[s][2]); }
  const m = x => x.reduce((p, q) => p + q, 0) / x.length, ma = m(a), mb = m(b); let sab = 0, saa = 0, sbb = 0; for (let k = 0; k < a.length; k++) { sab += (a[k] - ma) * (b[k] - mb); saa += (a[k] - ma) ** 2; sbb += (b[k] - mb) ** 2; } return sab / Math.sqrt(saa * sbb); })();
out.correlationLatVert = +corr.toFixed(3); out.grainMm = g;
console.log(JSON.stringify(out, null, 1));
