'use strict';
// Essai aj5 sur le terrain : changements de hauteur appliqués, et jugement par l'Écho quand le cut y est.
const fs = require('fs');
const j = JSON.parse(fs.readFileSync(fs.readdirSync('.').find(f => f.startsWith('ariane-journal')), 'utf8'));
const tables = {}; for (const p of [25, 26]) for (const l of JSON.parse(fs.readFileSync(`joint-p${p}.json`, 'utf8')).table) tables[p + '/' + l.cut] = l;
const ev = j.events.filter(e => e.type === 'gcv1-shadow-observed' && e.lotObservation && e.lotObservation.ajustementFin);
let n = 0, chg = 0; const dz = []; const juges = [];
const parPartie = {};
for (const e of ev) {
  const lo = e.lotObservation, af = lo.ajustementFin, part = e.identity.part, cut = e.identity.cut;
  n++; const pp = parPartie[part] || (parPartie[part] = { n: 0, chg: 0 }); pp.n++;
  for (const r of ['left', 'right']) {
    const a = af.avant && af.avant[r], b = af.apres && af.apres[r]; if (!a || !b) continue;
    const d = b[2] - a[2]; if (Math.abs(d) < 0.05) continue;
    chg++; pp.chg++; dz.push(d);
    const l = tables[part + '/' + cut];
    if (l && l.ecartHumain && l.base === 'ariane' && l.referenceHumaine) {
      const side = r === 'left' ? 'gauche' : 'droite', eh = l.ecartHumain[side];
      if (eh && eh.repere === 'profil') juges.push({ part, cut, rail: side, dz: +d.toFixed(1), verticalApres: eh.verticalMm, verticalAvant: +(eh.verticalMm + d).toFixed(1), ref: l.referenceHumaine, etiquette: l.etiquetteEcho, commande: af.commandeAvant });
    }
  }
}
const s = [...dz].map(Math.abs).sort((a, b) => a - b);
console.log('observations avec aj5 :', n, '; rails changés :', chg, '; |dz| médian', s[s.length >> 1], 'max', s[s.length - 1]);
console.log('par partie :', JSON.stringify(parPartie));
console.log('rails changés jugés par l\'Écho (base = pose d\'Ariane) :', juges.length);
let mieux = 0, pire = 0, egal = 0; for (const x of juges) { const A = Math.abs(x.verticalAvant), B = Math.abs(x.verticalApres); if (B + 0.5 < A) mieux++; else if (A + 0.5 < B) pire++; else egal++; }
console.log('plus près', mieux, 'plus loin', pire, 'égal (0,5 mm)', egal);
for (const x of juges) console.log(JSON.stringify(x));
