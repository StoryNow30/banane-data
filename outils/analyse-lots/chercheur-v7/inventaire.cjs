#!/usr/bin/env node
'use strict';
/*
 * inventaire.cjs — inventaire d'état d'un lot et de son Écho (CH-012). AUCUN écart en millimètres ici.
 *   node inventaire.cjs --banane <dépôt banane> --lot <dossier du journal> --echo <dossier Écho> --partie N --tirage tirage.json --sortie inventaire.json
 * Par cut posé par le lot : sa place dans le tirage (reglage / examen / garde) et l'état de l'Écho. Les comptes sont donnés
 * par rôle ; seul le réglage a un détail par cut.
 */
const fs = require('node:fs'), path = require('node:path');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const B = a.banane;
const J = require(path.join(B, 'tools/jointure-echo-orbite.cjs'));
const Poses = require(path.join(B, 'tools/precision-poses.cjs'));
const Lot = require(path.join(B, 'tools/juger-lot.cjs'));
const T = require('./tirage.cjs'); const tirage = JSON.parse(fs.readFileSync(a.tirage, 'utf8'));
const partie = Number(a.partie);
const journal = Poses.lireJournalDir(a.lot);
const echo = Poses.lireEcho(Lot.dossiersEcho([a.echo]));
const versions = new Set([journal.version]);
const lot = (() => { // même lecture que juger-lot (lotDe/ciblesDe/posesDe n'étant pas exportés, on rejoue les deux règles utiles)
  const r = Lot.analyser({ partie, journal, echo }); return r;
})();
const { table } = J.joindre(echo.records, journal, { partie, base: 'auto', poses: false, visiteSansActionBonne: true, sessions: echo.sessions || [],
  pagesPerdues: echo.pagesPerdues || [], capturesParVisite: echo.capturesParVisite || {}, evenementsEcho: echo.evenements || [], capturesParVisite: echo.capturesParVisite || {} });
const lignes = table.filter(l => l.partie === partie);
const comptes = { reglage: {}, examen: {}, garde: {} };
const detail = [];
for (const l of lignes) {
  const role = T.roleDe(tirage, l.cut);
  const etat = !l.dansEcho ? 'hors-echo' : l.referenceHumaine !== 'observee' ? 'echo-non-observee' : l.regleVisiteBon ? 'visite-sans-action' : 'echo-observee';
  comptes[role][etat] = (comptes[role][etat] || 0) + 1;
  if (role === 'reglage') detail.push({ cut: l.cut, etat, base: typeof l.base === 'string' ? l.base.split(':')[0] : null });
}
const sortie = { format: 'ariane-chercheur-v7-inventaire-v1', partie, versionJournal: journal.version, lignesTable: lignes.length, comptes,
  jugesParLeLot: { cibles: lot.cibles, poses: lot.poses, differes: lot.differes, sansEcho: lot.sansEcho, nonJuges: lot.nonJuges, repereNonCalibre: lot.repereNonCalibre },
  note: 'Aucun écart en mm. Les comptes d’examen sont des comptes d’état seulement.', detailReglage: detail };
if (a.sortie) fs.writeFileSync(a.sortie, JSON.stringify(sortie, null, 1));
console.log(JSON.stringify({ ...sortie, detailReglage: detail.length }, null, 1));
