#!/usr/bin/env node
'use strict';
/* fidelite.cjs — étape 1 de CONCEPTION-REJEU : le profil « base » retrouve-t-il la pose du journal ? (réglage seul, lignes déjà filtrées) */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut');
const fini = Number.isFinite, d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const c = { cuts: L.length, reelPose: 0, reelPoseRejoueePose: 0, comparables: 0, sansNuage: 0, a05: 0, a2: 0, a10: 0, erreurs: 0, etatsRejoue: {} };
const ecarts = [];
for (const l of L) {
  if (!l.reel.pose) continue;
  c.reelPose++;
  const p = l.profils && l.profils.base;
  if (!p) continue;
  c.etatsRejoue[p.etat + '/' + (p.source || '-')] = (c.etatsRejoue[p.etat + '/' + (p.source || '-')] || 0) + 1;
  if (p.source === 'reel-sans-nuage') { c.sansNuage++; continue; }
  if (p.source === 'erreur-moteur') { c.erreurs++; continue; }
  if (p.etat !== 'pose') continue;
  c.reelPoseRejoueePose++;
  const r = l.reel.decal, q = p.decal;
  if (!r || !q || !r.left || !r.right || !q.left || !q.right) continue;
  const m = Math.max(d3(r.left, q.left), d3(r.right, q.right));
  if (!fini(m)) continue;
  c.comparables++; ecarts.push(m);
  if (m <= 0.5) c.a05++; if (m <= 2) c.a2++; if (m <= 10) c.a10++;
}
ecarts.sort((a, b) => a - b);
const q = p => ecarts.length ? ecarts[Math.min(ecarts.length - 1, Math.floor(p * ecarts.length))] : null;
const wilson = (k, n) => { if (!n) return null; const z = 1.96, p = k / n, d = 1 + z * z / n, ce = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.round(1000 * (ce - m) / d) / 10, Math.round(1000 * (ce + m) / d) / 10]; };
console.log(JSON.stringify({ ...c, part05: c.comparables ? Math.round(1000 * c.a05 / c.comparables) / 10 : null, ic05: wilson(c.a05, c.comparables),
  part05SurPosesReelles: c.reelPose ? Math.round(1000 * c.a05 / c.reelPose) / 10 : null, mediane: q(0.5), p90: q(0.9), max: ecarts[ecarts.length - 1] ?? null }, null, 1));
