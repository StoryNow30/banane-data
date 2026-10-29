#!/usr/bin/env node
'use strict';
/* manques.cjs — où l'opérateur pose-t-il un rail qu'AUCUNE hypothèse H0 à H6 ne couvre (oracle > seuil) ? Partie en apprentissage ou réglage (CH-012, suite D-266).
 * Par rail à référence « validation » : meilleure hypothèse (3D), part des rails où elle est à plus de 3 / 5 / 10 mm, selon le rôle et la zone du cut, l'écartement de départ,
 * le nombre d'hypothèses ; résidu signé de la meilleure hypothèse (opérateur − H*, repère profil) pour les rails manqués. Descriptif. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const par = new Map();
for (const h of L.filter(l => l.type === 'hyp')) {
  const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation' || !c.etiquette || !c.etiquette.mic) continue;
  const mic = c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal)) continue;
  const r = mic.map((x, i) => x - h.decal[i]), d = Math.hypot(...r), k = h.cut + '|' + h.rail;
  if (!par.has(k)) par.set(k, { cut: h.cut, rail: h.rail, role: c.role, zone: c.zone, etage: c.moteur && c.moteur.etage, micD: Math.hypot(...mic), nh: 0, best: null, h0: null });
  const p = par.get(k); p.nh++; if (h.origine === 'H0') p.h0 = d; if (!p.best || d < p.best.d) p.best = { d, r, o: h.origine };
}
const R = [...par.values()];
const part = (S, s) => S.length ? Math.round(1000 * S.filter(r => r.best.d > s).length / S.length) / 10 : null;
const strate = (nom, S) => ({ strate: nom, n: S.length, manque3: part(S, 3), manque5: part(S, 5), manque10: part(S, 10), operateurDeplace3d_mediane: Math.round(100 * med(S.map(r => r.micD))) / 100 });
const out = { rails: R.length, cuts: new Set(R.map(r => r.cut)).size, strates: [strate('tous', R)] };
for (const k of ['role', 'zone', 'etage']) for (const v of new Set(R.map(r => r[k]))) { const S = R.filter(r => r[k] === v); if (S.length >= 15) out.strates.push(strate(k + '=' + v, S)); }
const ecart = [['micD>20mm (le rail a beaucoup bougé)', R.filter(r => r.micD > 20)], ['micD<=20mm', R.filter(r => r.micD <= 20)]];
for (const [n, S] of ecart) if (S.length >= 15) out.strates.push(strate(n, S));
const manq = R.filter(r => r.best.d > 5);
out.manques5 = { n: manq.length, residuSigneMedianMm: { lat: Math.round(100 * med(manq.map(r => r.best.r[1]))) / 100, vert: Math.round(100 * med(manq.map(r => r.best.r[2]))) / 100, long: Math.round(100 * med(manq.map(r => r.best.r[0]))) / 100 },
  ecartMedianMm: Math.round(100 * med(manq.map(r => r.best.d))) / 100, parOrigineDuMeilleur: manq.reduce((a, r) => (a[r.best.o] = (a[r.best.o] || 0) + 1, a), {}) };
console.log(JSON.stringify(out, null, 1));
