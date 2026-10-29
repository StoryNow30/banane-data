#!/usr/bin/env node
'use strict';
/* residus.cjs — structure des écarts signés de la pose de l'opérateur contre la meilleure hypothèse de la GCV2 (CH-012, suite D-266).
 * Entrée : un jeu filtré (jeu-reglage.jsonl ou, pour une partie en apprentissage, un jeu complet). Par rail à référence « validation » :
 *   mic = pose de l'opérateur moins pose de départ, repère profil [long, lat, vert] ; chaque hypothèse a un décalage [long, lat, vert] du même repère.
 *   résidu(hyp) = mic − décalage(hyp) ; on prend H1 (proposition du moteur) et H* (l'hypothèse la plus proche de l'opérateur, 3D).
 * Sortie : médianes signées par axe et par strate (côté, zone, rôle), avec intervalle bootstrap par blocs de 20 cuts. Descriptif, aucun réglage. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const fini = Number.isFinite, med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const par = new Map();
for (const h of L.filter(l => l.type === 'hyp')) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation' || !c.etiquette || !c.etiquette.mic) continue;
  const mic = c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal) || h.decal.length < 3) continue;
  const r = mic.map((x, i) => x - h.decal[i]), k = h.cut + '|' + h.rail;
  if (!par.has(k)) par.set(k, { cut: h.cut, rail: h.rail, zone: c.zone, role: c.role, mic, h1: null, best: null });
  const p = par.get(k), d = Math.hypot(...r);
  if (h.origine === 'H1' && (!p.h1 || d < p.h1.d)) p.h1 = { r, d };
  if (!p.best || d < p.best.d) p.best = { r, d, o: h.origine };
}
const rails = [...par.values()].filter(r => r.h1);
function blocs(items, f, rep = 1000) { const G = new Map(); for (const it of items) { const b = Math.floor(it.cut / 20); if (!G.has(b)) G.set(b, []); G.get(b).push(it); }
  const g = [...G.values()]; if (g.length < 2) return [null, null]; let s = 20261029 >>> 0; const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const v = []; for (let i = 0; i < rep; i++) { const S = []; for (let j = 0; j < g.length; j++) S.push(...g[Math.floor(rnd() * g.length)]); v.push(f(S)); } v.sort((a, b) => a - b); return [Math.round(100 * v[25]) / 100, Math.round(100 * v[974]) / 100]; }
function strate(nom, items, hyp) {
  const o = { n: items.length, cuts: new Set(items.map(r => r.cut)).size };
  for (const [i, ax] of [[1, 'lat'], [2, 'vert'], [0, 'long']]) { const f = S => med(S.map(r => r[hyp].r[i])); o[ax] = { mediane: Math.round(100 * f(items)) / 100, ic: blocs(items, f) }; }
  o.d3mediane = Math.round(100 * med(items.map(r => r[hyp].d))) / 100; return [nom, o];
}
const sortie = {};
for (const hyp of ['h1', 'best']) {
  const S = {};
  const defs = [['tous', rails], ['gauche', rails.filter(r => r.rail === 'left')], ['droit', rails.filter(r => r.rail === 'right')]];
  for (const z of new Set(rails.map(r => r.zone))) defs.push(['zone-' + z, rails.filter(r => r.zone === z)]);
  for (const z of new Set(rails.map(r => r.role))) defs.push(['role-' + z, rails.filter(r => r.role === z)]);
  for (const [n, it] of defs) if (it.length >= 15) { const [k, v] = strate(n, it, hyp); S[k] = v; }
  sortie[hyp] = S;
}
console.log(JSON.stringify({ rails: rails.length, ...sortie }, null, 1));
