#!/usr/bin/env node
'use strict';
/*
 * bruit-voisins.cjs — bruit de la pose de l'opérateur par cohérence entre voisins (BRUIT_REFERENCE § 5), RÉGLAGE seul (CH-012).
 *   node --max-old-space-size=12000 bruit-voisins.cjs --banane <dépôt banane> --echo <dossier Écho> --partie N --tirage tirage.json --sortie bruit-voisins-reglage.json
 * Les cuts d'examen sont écartés AVANT la construction des références : aucune fenêtre ne les contient. Un centre de fenêtre
 * est retenu s'il est du réglage ; ses voisins (±3) sont alors du réglage ou de la garde, jamais de l'examen.
 */
const fs = require('node:fs'), path = require('node:path');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const B = a.banane;
const J = require(path.join(B, 'tools/jointure-echo-orbite.cjs'));
const R = require(path.join(B, 'tools/bruit-reference.cjs'));
const Lot = require(path.join(B, 'tools/juger-lot.cjs'));
const T = require('./tirage.cjs'); const tirage = JSON.parse(fs.readFileSync(a.tirage, 'utf8'));
const partie = Number(a.partie);
const echo = J.lireEcho(Lot.dossiersEcho([a.echo]), {});
const tous = R.preparerCuts(echo.records, echo.sessions, partie);
const ecartes = tous.filter(c => T.roleDe(tirage, c.cut) === 'examen').length;
const cuts = tous.filter(c => T.roleDe(tirage, c.cut) !== 'examen');
const refs = R.referencesDe(cuts);
const vo = R.voisins(refs, partie).filter(e => T.roleDe(tirage, e.cut) === 'reglage');
const G = 20261029;
const sig = (ls, deg) => ({ lat: R.sigmaVoisins(ls.filter(e => e.axe === 'lat'), deg, G), vert: R.sigmaVoisins(ls.filter(e => e.axe === 'vert'), deg, G) });
const fen = ls => new Set(ls.map(e => e.cut)).size;
function resume(v) {
  const rails = v.filter(e => e.serie !== 'milieu'), milieu = v.filter(e => e.serie === 'milieu'), droites = rails.filter(e => e.droite === true);
  const o = { tous: { fenetres: fen(rails), ...sig(rails, 2) }, milieuDesRails: { fenetres: fen(milieu), ...sig(milieu, 2) }, voieDroite: { fenetres: fen(droites), ...sig(droites, 1) }, parStrate: {} };
  for (const s of ['aucun-touche', 'mixte', 'tous-touches']) { const l = rails.filter(e => e.strate === s); o.parStrate[s] = { fenetres: fen(l), ...sig(l, 2) }; }
  return o;
}
const res = { format: 'ariane-chercheur-v7-bruit-voisins-v1', partie, tirage: path.basename(a.tirage), cutsEcho: tous.length, cutsExamenEcartes: ecartes,
  cutsAvecReference: refs.size, fenetresReglage: new Set(vo.map(e => e.cut)).size, resume: resume(vo) };
fs.writeFileSync(a.sortie, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ cutsEcho: res.cutsEcho, cutsExamenEcartes: ecartes, cutsAvecReference: refs.size, fenetres: res.fenetresReglage, resume: res.resume }));
