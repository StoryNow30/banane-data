#!/usr/bin/env node
'use strict';
/* h9-mesure.cjs — mesure de H9 (CONCEPTION-H9.md), règle écrite avant. Entrée : jeu produit par h9-extraire.cjs. Sortie : JSON.
 * Pose d'aujourd'hui (base) : H1 publiée sans hauteur apprise, sinon H0. H9 : parmi les poses dont les origines contiennent H9, sans hauteur apprise, avec le support de H6
 * (pointsDessus ≥ 5 et pointsFlanc ≥ 3), celle au total de points sous le gabarit le plus grand (égalité : la première). Politique : H9 choisie si elle existe, sinon la base. Comparateur :
 * H6 « humain proche rail ». Cut évité = cut dont les deux rails sont à ≤ 5 mm (3D) de l'opérateur avec la politique et pas avec la base. Population : cuts à référence « validation » ;
 * « déplacés > 20 mm » = au moins un rail déplacé de plus de 20 mm (3D) par l'opérateur. Bootstrap par blocs de 20 cuts ; IC 95 % et IC corrigé de Bonferroni sur 3 tests (98,33 %). */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut' && l.etat === 'calcule' && l.reference === 'validation').map(l => [l.cut, l]));
const par = new Map();
const get = (cut, rail) => { const k = cut + '|' + rail; if (!par.has(k)) par.set(k, { cut, rail, h0: null, h1: null, h6: null, h9: null, nCand: 0 }); return par.get(k); };
for (const h of L.filter(l => l.type === 'hyp' && cuts.has(l.cut) && l.hauteur !== true)) {
  const e = h.etiquette && h.etiquette.ecartMm; if (!Number.isFinite(e)) continue;
  const r = get(h.cut, h.rail), t = h.traits || {};
  if (h.origine === 'H0') r.h0 = e;
  if (h.origine === 'H1' && t.publiee && r.h1 === null) r.h1 = e;
  if ((h.sousOrigines || []).includes('h6-humain-proche-rail') && r.h6 === null) r.h6 = e;
  if ((h.origines || []).includes('H9')) { r.nCand++; if (t.pointsDessus >= 5 && t.pointsFlanc >= 3) { const s = t.pointsDessus + t.pointsFlanc; if (!r.h9 || s > r.h9.s) r.h9 = { s, e }; } }
}
const cutsOut = [];
for (const [cut, c] of cuts) {
  const g = par.get(cut + '|left'), d = par.get(cut + '|right'); if (!g || !d || g.h0 === null || d.h0 === null) continue;
  const mic = c.etiquette && c.etiquette.mic; if (!mic) continue;
  const deplace = Math.max(Math.hypot(...mic.left), Math.hypot(...mic.right)) > 20;
  const base = r => r.h1 !== null ? r.h1 : r.h0, pol = r => r.h9 ? r.h9.e : base(r), pol6 = r => r.h6 !== null ? r.h6 : base(r);
  cutsOut.push({ cut, bloc: Math.floor(cut / 20), deplace, base: Math.max(base(g), base(d)), pol: Math.max(pol(g), pol(d)), pol6: Math.max(pol6(g), pol6(d)),
    rails: [g, d].map(r => ({ base: base(r), pol: pol(r), pol6: pol6(r), aH9: !!r.h9, cand: r.nCand })) });
}
function alea(g) { let s = g >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function boot(S, f, rep = 4000) { const G = new Map(); for (const x of S) { if (!G.has(x.bloc)) G.set(x.bloc, []); G.get(x.bloc).push(x); } const g = [...G.values()], rnd = alea(20261029), v = []; for (let i = 0; i < rep; i++) { const T = []; for (let j = 0; j < g.length; j++) T.push(...g[Math.floor(rnd() * g.length)]); v.push(f(T)); } v.sort((a, b) => a - b); const at = p => Math.round(100 * v[Math.min(rep - 1, Math.max(0, Math.floor(p * rep)))]) / 100; return { ic95: [at(.025), at(.975)], icBonferroni3: [at(.00833), at(.99167)] }; }
const evites = (S, k) => S.filter(c => c.base > 5 && c[k] <= 5).length - S.filter(c => c.base <= 5 && c[k] > 5).length;
const net100 = (S, k) => S.length ? 100 * evites(S, k) / S.length : 0;
const out = { format: 'ariane-chercheur-v7-h9-mesure-v1', comparaisons: { testsDeRetenue: 3, seuilBonferroni: 0.0167, descriptifs: 'abstention, propositions fausses confiantes, comparateur H6 proche humain' }, populations: {} };
for (const [nom, S] of [['tousLesCuts', cutsOut], ['deplaces>20mm', cutsOut.filter(c => c.deplace)]]) {
  const rails = S.flatMap(c => c.rails.map(r => ({ ...r, bloc: c.bloc, cut: c.cut })));
  const part = (R, k, s) => R.length ? Math.round(1000 * R.filter(r => r[k] <= s).length / R.length) / 10 : null;
  const o = { cuts: S.length, rails: rails.length,
    cutsEvitesBruts: { hausses: S.filter(c => c.base > 5 && c.pol <= 5).length, baisses: S.filter(c => c.base <= 5 && c.pol > 5).length, net: evites(S, 'pol'), netPour100Cuts: Math.round(100 * net100(S, 'pol')) / 100, ...boot(S, T => net100(T, 'pol')) },
    comparateurH6ProcheHumain: { hausses: S.filter(c => c.base > 5 && c.pol6 <= 5).length, baisses: S.filter(c => c.base <= 5 && c.pol6 > 5).length, net: evites(S, 'pol6'), netPour100Cuts: Math.round(100 * net100(S, 'pol6')) / 100 },
    fausseConfiants: { h9: S.filter(c => c.base <= 10 && c.pol > 10).length, h6: S.filter(c => c.base <= 10 && c.pol6 > 10).length },
    abstention: { cutsSansAucunH9: S.filter(c => !c.rails.some(r => r.aH9)).length, railsSansH9: rails.filter(r => !r.aH9).length, railsAvecCandidatsSansSupport: rails.filter(r => !r.aH9 && r.cand > 0).length },
    rails5: { base: part(rails, 'base', 5), politique: part(rails, 'pol', 5), diffPoints: Math.round((part(rails, 'pol', 5) - part(rails, 'base', 5)) * 10) / 10, ...boot(rails, T => 100 * (T.filter(r => r.pol <= 5).length - T.filter(r => r.base <= 5).length) / (T.length || 1)) },
    rails10: { base: part(rails, 'base', 10), politique: part(rails, 'pol', 10), diffPoints: Math.round((part(rails, 'pol', 10) - part(rails, 'base', 10)) * 10) / 10, ...boot(rails, T => 100 * (T.filter(r => r.pol <= 10).length - T.filter(r => r.base <= 10).length) / (T.length || 1)) } };
  out.populations[nom] = o;
}
console.log(JSON.stringify(out, null, 1));
