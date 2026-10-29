#!/usr/bin/env node
'use strict';
/*
 * simulation-arrondi.cjs — simulation HORS LIGNE du clic arrondi au pixel le plus proche (hypothèse n° 1), sans toucher à la pose ni au moteur.
 *   node simulation-arrondi.cjs --rejeu rejeu-base-reglage.jsonl --ecarts par-cut-reglage.json --journal J.json --sortie simulation-arrondi-reglage.json
 *
 * Principe : le profil base du rejeu rend la cible continue T de chaque rail ; le journal rend la pose J obtenue par un clic tronqué au pixel de la vue
 * (vueFin.pixelMm). Par axe, r = T − J est la fraction de pixel perdue, dans [−pixel, 0] (confirmé : étape 1). Le pixel le plus proche de T est J si |r| < pixel/2,
 * sinon J − pixel (même sens que r). La pose simulée J' = J + (r ≤ −pixel/2 ? −pixel : 0). Écart simulé à l'opérateur = (opérateur − J) − (J' − J).
 * Limites : axes de la vue pris pour axes latéral et vertical du profil (le dévers les fait tourner de quelques degrés) ; seuls les rails que l'opérateur a
 * DÉPLACÉS (écart > 0) ont une référence ; un rail laissé tel quel (« contrôlé, bon », « visite sans action ») n'est pas utilisable : sa référence est J lui-même.
 */
const fs = require('node:fs');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const rejeu = new Map(fs.readFileSync(a.rejeu, 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut').map(l => [l.cut, l]));
const ecarts = JSON.parse(fs.readFileSync(a.ecarts, 'utf8')).cuts;
const voulus = new Set(ecarts.filter(c => c.etat === 'corrige').map(c => c.cut));
const j = JSON.parse(fs.readFileSync(a.journal, 'utf8')), px = new Map();
for (const e of j.events) if (e.type === 'applied-verified' && e.identity && voulus.has(e.identity.cut) && e.observed && e.observed.vueFin && e.observed.vueFin.pixelMm > 0) px.set(e.identity.cut, e.observed.vueFin.pixelMm);
const lignes = [];
for (const c of ecarts) {
  if (c.etat !== 'corrige' || !px.has(c.cut) || !rejeu.has(c.cut)) continue;
  const rj = rejeu.get(c.cut); if (!rj.reel.pose || !rj.profils.base.decal || !rj.reel.decal) continue;
  const p = px.get(c.cut);
  for (const [cote, s] of [['gauche', 'left'], ['droite', 'right']]) {
    const e = c[cote]; if (!e || !(e.d3 > 0)) continue;                     // rail non déplacé : pas de référence utilisable
    const r = [1, 2].map(i => rj.profils.base.decal[s][i] - rj.reel.decal[s][i]);   // [lat, vert]
    const dep = r.map(x => (x <= -p / 2 ? -p : 0));                          // J' − J
    const avant = [e.lat, e.vert], apres = avant.map((v, k) => v - dep[k]);
    lignes.push({ avant: Math.hypot(...avant), apres: Math.hypot(...apres), dLat: Math.abs(apres[0]) - Math.abs(avant[0]), dVert: Math.abs(apres[1]) - Math.abs(avant[1]), arrondiLat: dep[0] !== 0, arrondiVert: dep[1] !== 0 });
  }
}
const q = (v, p) => { v = v.slice().sort((x, y) => x - y); return v.length ? Math.round(v[Math.min(v.length - 1, Math.floor(p * v.length))] * 100) / 100 : null; };
const part = (v, s) => v.filter(x => x <= s).length;
const av = lignes.map(l => l.avant), ap = lignes.map(l => l.apres);
const res = { rails: lignes.length, partArrondisLat: Math.round(1000 * lignes.filter(l => l.arrondiLat).length / (lignes.length || 1)) / 10, partArrondisVert: Math.round(1000 * lignes.filter(l => l.arrondiVert).length / (lignes.length || 1)) / 10,
  avant: { mediane: q(av, .5), p90: q(av, .9), sous3: part(av, 3), sous5: part(av, 5) }, apres: { mediane: q(ap, .5), p90: q(ap, .9), sous3: part(ap, 3), sous5: part(ap, 5) },
  note: 'rails déplacés par l’opérateur seulement ; écart 2D (latéral, vertical) à la validation de l’opérateur ; réglage seul' };
if (a.sortie) fs.writeFileSync(a.sortie, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
