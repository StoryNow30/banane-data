#!/usr/bin/env node
'use strict';
/* h7-figer.cjs — fige les constantes de la candidate H7 (correction verticale de H1 selon le tercile de pointsDessus) sur le RÉGLAGE de la partie 17, avant toute réplication.
 *   node h7-figer.cjs jeu-reglage.jsonl H7-PARAMETRES-FIGES-2026-10-29.json
 * Pour chaque variante de H1 « publiée » (sans / avec hauteur apprise) : seuils de tercile de pointsDessus et médiane du résidu vertical (opérateur − H1) par tercile.
 * Deux jeux de constantes : « brut » (référence de l'opérateur telle quelle) et « pixel corrigé » (référence moins 0,193 mm par axe : demi-pixel de 0,386 mm, troncature des
 * propres clics de l'opérateur, SUPPOSÉE de même sens que celle mesurée sur le lot). Rien n'est réajusté ensuite. */
const fs = require('node:fs');
const PIXEL_OPERATEUR_MM = 0.386, BIAIS_PIXEL = PIXEL_OPERATEUR_MM / 2;
const L = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map(JSON.parse);
const cuts = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l]));
const med = v => { v = v.slice().sort((a, b) => a - b); const m = v.length >> 1; return v.length ? (v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) : null; };
const q = (v, p) => { v = v.slice().sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
const out = { format: 'ariane-chercheur-v7-h7-parametres-v1', date: '2026-10-29', source: 'partie 17, réglage, jeu-reglage.jsonl', biaisPixelOperateurMm: BIAIS_PIXEL, hypothese: 'z += c[tercile de pointsDessus]', variantes: {} };
for (const [nom, hauteur] of [['sans', false], ['avec', true]]) {
  const R = [];
  for (const h of L.filter(l => l.type === 'hyp' && l.origine === 'H1' && l.traits && l.traits.publiee && (l.hauteur === true) === hauteur)) {
    const c = cuts.get(h.cut); if (!c || c.etat !== 'calcule' || c.reference !== 'validation') continue;
    const mic = c.etiquette && c.etiquette.mic && c.etiquette.mic[h.rail]; if (!Array.isArray(mic) || !Array.isArray(h.decal) || !Number.isFinite(h.traits.pointsDessus)) continue;
    R.push({ pd: h.traits.pointsDessus, vert: mic[2] - h.decal[2] });
  }
  const t1 = q(R.map(r => r.pd), 1 / 3), t2 = q(R.map(r => r.pd), 2 / 3), terc = pd => pd <= t1 ? 0 : pd <= t2 ? 1 : 2;
  const brut = [0, 1, 2].map(k => med(R.filter(r => terc(r.pd) === k).map(r => r.vert))), corr = brut.map(c => c - BIAIS_PIXEL);
  out.variantes[nom] = { rails: R.length, seuilsTercile: [t1, t2], constantesBrutesMm: brut.map(x => Math.round(1000 * x) / 1000), constantesPixelCorrigeesMm: corr.map(x => Math.round(1000 * x) / 1000) };
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out));
