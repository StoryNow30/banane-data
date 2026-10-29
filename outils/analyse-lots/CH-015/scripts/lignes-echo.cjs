/* CH-015 : écrit, pour la partie du lot, la table cut par cut (jointure Écho/journal) en JSON, pour les scripts suivants.
 * Usage : node lignes-echo.cjs <outils-banane> <dossier-lot> <dossier-echo> <partie> <sortie.json>
 * Lecture seule ; réutilise tools/jointure-echo-orbite.cjs et tools/precision-poses.cjs du dépôt banane sans les modifier. */
const fs = require('node:fs'), path = require('node:path');
const [outils, lot, echoDir, partie, sortie] = process.argv.slice(2);
const J = require(path.join(outils, 'jointure-echo-orbite.cjs'));
const Poses = require(path.join(outils, 'precision-poses.cjs'));
const journal = Poses.lireJournalDir(lot);
const echo = Poses.lireEcho([echoDir]);
const { table } = J.joindre(echo.records, journal, {
  partie: Number(partie), base: 'auto', poses: false, visiteSansActionBonne: true, sessions: echo.sessions || [],
  pagesPerdues: echo.pagesPerdues || [], capturesParVisite: echo.capturesParVisite || {}, evenementsEcho: echo.evenements || [],
});
const lignes = table.filter(l => l.partie === Number(partie));
fs.writeFileSync(sortie, JSON.stringify({ partie: Number(partie), n: lignes.length, lignes }));
const vis = echo.records ? echo.records.length : null;
console.log(JSON.stringify({ lignes: lignes.length, dansEcho: lignes.filter(l => l.dansEcho).length, enregistrementsEcho: vis, sessions: (echo.sessions || []).length }));
