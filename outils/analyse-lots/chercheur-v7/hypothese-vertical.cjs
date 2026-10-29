#!/usr/bin/env node
'use strict';
/* hypothese-vertical.cjs — hypothèse candidate H7 (CH-012, suite D-266) : correction verticale de la proposition H1 selon la densité de points du dessus.
 * Justification physique (à confirmer) : le gabarit est ajusté par médiane de distances ; quand le dessus du rail a peu de retours, la surface relevée sous-estime
 * la couronne que l'opérateur voit (enveloppe supérieure du nuage), donc H1 est trop bas. Correction : z += c(tercile de pointsDessus), c = médiane des résidus
 * verticaux du tercile, estimée HORS du bloc évalué (validation croisée par blocs de 20 cuts), seuils de tercile estimés de même. H1 publiée, variante sans hauteur apprise.
 * Évaluation appariée avec H1 seule, mêmes rails : parts sous 3 et 5 mm (3D), bootstrap par blocs. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const variante = process.argv[3] === 'avec' ? true : false;
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const q = (v, p) => { v = v.slice().sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
const R = [];
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H1' && l.traits && l.traits.publiee && (l.hauteur === true) === variante)) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation') continue;
  const mic = c.etiquette && c.etiquette.mic && c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal) || !Number.isFinite(h.traits.pointsDessus)) continue;
  R.push({ cut: h.cut, bloc: Math.floor(h.cut / 20), r: mic.map((x, i) => x - h.decal[i]), pd: h.traits.pointsDessus });
}
const terc = (pd, t1, t2) => pd <= t1 ? 0 : pd <= t2 ? 1 : 2;
const blocs = [...new Set(R.map(r => r.bloc))];
for (const b of blocs) {
  const app = R.filter(r => r.bloc !== b), t1 = q(app.map(r => r.pd), 1 / 3), t2 = q(app.map(r => r.pd), 2 / 3);
  const c = [0, 1, 2].map(k => med(app.filter(r => terc(r.pd, t1, t2) === k).map(r => r.r[2])));
  for (const r of R.filter(x => x.bloc === b)) { r.corr = c[terc(r.pd, t1, t2)]; r.apres = Math.hypot(r.r[0], r.r[1], r.r[2] - r.corr); }
}
for (const r of R) r.avant = Math.hypot(...r.r);
const part = (S, k, s) => S.length ? S.filter(r => r[k] <= s).length / S.length : 0;
function boot(f, rep = 2000) { const G = new Map(); for (const r of R) { if (!G.has(r.bloc)) G.set(r.bloc, []); G.get(r.bloc).push(r); } const g = [...G.values()]; let s = 20261029 >>> 0; const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; const v = []; for (let i = 0; i < rep; i++) { const S = []; for (let j = 0; j < g.length; j++) S.push(...g[Math.floor(rnd() * g.length)]); v.push(f(S)); } v.sort((a, b) => a - b); return [Math.round(1000 * v[Math.floor(.025 * rep)]) / 10, Math.round(1000 * v[Math.floor(.975 * rep)]) / 10]; }
const out = { variante: variante ? 'avec hauteur apprise' : 'sans hauteur apprise', rails: R.length, cuts: new Set(R.map(r => r.cut)).size, blocs: blocs.length, medianeAvant: Math.round(100 * med(R.map(r => r.avant))) / 100, medianeApres: Math.round(100 * med(R.map(r => r.apres))) / 100 };
for (const s of [3, 5]) out['sous' + s] = { avant: Math.round(1000 * part(R, 'avant', s)) / 10, apres: Math.round(1000 * part(R, 'apres', s)) / 10, diffPoints: Math.round(1000 * (part(R, 'apres', s) - part(R, 'avant', s))) / 10, bootBlocs: boot(S => part(S, 'apres', s) - part(S, 'avant', s)),
  hausses: R.filter(r => r.avant > s && r.apres <= s).length, baisses: R.filter(r => r.avant <= s && r.apres > s).length };
console.log(JSON.stringify(out, null, 1));
