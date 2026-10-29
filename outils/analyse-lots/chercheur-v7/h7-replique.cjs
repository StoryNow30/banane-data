#!/usr/bin/env node
'use strict';
/* h7-replique.cjs — réplication de la candidate H7 sur un autre jeu, AVEC LES CONSTANTES FIGÉES (aucun réajustement) : H7-PARAMETRES-FIGES-*.json.
 *   node h7-replique.cjs JEU.jsonl PARAMETRES.json SORTIE.json
 * Deux évaluations par variante de H1 publiée (sans / avec hauteur apprise) : (A) référence brute, constantes brutes ; (B) référence corrigée du pixel de l'opérateur
 * (moins 0,193 mm par axe, latéral et vertical), constantes corrigées. Parts sous 3 et 5 mm (3D) avant / après, différence appariée, hausses / baisses, bootstrap par blocs de 20 cuts,
 * IC à 95 % et IC corrigé de Bonferroni sur 4 tests (3 et 5 mm × 2 variantes) à 98,75 %. Avec et sans les rails décalés (|latéral de l'opérateur| > 100 mm).
 * Comparaisons : 40 corrélations de traits (partie 17) + 4 tests de réplication = 44 ; seuil de Bonferroni sur les 4 tests : 0,0125. Si la borne basse de l'IC corrigé n'est pas positive, H7 n'est pas retenue. */
const fs = require('node:fs');
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const P = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), B = P.biaisPixelOperateurMm;
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
function alea(g) { let s = g >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const part = (S, k, s) => S.length ? S.filter(r => r[k] <= s).length / S.length : 0;
function boot(R, f, rep = 4000) { const G = new Map(); for (const r of R) { if (!G.has(r.bloc)) G.set(r.bloc, []); G.get(r.bloc).push(r); } const g = [...G.values()], rnd = alea(20261029), v = []; for (let i = 0; i < rep; i++) { const S = []; for (let j = 0; j < g.length; j++) S.push(...g[Math.floor(rnd() * g.length)]); v.push(f(S)); } v.sort((a, b) => a - b); const at = p => Math.round(1000 * v[Math.min(rep - 1, Math.max(0, Math.floor(p * rep)))]) / 10; return { ic95: [at(.025), at(.975)], icBonferroni4: [at(.00625), at(.99375)] }; }
const sortie = { format: 'ariane-chercheur-v7-h7-replique-v1', parametres: process.argv[3], comparaisons: { traitsPartie17: 40, testsReplication: 4, total: 44, seuilBonferroniReplication: 0.0125 }, variantes: {} };
for (const [nom, hauteur] of [['sans', false], ['avec', true]]) {
  const V = P.variantes[nom], R = [];
  for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H1' && l.traits && l.traits.publiee && (l.hauteur === true) === hauteur)) {
    const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation') continue;
    const mic = c.etiquette && c.etiquette.mic && c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal) || !Number.isFinite(h.traits.pointsDessus)) continue;
    const r = mic.map((x, i) => x - h.decal[i]), pd = h.traits.pointsDessus, k = pd <= V.seuilsTercile[0] ? 0 : pd <= V.seuilsTercile[1] ? 1 : 2;
    R.push({ cut: h.cut, bloc: Math.floor(h.cut / 20), decale: Math.abs(mic[1]) > 100, k, r,
      avantA: Math.hypot(...r), apresA: Math.hypot(r[0], r[1], r[2] - V.constantesBrutesMm[k]),
      avantB: Math.hypot(r[0], r[1] - B, r[2] - B), apresB: Math.hypot(r[0], r[1] - B, r[2] - B - V.constantesPixelCorrigeesMm[k]) });
  }
  const o = { rails: R.length, cuts: new Set(R.map(r => r.cut)).size, blocs: new Set(R.map(r => r.bloc)).size, tercilesMedianesVertBrutes: [0, 1, 2].map(k => ({ n: R.filter(r => r.k === k).length, mediane: Math.round(100 * med(R.filter(r => r.k === k).map(r => r.r[2]))) / 100 })), evaluations: {} };
  for (const [ev, ka, kb] of [['A_reference_brute', 'avantA', 'apresA'], ['B_pixel_corrige', 'avantB', 'apresB']]) {
    o.evaluations[ev] = {};
    for (const [lab, S] of [['tous', R], ['sansDecales', R.filter(r => !r.decale)]]) {
      const e = { rails: S.length, medianeAvant: Math.round(100 * med(S.map(r => r[ka]))) / 100, medianeApres: Math.round(100 * med(S.map(r => r[kb]))) / 100 };
      for (const s of [3, 5]) e['sous' + s] = { avant: Math.round(1000 * part(S, ka, s)) / 10, apres: Math.round(1000 * part(S, kb, s)) / 10, diffPoints: Math.round(1000 * (part(S, kb, s) - part(S, ka, s))) / 10,
        hausses: S.filter(r => r[ka] > s && r[kb] <= s).length, baisses: S.filter(r => r[ka] <= s && r[kb] > s).length, ...boot(S, T => part(T, kb, s) - part(T, ka, s)) };
      o.evaluations[ev][lab] = e;
    }
  }
  sortie.variantes[nom] = o;
}
fs.writeFileSync(process.argv[4], JSON.stringify(sortie, null, 1));
console.log('écrit', process.argv[4]);
