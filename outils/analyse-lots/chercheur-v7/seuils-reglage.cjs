#!/usr/bin/env node
'use strict';
/* seuils-reglage.cjs — part des poses v6 sous 3 mm et sous 5 mm contre l'opérateur, RÉGLAGE seul, avec Wilson et écart minimal détectable (CH-012). */
const fs = require('node:fs');
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const wilson = (k, n) => { if (!n) return [null, null]; const z = 1.96, p = k / n, q = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.round(1000 * (c - m) / q) / 10, Math.round(1000 * (c + m) / q) / 10]; };
const jug = d.cuts.filter(c => c.etat === 'corrige' || c.etat === 'controle');
const horsDiff = jug.filter(c => c.stage !== 'deferred');
const compte = (L, s) => { const k = L.filter(c => c.max3d <= s).length; return { n: L.length, k, part: Math.round(1000 * k / L.length) / 10, ic: wilson(k, L.length) }; };
/* Écart minimal détectable entre deux versions (deux proportions indépendantes, bilatéral 5 %, puissance 80 %), autour de p0, pour n cuts par version. */
function emd(p0, n) { const za = 1.96, zb = 0.8416; for (let dlt = 0.005; dlt < 1 - p0; dlt += 0.005) { const p1 = p0 + dlt, pb = (p0 + p1) / 2, se = Math.sqrt(2 * pb * (1 - pb) / n); if (dlt >= (za + zb) * se) return Math.round(dlt * 1000) / 10; } return null; }
/* Même chose en appariant les mêmes cuts : n_net = (za+zb)^2 * pd / delta^2, pd = part de cuts discordants (SUPPOSÉE, 0,15). */
const nApparie = (delta, pd = 0.15) => Math.ceil((1.96 + 0.8416) ** 2 * pd / delta ** 2);
const out = { populations: { jugesReglage: compte(jug, 3), horsDiffere: compte(horsDiff, 3) }, sous5: { jugesReglage: compte(jug, 5), horsDiffere: compte(horsDiff, 5) },
  emdPointsNonAppariee: { n28: { autour80: emd(0.8, 28) }, n150: { autour80: emd(0.8, 150) }, n400: { autour80: emd(0.8, 400) } },
  nCutsApparies: { gainDe10points: nApparie(0.10), gainDe5points: nApparie(0.05), hypothese: 'part de cuts discordants entre versions SUPPOSÉE à 15 %, non mesurée' } };
console.log(JSON.stringify(out, null, 1));
