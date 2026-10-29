#!/usr/bin/env node
'use strict';
/*
 * tirage.cjs — séparation réglage / examen de CH-012, par BLOCS contigus de cuts d'une même partie.
 *
 *   node tirage.cjs --cuts 9581 [--bloc 20] [--garde 3] [--graine 20261029] --sortie tirage-AAAA-MM-JJ.json
 *
 * Règle (décidée par l'intégrateur le 29/10/2026) : les cuts 0..cuts-1 sont rangés en blocs de 20 numéros consécutifs ;
 * les numéros de bloc sont mélangés (Fisher-Yates, générateur mulberry32 de tools/precision-poses.cjs, graine 20261029) ;
 * la moitié arrondie vers le haut des blocs est le RÉGLAGE, le reste l'EXAMEN. 3 cuts de garde de chaque côté d'un bloc
 * d'examen sont écartés des deux ensembles (les voisins sont corrélés : le polynôme de voisinage du bruit de référence
 * prend ±3 cuts). Le tirage ne dépend d'aucune donnée de pose : il est écrit avant d'ouvrir le moindre cut d'examen.
 * Limite : l'examen est « dans la partie » ; il ne prouve pas la généralisation, seulement l'absence de surajustement
 * aux cuts réglés.
 */
const fs = require('node:fs');
function aleatoire(graine) {
  let s = (graine >>> 0) || 1;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function tirer({ cuts, bloc = 20, garde = 3, graine = 20261029 }) {
  const n = Math.ceil(cuts / bloc), ordre = Array.from({ length: n }, (_, i) => i), r = aleatoire(graine);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; }
  const nReglage = Math.ceil(n / 2);
  const reglage = ordre.slice(0, nReglage).sort((a, b) => a - b), examen = ordre.slice(nReglage).sort((a, b) => a - b);
  const examenSet = new Set(examen), role = new Array(cuts).fill('reglage');
  for (let c = 0; c < cuts; c++) if (examenSet.has(Math.floor(c / bloc))) role[c] = 'examen';
  for (let c = 0; c < cuts; c++) {
    if (role[c] !== 'examen') continue;
    for (let d = -garde; d <= garde; d++) {
      const k = c + d;
      if (k >= 0 && k < cuts && role[k] === 'reglage' && !examenSet.has(Math.floor(k / bloc))) role[k] = 'garde';
    }
  }
  return { cuts, bloc, garde, graine, blocs: n, blocsReglage: reglage, blocsExamen: examen,
    cutsReglage: role.filter(x => x === 'reglage').length, cutsExamen: role.filter(x => x === 'examen').length, cutsGarde: role.filter(x => x === 'garde').length };
}
function lire(argv) {
  const a = { cuts: null, bloc: 20, garde: 3, graine: 20261029, sortie: null };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--cuts') a.cuts = Number(argv[++i]); else if (k === '--bloc') a.bloc = Number(argv[++i]);
    else if (k === '--garde') a.garde = Number(argv[++i]); else if (k === '--graine') a.graine = Number(argv[++i]);
    else if (k === '--sortie') a.sortie = argv[++i]; else throw Error('argument inconnu : ' + k);
  }
  if (!Number.isInteger(a.cuts) || a.cuts < 1) throw Error('--cuts manquant');
  return a;
}
/* Rôle d'un numéro de cut d'après un tirage déjà écrit. */
function roleDe(t, cut) {
  const b = Math.floor(cut / t.bloc);
  if (t.blocsExamen.includes(b)) return 'examen';
  for (let d = -t.garde; d <= t.garde; d++) if (t.blocsExamen.includes(Math.floor((cut + d) / t.bloc)) && cut + d >= 0 && cut + d < t.cuts) return 'garde';
  return 'reglage';
}
if (require.main === module) {
  const a = lire(process.argv.slice(2)), t = tirer(a);
  if (a.sortie) fs.writeFileSync(a.sortie, JSON.stringify(t, null, 1) + '\n');
  console.log(JSON.stringify({ ...t, blocsReglage: t.blocsReglage.length, blocsExamen: t.blocsExamen.length }));
}
module.exports = { tirer, roleDe, aleatoire };
