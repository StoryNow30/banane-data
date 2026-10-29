#!/usr/bin/env node
'use strict';
/* h8-variantes.cjs — exploration RAPIDE de quelques formes de H8 sur la partie 20 (apprentissage), famille « tous » (avec voisins humains), par rail, latéral seul. Descriptif ;
 * rien n'est figé. Mesure : écart latéral de la prédiction au décalage cible, sur les rails déplacés de plus de 20 mm par l'opérateur, même population pour toutes les variantes
 * (celles où la variante la plus exigeante s'applique), avec différence appariée au voisin le plus proche (H6 « proche ») et bootstrap par blocs de 20 cuts. */
const fs = require('node:fs');
const [jeuF, voisF] = process.argv.slice(2);
const L = fs.readFileSync(jeuF, 'utf8').split('\n').filter(Boolean).map(JSON.parse), V = new Map();
for (const v of JSON.parse(fs.readFileSync(voisF, 'utf8'))) { const o = V.get(v.cut) || { cut: v.cut, lot: [], tous: [] }; if (v.lot.length > o.lot.length) o.lot = v.lot; if (v.tous.length > o.tous.length) o.tous = v.tous; V.set(v.cut, o); }
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const theil = pts => { const pe = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (pts[j][0] !== pts[i][0]) pe.push((pts[j][1] - pts[i][1]) / (pts[j][0] - pts[i][0])); const b = pe.length ? med(pe) : 0; return med(pts.map(p => p[1] - b * p[0])); };
const bases = new Map();
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H6' && l.sous === 'h6-lot-proche-rail')) { const v = V.get(h.cut); if (v && v.lot.length) bases.set(h.cut + '|' + h.rail, { cut: h.cut, rail: h.rail, base: h.decal[1] - v.lot[0][h.rail][0] }); }
const R = [];
for (const b of bases.values()) {
  const c = cuts.get(b.cut); if (!c || c.reference !== 'validation' || !c.etiquette || !c.etiquette.mic) continue;
  const mic = c.etiquette.mic[b.rail]; if (!(Math.abs(mic[1]) > 20)) continue;
  const cible = mic[1] - b.base, n = V.get(b.cut).tous.map(x => ({ dx: x.cut - b.cut, v: x[b.rail][0], s: x.source })).sort((p, q) => Math.abs(p.dx) - Math.abs(q.dx));
  if (n.length < 3) continue;
  const n1 = n[0], memeCote = n.filter(x => Math.sign(x.dx) === Math.sign(n1.dx));
  const pred = { proche: n1.v };
  if (memeCote.length >= 2) { const n2 = memeCote[1], pente = (n1.v - n2.v) / (n1.dx - n2.dx); pred.lineaire2 = n1.v + pente * (0 - n1.dx); }
  if (memeCote.length >= 3) pred.theil3memeCote = theil(memeCote.slice(0, 3).map(x => [x.dx, x.v]));
  pred.theil3 = theil(n.slice(0, 3).map(x => [x.dx, x.v])); pred.theil5 = theil(n.slice(0, 5).map(x => [x.dx, x.v]));
  const av = n.filter(x => x.dx < 0), ap = n.filter(x => x.dx > 0);
  if (av.length && ap.length) { const a = av[0], b2 = ap[0]; pred.interp = a.v + (b2.v - a.v) * (0 - a.dx) / (b2.dx - a.dx); }
  R.push({ cut: b.cut, rail: b.rail, erreurs: Object.fromEntries(Object.entries(pred).map(([k, x]) => [k, Math.abs(x - cible)])) });
}
const noms = ['proche', 'lineaire2', 'theil3memeCote', 'theil3', 'theil5', 'interp'];
const out = { rails: R.length, variantes: {} };
for (const nm of noms) {
  const S = R.filter(r => Number.isFinite(r.erreurs[nm]) && Number.isFinite(r.erreurs.proche));
  const e = S.map(r => r.erreurs[nm]), p = S.map(r => r.erreurs.proche);
  const part = (v, s) => Math.round(1000 * v.filter(x => x <= s).length / (v.length || 1)) / 10;
  out.variantes[nm] = { n: S.length, mediane: Math.round(100 * med(e)) / 100, sous5: part(e, 5), sous10: part(e, 10), procheMemePop: { mediane: Math.round(100 * med(p)) / 100, sous5: part(p, 5), sous10: part(p, 10) }, gain5Points: Math.round((part(e, 5) - part(p, 5)) * 10) / 10, gain10Points: Math.round((part(e, 10) - part(p, 10)) * 10) / 10 };
}
console.log(JSON.stringify(out, null, 1));
