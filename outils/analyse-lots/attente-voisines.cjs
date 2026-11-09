#!/usr/bin/env node
'use strict';
/* CH-090 : attente de capture des coupes voisines (+1), décomposée par lecture (une par rail).
 * Usage : node attente-voisines.cjs <journal-v4.json> [--apres <ISO>] [--avant <ISO>]
 * Source : événements adapter-progress (action capture, étape capture-read, règle signal) du lot (avant la relecture).
 * Par lecture : at = attente totale ; tc = instant du dernier changement des nœuds de la vue ; at - tc = queue de stabilité ;
 * pc = paires d'images où le compteur de Potree était > 0 ; nc = paires où les nœuds de la vue ont changé. Aucun identifiant en sortie. */
const fs = require('fs');
const args = process.argv.slice(2), f = args[0];
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const a = JSON.parse(fs.readFileSync(f)).events.sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1));
const r0 = a.find(e => e.type === 'relecture-ombre')?.timestamp || '9', T0 = opt('--apres') || '0', T1 = opt('--avant') || '9';
const med = v => { v = v.filter(x => x != null).sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const som = v => v.reduce((s, x) => s + x, 0);
// captures du lot, dans l'ordre, avec le saut
const par = {};
for (const e of a) if (e.type === 'adapter-progress' && e.action === 'capture' && e.timestamp < r0) (par[e.requestId] ??= []).push(e);
const caps = [];
for (const l of Object.values(par)) { const rd = l.find(e => e.lastStage === 'capture-ready'); if (!rd) continue;
  caps.push({ ts: rd.timestamp, cut: rd.identity.cut, tot: rd.elapsedMs, pts: rd.lastDetail?.points, noeuds: rd.lastDetail?.nodes, lect: l.filter(e => e.lastStage === 'capture-read').map(e => ({ el: e.elapsedMs, regle: e.lastDetail?.regle, ...e.lastDetail?.diag })),
    vues: l.filter(e => e.lastStage === 'capture-view-ready').map(e => e.elapsedMs), att: l.filter(e => e.lastStage === 'capture-wait').map(e => e.elapsedMs) }); }
caps.sort((x, y) => (x.ts < y.ts ? -1 : 1)); for (let i = 1; i < caps.length; i++) caps[i].saut = caps[i].cut - caps[i - 1].cut;
const v = caps.filter(c => c.saut === 1 && c.ts >= T0 && c.ts < T1);
const L = v.flatMap(c => c.lect.filter(l => l.regle === 'signal'));
const libres = L.filter(l => l.pc <= 2), charge = L.filter(l => l.pc > 2);
console.log(`captures +1 : ${v.length} ; total médian ${med(v.map(c => c.tot))} ms ; somme ${(som(v.map(c => c.tot)) / 1000).toFixed(1)} s ; points médians ${med(v.map(c => c.pts))} ; nœuds lus médians ${med(v.map(c => c.noeuds))}`);
console.log(`lectures au signal : ${L.length} ; déjà chargées (compteur à 0) : ${libres.length} (${Math.round(100 * libres.length / L.length)} %), attente médiane ${med(libres.map(l => l.at))} ms`);
console.log(`lectures avec chargement : ${charge.length} (${Math.round(100 * charge.length / L.length)} %) ; attente médiane ${med(charge.map(l => l.at))} ms ; somme ${(som(charge.map(l => l.at)) / 1000).toFixed(1)} s`);
console.log(`  dont jusqu'au dernier changement de nœuds (tc) : médiane ${med(charge.map(l => l.tc))} ms, somme ${(som(charge.map(l => l.tc)) / 1000).toFixed(1)} s`);
console.log(`  dont queue après le dernier changement (at - tc) : médiane ${med(charge.map(l => l.at - l.tc))} ms, somme ${(som(charge.map(l => l.at - l.tc)) / 1000).toFixed(1)} s`);
console.log(`  changements de nœuds par lecture (ch) : médiane ${med(charge.map(l => l.ch))} ; compteur max médian ${med(charge.map(l => l.nl?.[1]))}`);
console.log(`  mémoire d'ESV au moment de lire : points affichés médians ${med(L.map(l => l.pts))} ; points en mémoire (LRU) médians ${med(L.map(l => l.lruPts))} ; nœuds de la vue médians ${med(L.map(l => l.noeuds))} ; niveau max médian ${med(L.map(l => l.niv?.[2]))}`);
// temps hors attente du signal : sélection de la vue (avant capture-wait) et lecture des points (capture-read -> view-ready)
const sel = [], lec = [];
for (const c of v) for (let i = 0; i < c.lect.length; i++) { if (c.att[i] != null) sel.push(c.att[i] - (i ? c.vues[i - 1] ?? 0 : 0)); if (c.vues[i] != null) lec.push(c.vues[i] - c.lect[i].el); }
console.log(`sélection de la vue (par rail) : médiane ${med(sel)} ms, somme ${(som(sel) / 1000).toFixed(1)} s ; lecture des points (par rail) : médiane ${med(lec)} ms, somme ${(som(lec) / 1000).toFixed(1)} s`);
