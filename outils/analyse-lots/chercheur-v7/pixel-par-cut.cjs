#!/usr/bin/env node
'use strict';
/* pixel-par-cut.cjs — le résidu rejeu-journal est-il uniforme sur [−pixelMm, 0] où pixelMm est celui de la vue au moment de la pose ?
 * Réglage seul (les lignes du rejeu sont déjà filtrées ; le journal est lu cut par cut pour les seuls cuts présents dans ces lignes). */
const fs = require('node:fs');
const [rejeu, journalFichier] = process.argv.slice(2);
const L = fs.readFileSync(rejeu, 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut' && l.reel.pose && l.profils.base.etat === 'pose');
const voulus = new Set(L.map(l => l.cut));
const j = JSON.parse(fs.readFileSync(journalFichier, 'utf8'));
const px = new Map();
for (const e of j.events) if (e.type === 'applied-verified' && e.identity && voulus.has(e.identity.cut) && e.observed && e.observed.vueFin && Number.isFinite(e.observed.vueFin.pixelMm)) px.set(e.identity.cut, e.observed.vueFin.pixelMm);
const u = [], pxs = [];
let sansPixel = 0;
for (const l of L) {
  const p = px.get(l.cut); if (!(p > 0)) { sansPixel++; continue; }
  pxs.push(p);
  for (const s of ['left', 'right']) for (const i of [1, 2]) u.push((l.profils.base.decal[s][i] - l.reel.decal[s][i]) / p);   // attendu dans [−1, 0]
}
u.sort((a, b) => a - b);
const n = u.length; let ks = 0; u.forEach((x, k) => { const F = Math.min(1, Math.max(0, x + 1)); ks = Math.max(ks, Math.abs((k + 1) / n - F), Math.abs(k / n - F)); });
const q = (a, p) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
pxs.sort((a, b) => a - b);
console.log(JSON.stringify({ cutsAvecPixel: pxs.length, sansPixel, pixelMmQuantiles: [q(pxs, 0), q(pxs, .5), q(pxs, 1)].map(x => +x.toFixed(3)), n,
  residuNormalise: { min: +u[0].toFixed(3), mediane: +q(u, .5).toFixed(3), max: +u[n - 1].toFixed(3) }, partDansMoinsUnZero: +(u.filter(x => x >= -1.05 && x <= 0.05).length / n).toFixed(3),
  partSousDemiPixel: +(u.filter(x => Math.abs(x) <= 0.5).length / n).toFixed(3), ksContreUniformeMoins1a0: +ks.toFixed(3) }, null, 1));
