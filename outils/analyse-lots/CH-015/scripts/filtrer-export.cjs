/* CH-015 tâche 7 : réduit un export Orbite (dossier de fichiers JSON : bilan compact, corpus de nuages, journal) aux cuts demandés, pour le rejeu sur la maquette ESV
 * (tests/esv-maquette/lecteur-export.cjs du dépôt banane, tronc claude/50-test17). Écrit un document {format, records, events, clouds} que le lecteur relit tel quel.
 * node filtrer-export.cjs <racine-du-depot-banane> <dossier-export> <partie> <fenetres "a-b,c-d,..."> <dossier-sortie>
 * Garde : les enregistrements et les nuages des cuts des fenêtres ; les écritures ESV observées de ces cuts (pour mesurer T monde − scène). Lecture seule sur l'entrée. */
const fs = require('node:fs'), path = require('node:path');
const [racine, dossier, partieS, fen, sortie] = process.argv.slice(2); const partie = Number(partieS);
const { charger } = require(path.join(racine, 'tests/esv-maquette/lecteur-export.cjs'));
const W = fen.split(',').map(s => s.split('-').map(Number)); const dedans = c => Number.isInteger(c) && W.some(([a, b]) => c >= a && c <= b);
const doc = charger(dossier); const id = r => r.identity || (r.before && r.before.identity) || (Number.isInteger(r.cut) ? { part: r.part, cut: r.cut } : null);
const records = doc.records.filter(r => { const i = id(r); return i && i.part === partie && dedans(i.cut); });
const ids = new Set(records.map(r => r.lidarCaptureId).filter(Boolean));
const clouds = doc.clouds.filter(c => ids.has(c.captureId) || (c.part === partie && dedans(c.cut)));
const events = doc.events.filter(e => e.type === 'esv-observation' && e.kind === 'write' && dedans(e.rowIndex));
/* plusieurs fichiers : une chaîne JSON ne dépasse pas ~512 Mo ; le lecteur relit tout le dossier */
fs.mkdirSync(sortie, { recursive: true }); let n = 0; const ecrire = (nom, o) => { fs.writeFileSync(path.join(sortie, nom), JSON.stringify(o)); n += fs.statSync(path.join(sortie, nom)).size; };
ecrire('00-records.json', { format: 'banane-test-dataset-v4', fenetres: W, records, events });
for (let i = 0; i < clouds.length; i += 40) ecrire('nuages-' + String(i / 40).padStart(2, '0') + '.json', { format: 'banane-gcv1-lidar-corpus-v1', clouds: clouds.slice(i, i + 40) });
console.log(JSON.stringify({ records: records.length, clouds: clouds.length, events: events.length, octets: n }));
