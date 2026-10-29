#!/usr/bin/env node
'use strict';
/* hypotheses-apparie.cjs — H0, H1 et oracle sur les MÊMES rails (référence = validation de l'opérateur, H0 et H1 présents), réglage seul,
 * avec intervalle de Wilson et bootstrap par bloc de 20 cuts pour la part. L'oracle (meilleure de ~12 hypothèses) est une borne haute. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l])), par = new Map();
for (const h of L.filter(l => l.type === 'hyp')) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule') continue;
  const e = h.etiquette && h.etiquette.ecartMm; if (!Number.isFinite(e)) continue;
  const k = h.cut + '|' + h.rail; if (!par.has(k)) par.set(k, { cut: h.cut, ref: c.reference, h0: null, h1: null, min: Infinity, nh: 0 });
  const r = par.get(k); r.nh++; r.min = Math.min(r.min, e);
  if (h.origine === 'H0') r.h0 = e; if (h.origine === 'H1') r.h1 = r.h1 === null ? e : Math.min(r.h1, e);
}
const R = [...par.values()].filter(r => r.ref === 'validation' && r.h0 !== null && r.h1 !== null);
const wilson = (k, n) => { const z = 1.96, p = k / n, q = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.round(1000 * (c - m) / q) / 10, Math.round(1000 * (c + m) / q) / 10]; };
function alea(g) { let s = g >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const blocs = new Map(); for (const r of R) { const b = Math.floor(r.cut / 20); if (!blocs.has(b)) blocs.set(b, []); blocs.get(b).push(r); }
const G = [...blocs.values()], rnd = alea(20261029);
const boot = (f, s) => { const v = []; for (let i = 0; i < 2000; i++) { let k = 0, n = 0; for (let j = 0; j < G.length; j++) for (const r of G[Math.floor(rnd() * G.length)]) { n++; if (f(r) <= s) k++; } v.push(k / n); } v.sort((a, b) => a - b); return [Math.round(1000 * v[50]) / 10, Math.round(1000 * v[1949]) / 10]; };
const out = { rails: R.length, cuts: new Set(R.map(r => r.cut)).size, blocs: G.length, note: 'mêmes rails pour les trois lignes ; réglage seul ; oracle = borne haute', lignes: {} };
for (const [nom, f] of [['H0_depart_ESV', r => r.h0], ['H1_proposition_moteur', r => r.h1], ['oracle', r => r.min]]) {
  out.lignes[nom] = {};
  for (const s of [3, 5, 10]) { const k = R.filter(r => f(r) <= s).length; out.lignes[nom]['sous' + s] = { k, part: Math.round(1000 * k / R.length) / 10, wilson: wilson(k, R.length), bootstrapBlocs: boot(f, s) }; }
}
console.log(JSON.stringify(out, null, 1));
