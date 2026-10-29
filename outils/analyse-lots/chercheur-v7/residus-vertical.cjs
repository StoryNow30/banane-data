#!/usr/bin/env node
'use strict';
/* residus-vertical.cjs — le résidu vertical signé (opérateur − H1) dépend-il de la densité de points ? SANS sélection par l'écart à l'opérateur :
 * H1 « publiée » (balises astar-published), variante sans hauteur apprise et variante avec, séparément. Descriptif ; découverte sur un jeu, réplication sur un autre. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const q = (v, p) => { v = v.slice().sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
const R = { sans: [], avec: [] };
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H1' && l.traits && l.traits.publiee)) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation') continue;
  const mic = c.etiquette && c.etiquette.mic && c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal)) continue;
  const r = mic.map((x, i) => x - h.decal[i]);
  R[h.hauteur ? 'avec' : 'sans'].push({ cut: h.cut, rail: h.rail, lat: r[1], vert: r[2], pd: h.traits.pointsDessus, pf: h.traits.pointsFlanc, perte: h.traits.perte, du: h.traits.duConventionMm, dz: h.traits.dzConventionMm, hMm: h.traits.hauteurMm });
}
const out = {};
for (const [nom, items] of Object.entries(R)) {
  const o = { n: items.length, cuts: new Set(items.map(r => r.cut)).size, vertMediane: items.length ? Math.round(100 * med(items.map(r => r.vert))) / 100 : null, latMediane: items.length ? Math.round(100 * med(items.map(r => r.lat))) / 100 : null };
  const pd = items.map(r => r.pd).filter(Number.isFinite);
  if (pd.length >= 30) { const t1 = q(pd, 1 / 3), t2 = q(pd, 2 / 3); o.terciles = {}; for (const [n, f] of [['pointsDessusBas', r => r.pd <= t1], ['pointsDessusMoyen', r => r.pd > t1 && r.pd <= t2], ['pointsDessusHaut', r => r.pd > t2]]) { const s = items.filter(r => Number.isFinite(r.pd) && f(r)); o.terciles[n] = { n: s.length, seuilPoints: n === 'pointsDessusBas' ? t1 : n === 'pointsDessusMoyen' ? t2 : null, vertMediane: Math.round(100 * med(s.map(r => r.vert))) / 100, latMediane: Math.round(100 * med(s.map(r => r.lat))) / 100 }; } }
  out[nom] = o;
}
console.log(JSON.stringify(out, null, 1));
