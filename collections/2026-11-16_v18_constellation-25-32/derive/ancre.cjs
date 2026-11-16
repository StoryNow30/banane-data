'use strict';
// Lecture du levier N (ancre) et de l'essai aj5 au journal d'un lot de la Vision 18. Sortie : comptes et mm, aucun identifiant.
const fs = require('fs');
const f = process.argv[2];
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
const ev = j.events.filter(e => e.type === 'gcv1-shadow-observed' && e.lotObservation);
const parts = {};
const P = p => parts[p] || (parts[p] = { obs: 0, ancreMuet: 0, ancreJuge: 0, refus: 0, ecarts: [], aj: 0, ajApplique: 0, ajDelta: [], decisions: {} });
const refus = [];
for (const e of ev) {
  const lo = e.lotObservation, part = (e.identity && e.identity.part) ?? lo.part, cut = (e.identity && e.identity.cut) ?? lo.cut;
  const x = P(part); x.obs++;
  const a = lo.ancre;
  if (!a) x.ancreMuet++; else { x.ancreJuge++; if (a.refus) { x.refus++; refus.push({ part, cut, ecartMm: a.ecartMm, axeMm: a.axeMm, cin: a.cinematiqueMm, decision: lo.command && lo.command.action }); } if (typeof a.ecartMm === 'number') x.ecarts.push(Math.abs(a.ecartMm)); }
  const af = lo.ajustementFin || (lo.command && lo.command.ajustementFin);
  if (af) { x.aj++; if (af.applique || af.applied || af.deltaMm) { x.ajApplique++; if (typeof af.deltaMm === 'number') x.ajDelta.push(af.deltaMm); } }
  const d = (lo.command && lo.command.action) || lo.decision || '?'; x.decisions[d] = (x.decisions[d] || 0) + 1;
}
const q = (a, p) => { if (!a.length) return '—'; const s = [...a].sort((u, v) => u - v); return s[Math.min(s.length - 1, Math.round(p * (s.length - 1)))].toFixed(1); };
console.log('partie | observations | ancre jugée | ancre muette | refus | |écart| médian | P90 | aj5 présent | aj5 appliqué | décisions');
for (const [p, x] of Object.entries(parts)) console.log([p, x.obs, x.ancreJuge, x.ancreMuet, x.refus, q(x.ecarts, .5), q(x.ecarts, .9), x.aj, x.ajApplique, JSON.stringify(x.decisions)].join(' | '));
console.log('refus :'); for (const r of refus) console.log(JSON.stringify(r));
// exemples de structure aj5
const ex = ev.find(e => e.lotObservation.ajustementFin); console.log('aj5 exemple :', JSON.stringify(ex && ex.lotObservation.ajustementFin).slice(0, 600));
const exc = ev.find(e => e.lotObservation.command && e.lotObservation.command.ajustementFin); console.log('aj5 commande exemple :', JSON.stringify(exc && exc.lotObservation.command.ajustementFin).slice(0, 600), JSON.stringify(exc && exc.lotObservation.command.actionAvantAjustement));
