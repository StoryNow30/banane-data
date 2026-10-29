#!/usr/bin/env node
'use strict';
/* h8-explorer.cjs — le décalage de voie varie-t-il lisse le long de la voie ? Partie en apprentissage (CH-012, H8). Descriptif, aucun paramètre figé.
 * Pour chaque rail à référence « validation » : décalage cible s* = pose de l'opérateur − pose d'ESV d'origine (latéral), déduit de H6 « proche » (décalage = base + voisin le plus proche).
 * Compare, dans la famille « lot » puis « tous », l'erreur latérale de : voisin le plus proche (H6), médiane des K voisins, tendance linéaire (moindres carrés) et tendance robuste (Theil-Sen). */
const fs = require('node:fs');
const [jeuF, voisF] = process.argv.slice(2);
const L = fs.readFileSync(jeuF, 'utf8').split('\n').filter(Boolean).map(JSON.parse), V = new Map();
/* gcv2-jeu appelle hypothesesDuCut deux fois par cut (avec puis sans voisins humains) : on garde, par famille, la liste la plus complète. */
for (const v of JSON.parse(fs.readFileSync(voisF, 'utf8'))) { const o = V.get(v.cut) || { cut: v.cut, lot: [], tous: [] }; if (v.lot.length > o.lot.length) o.lot = v.lot; if (v.tous.length > o.tous.length) o.tous = v.tous; V.set(v.cut, o); }
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const q = (v, p) => { v = v.slice().sort((a, b) => a - b); return v.length ? v[Math.min(v.length - 1, Math.floor(p * v.length))] : null; };
const ols = pts => { const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n; let sxx = 0, sxy = 0; for (const [x, y] of pts) { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); } const b = sxx ? sxy / sxx : 0; return { a: my - b * mx, b }; };
const theil = pts => { const pe = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (pts[j][0] !== pts[i][0]) pe.push((pts[j][1] - pts[i][1]) / (pts[j][0] - pts[i][0])); const b = pe.length ? med(pe) : 0; return { a: med(pts.map(p => p[1] - b * p[0])), b }; };
const lignes = [];
const bases = new Map();
for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H6' && l.sous === 'h6-lot-proche-rail')) {
  const v = V.get(h.cut); if (!v || !v.lot.length) continue;
  bases.set(h.cut + '|' + h.rail, { cut: h.cut, rail: h.rail, nearest: v.lot[0], base: [h.decal[1] - v.lot[0][h.rail][0], h.decal[2] - v.lot[0][h.rail][1]] });
}
for (const [k, b] of bases) {
  const c = cuts.get(b.cut); if (!c || c.reference !== 'validation' || !c.etiquette || !c.etiquette.mic) continue;
  const mic = c.etiquette.mic[b.rail], v = V.get(b.cut);
  const cible = mic[1] - b.base[0];                                   // décalage latéral cible, en mm, par rapport à la pose d'ESV d'origine
  const fam = nom => v[nom].map(n => [n.cut - b.cut, n[b.rail][0], n.source]).sort((a, b2) => Math.abs(a[0]) - Math.abs(b2[0]));
  const o = { cut: b.cut, rail: b.rail, cible, deplace: Math.abs(mic[1]) > 20, role: c.role };
  for (const nom of ['lot', 'tous']) {
    const n = fam(nom); o[nom] = { n: n.length };
    if (!n.length) continue;
    o[nom].proche = Math.abs(n[0][1] - cible);
    const K = n.slice(0, 5); o[nom].mediane = Math.abs(med(K.map(x => x[1])) - cible);
    if (K.length >= 3 && new Set(K.map(x => x[0])).size >= 3) { const f1 = ols(K.map(x => [x[0], x[1]])), f2 = theil(K.map(x => [x[0], x[1]])); o[nom].ols = Math.abs(f1.a - cible); o[nom].theil = Math.abs(f2.a - cible); o[nom].etendue = Math.max(...K.map(x => x[1])) - Math.min(...K.map(x => x[1])); }
  }
  lignes.push(o);
}
const stat = (S, nom, fam, cle) => { const v = S.map(r => r[fam] && r[fam][cle]).filter(Number.isFinite); return v.length ? { n: v.length, mediane: Math.round(100 * med(v)) / 100, p90: Math.round(100 * q(v, .9)) / 100, sous5: Math.round(1000 * v.filter(x => x <= 5).length / v.length) / 10, sous10: Math.round(1000 * v.filter(x => x <= 10).length / v.length) / 10 } : null; };
const out = { rails: lignes.length, deplaces20: lignes.filter(r => r.deplace).length };
for (const [pop, S] of [['tous', lignes], ['deplaces>20mm', lignes.filter(r => r.deplace)]]) {
  out[pop] = {};
  for (const fam of ['lot', 'tous']) {
    const ref = S.filter(r => Number.isFinite(r[fam] && r[fam].ols));       // même population pour toutes les méthodes : celles qui ont ≥ 3 voisins
    out[pop][fam] = { rails3voisins: ref.length, proche: stat(ref, 'proche', fam, 'proche'), mediane5: stat(ref, 'mediane', fam, 'mediane'), ols: stat(ref, 'ols', fam, 'ols'), theilSen: stat(ref, 'theil', fam, 'theil') };
  }
}
console.log(JSON.stringify(out, null, 1));
