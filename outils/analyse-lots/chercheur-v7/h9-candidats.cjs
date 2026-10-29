#!/usr/bin/env node
'use strict';
/* h9-candidats.cjs — le décalage latéral cible est-il l'UNE des valeurs de décalage portées par les voisins sûrs (choix discret) ? Partie en apprentissage, famille « tous ».
 * Rails déplacés de plus de 20 mm par l'opérateur. Oracle : part des rails où au moins un voisin (dans ±10 cuts) a un décalage à 5 / 10 mm de la cible, selon le nombre de voisins
 * considérés (les 1, 3, 5, tous plus proches) ; comparé à ce que H6 (proche, médiane de 5) fait. Descriptif. */
const fs = require('node:fs');
const [jeuF, voisF] = process.argv.slice(2);
const L = fs.readFileSync(jeuF, 'utf8').split('\n').filter(Boolean).map(JSON.parse), V = new Map();
for (const v of JSON.parse(fs.readFileSync(voisF, 'utf8'))) { const o = V.get(v.cut) || { cut: v.cut, lot: [], tous: [] }; if (v.lot.length > o.lot.length) o.lot = v.lot; if (v.tous.length > o.tous.length) o.tous = v.tous; V.set(v.cut, o); }
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const bases = new Map();
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H6' && l.sous === 'h6-lot-proche-rail')) { const v = V.get(h.cut); if (v && v.lot.length) bases.set(h.cut + '|' + h.rail, { cut: h.cut, rail: h.rail, base: h.decal[1] - v.lot[0][h.rail][0] }); }
const R = [];
for (const b of bases.values()) {
  const c = cuts.get(b.cut); if (!c || c.reference !== 'validation' || !c.etiquette || !c.etiquette.mic) continue;
  const mic = c.etiquette.mic[b.rail]; if (!(Math.abs(mic[1]) > 20)) continue;
  const cible = mic[1] - b.base, n = V.get(b.cut).tous.map(x => ({ dx: x.cut - b.cut, v: x[b.rail][0], s: x.source })).sort((p, q) => Math.abs(p.dx) - Math.abs(q.dx));
  if (n.length < 1) continue;
  R.push({ cut: b.cut, nn: n.length, err: n.map(x => Math.abs(x.v - cible)), humains: n.filter(x => x.s === 'humain').length });
}
const part = (S, f) => Math.round(1000 * S.filter(f).length / (S.length || 1)) / 10;
const out = { rails: R.length, parNombreDeVoisins: {} };
for (const K of [1, 3, 5, 99]) { const S = R.filter(r => r.nn >= Math.min(K, 3)); out.parNombreDeVoisins['K=' + K] = { n: S.length, unVoisinA5mm: part(S, r => Math.min(...r.err.slice(0, K)) <= 5), unVoisinA10mm: part(S, r => Math.min(...r.err.slice(0, K)) <= 10) }; }
out.voisinsMoyens = Math.round(10 * R.reduce((s, r) => s + r.nn, 0) / R.length) / 10;
console.log(JSON.stringify(out, null, 1));
