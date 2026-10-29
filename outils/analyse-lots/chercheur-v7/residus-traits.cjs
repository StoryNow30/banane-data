#!/usr/bin/env node
'use strict';
/* residus-traits.cjs — corrélation de rang (Spearman) entre le résidu signé de H1 (opérateur − H1, lat et vert) et les traits numériques de H1 (CH-012, suite D-266).
 * Découverte sur un jeu (partie 17, réglage) ; à répliquer sur un autre jeu avant toute hypothèse. Nombre de comparaisons écrit : p seuil de Bonferroni = 0,05 / comparaisons. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const fini = Number.isFinite;
const lignes = new Map();
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H1')) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation') continue;
  const mic = c.etiquette && c.etiquette.mic && c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal)) continue;
  const k = h.cut + '|' + h.rail, r = mic.map((x, i) => x - h.decal[i]), d = Math.hypot(...r);
  if (!lignes.has(k) || d < lignes.get(k).d) lignes.set(k, { cut: h.cut, rail: h.rail, d, lat: r[1], vert: r[2], t: h.traits, hauteur: h.hauteur === true ? 1 : 0, cote: h.rail === 'left' ? 0 : 1, ctx: c.contexte || {} });
}
const R = [...lignes.values()];
const rang = v => { const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]), r = new Array(v.length); let i = 0; while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2; i = j + 1; } return r; };
const pearson = (a, b) => { const n = a.length, ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n; let s = 0, sa = 0, sb = 0; for (let i = 0; i < n; i++) { s += (a[i] - ma) * (b[i] - mb); sa += (a[i] - ma) ** 2; sb += (b[i] - mb) ** 2; } return sa && sb ? s / Math.sqrt(sa * sb) : null; };
const noms = new Set(); for (const r of R) for (const [k, v] of Object.entries(r.t || {})) if (fini(v)) noms.add(k);
const cand = [...noms].map(n => ['t.' + n, r => r.t[n]]).concat([['hauteur', r => r.hauteur], ['cote', r => r.cote], ['ctx.ecartDepartMm', r => r.ctx.ecartDepartMm], ['ctx.appuisChaine', r => r.ctx.appuisChaine]]);
const sortie = [];
for (const [nom, f] of cand) {
  const it = R.filter(r => fini(f(r))); if (it.length < 40) continue;
  const x = rang(it.map(f)); const out = { trait: nom, n: it.length };
  for (const ax of ['lat', 'vert']) { const rho = pearson(x, rang(it.map(r => r[ax]))); out[ax] = rho === null ? null : Math.round(rho * 100) / 100; out['t' + ax] = rho === null ? null : Math.round(rho * Math.sqrt((it.length - 2) / (1 - rho * rho)) * 10) / 10; }
  sortie.push(out);
}
sortie.sort((a, b) => Math.max(Math.abs(b.tlat || 0), Math.abs(b.tvert || 0)) - Math.max(Math.abs(a.tlat || 0), Math.abs(a.tvert || 0)));
console.log(JSON.stringify({ rails: R.length, comparaisons: sortie.length * 2, note: 'rho de Spearman ; t ≈ rho·racine((n−2)/(1−rho²)) ; |t| > 3,5 environ pour Bonferroni à 5 % sur ce nombre de comparaisons', top: sortie.slice(0, 10) }, null, 1));
