'use strict';
/* Vérification d'hypothèse (hors dépôt) : l'écart du rejeu « livre-zjp » actuel contre les chiffres publiés
 * vient-il de D-363 (refus-vue n'arrête plus l'écriture) ? Rejoue HORS LIGNE l'ancien plafond (arrêt au premier
 * refus visible) sur les lignes du rejeu actuel, et recompte le tableau standard. */
const fs = require('node:fs'), path = require('node:path');
const T = '/home/opencode/.ariane/tmp-CH-139/travail';
const SIDES = ['left', 'right'];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pire = (p, q) => Math.max(dist(p.left, q.left), dist(p.right, q.right));
const C = new Map();
for (const l of fs.readFileSync(path.join(T, 'corpus.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse)) C.set(`${l.lot}-p${l.partie}-r${l.rang}:${l.cut}`, l);
const dir = path.join(T, 'rejeux', process.argv[2] || 'ch139-livre-zjp');
let tot = { cuts: 0, poses: 0, juges: 0, juste: 0, d1050: 0, plus50: 0, diff: 0 };
const parLot = {};
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()) {
  const cle = f.slice(0, -6), lot = cle.split('-p')[0];
  const lignes = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut');
  /* poses décidées de la passe, dans l'ordre de décision : passe puis ordre des cuts (pas de passesAlternees) */
  const posees = [];
  for (const l of lignes) { const x = l.profils['L1-se']; if (x.passe2 && (x.etat === 'pose' || x.passe2.nonEcrite)) posees.push({ l, x }); }
  posees.sort((a, b) => a.x.passe2.passe - b.x.passe2.passe); /* stable : ordre des cuts conservé */
  let arret = false, ecrites = 0;
  for (const { x } of posees) {
    const motif = arret ? 'arret' : ecrites >= 10 ? 'plafond' : x.vue === 'deplacee' ? 'refus-vue' : null;
    if (!motif) { ecrites++; x.etat = 'pose'; delete x.passe2.nonEcrite; continue; }
    if (motif !== 'plafond') arret = true;
    x.passe2.nonEcrite = motif; x.etat = 'differe'; x.decal = null;
  }
  const t = parLot[lot] || (parLot[lot] = { cuts: 0, poses: 0, juges: 0, juste: 0, d1050: 0, plus50: 0, diff: 0 });
  for (const l of lignes) {
    const c = C.get(`${cle}:${l.cut}`); if (!c) continue;
    const x = l.profils['L1-se'], pose = x.etat === 'pose' && x.decal;
    for (const u of [t, tot]) u.cuts++;
    if (pose) { for (const u of [t, tot]) u.poses++;
      if (c.poseFinale && !c.exclu) { const mm = Math.round(pire(x.decal, c.poseFinale) * 10) / 10; for (const u of [t, tot]) { u.juges++; if (mm <= 10) u.juste++; else if (mm <= 50) u.d1050++; else u.plus50++; } } }
    else for (const u of [t, tot]) u.diff++;
  }
}
console.log('ancien plafond (arrêt au premier refus) simulé sur', process.argv[2] || 'ch139-livre-zjp');
for (const [k, t] of Object.entries(parLot)) console.log(k, JSON.stringify(t));
console.log('TOTAL', JSON.stringify(tot));
