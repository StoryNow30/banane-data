#!/usr/bin/env node
'use strict';
/* hypotheses-reglage.cjs — par rail, écart à la pose de l'opérateur de H0 (pose de départ d'ESV), H1 (A* du moteur) et de l'oracle (meilleure
 * hypothèse H0 à H6), sur le jeu filtré du RÉGLAGE. L'oracle est une BORNE HAUTE de ce qu'une sélection pourrait gagner, pas un résultat. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const wilson = (k, n) => { if (!n) return [null, null]; const z = 1.96, p = k / n, q = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.round(1000 * (c - m) / q) / 10, Math.round(1000 * (c + m) / q) / 10]; };
const par = new Map();
for (const h of L.filter(l => l.type === 'hyp')) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule') continue;
  const e = h.etiquette && h.etiquette.ecartMm; if (!Number.isFinite(e)) continue;
  const k = h.cut + '|' + h.rail; if (!par.has(k)) par.set(k, { cut: h.cut, ref: c.reference, h0: null, h1: null, min: Infinity, n: 0 });
  const r = par.get(k); r.n++; r.min = Math.min(r.min, e);
  if (h.origine === 'H0') r.h0 = r.h0 === null ? e : Math.min(r.h0, e);
  if (h.origine === 'H1') r.h1 = r.h1 === null ? e : Math.min(r.h1, e);
}
const rails = [...par.values()];
const stat = (sel, nom) => { const v = rails.map(sel).filter(Number.isFinite); const o = { n: v.length };
  for (const s of [3, 5, 10]) { const k = v.filter(x => x <= s).length; o['sous' + s] = { k, part: Math.round(1000 * k / v.length) / 10, ic: wilson(k, v.length) }; }
  v.sort((a, b) => a - b); o.mediane = Math.round(v[v.length >> 1] * 100) / 100; o.p90 = Math.round(v[Math.floor(0.9 * v.length)] * 100) / 100; return [nom, o]; };
const out = { rails: rails.length, parReference: rails.reduce((a, r) => (a[r.ref] = (a[r.ref] || 0) + 1, a), {}),
  ...Object.fromEntries([stat(r => r.h0, 'H0_depart_ESV'), stat(r => r.h1, 'H1_proposition_moteur'), stat(r => r.min, 'oracle_meilleure_hypothese')]),
  note: 'Écart par rail à la pose de l’opérateur, mm, 3D ; réglage seul ; l’oracle est une borne haute.' };
console.log(JSON.stringify(out, null, 1));
