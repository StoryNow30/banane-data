/* CH-015 tâche 4 : liste des cuts qu'un Écho devrait visiter pour juger un lot (partie du journal), sans Écho disponible.
 * node echo-a-faire.cjs <outils-banane> <dossier-lot> <partie> <sortie.json> [taille-echantillon=40]
 * Rangs : (1) cuts écrits par la deuxième passe ; (2) posés par un chemin du lot (window, choice, crossing, GCV2 L1) = chemin à risque ;
 * (3) posés signalés par R1 ; (4) posés à 2 cuts ou moins après un différé ; (5) différés restants ; (6) échantillon tiré au sort (graine 20261029)
 * parmi les posés du premier passage non déjà listés, pour avoir un taux de base. */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, partieS, sortie, nS] = process.argv.slice(2); const partie = Number(partieS), N = Number(nS || 40);
const Poses = require(path.join(outils, 'precision-poses.cjs')); const { aleatoire } = (() => { const f = (g) => { let s = (g >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }; return { aleatoire: f }; })();
const j = Poses.lireJournalDir(lotDir), t = e => Date.parse(e.timestamp || '');
const ev = j.events.filter(e => Number.isFinite(t(e))).sort((a, b) => t(a) - t(b));
const dep = ev.filter(e => e.type === 'batch-started' && e.batch && e.identity && e.identity.part === partie).pop(), B = dep.batch.id, t0 = t(dep);
const arret = ev.find(e => e.type === 'batch-stopped-at-end' && t(e) > t0), fin = arret ? t(arret) + 5000 : Infinity;
const cibles = new Set(); for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === partie) cibles.add(e.identity.cut);
for (const e of ev) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === partie && t(e) >= t0 && t(e) <= t0 + 30000) cibles.delete(e.identity.cut);
const poses = new Set(); for (const e of ev) if (e.type === 'esv-observation' && e.kind === 'write' && t(e) >= t0 && t(e) < fin && e.status >= 200 && e.status < 300 && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && cibles.has(e.rowIndex)) poses.add(e.rowIndex);
const sh = new Map(); for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === partie) sh.set(e.identity.cut, e.lotObservation || {});
const ecrites = ev.filter(e => e.type === 'passe-differes-ecriture' && e.resultat === 'ecrit' && e.identity.part === partie).map(e => e.identity.cut);
const diff = [...cibles].filter(c => !poses.has(c)).sort((a, b) => a - b), diffRest = diff.filter(c => !ecrites.includes(c));
const lotChemin = [...poses].filter(c => sh.get(c).command && sh.get(c).command.action === 'lot').sort((a, b) => a - b);
const r1 = [...poses].filter(c => diff.includes(c - 1) || diff.includes(c - 2)).sort((a, b) => a - b);
const apres = [...poses].filter(c => [1, 2].some(k => diff.includes(c - k))).sort((a, b) => a - b);
const deja = new Set([...ecrites, ...lotChemin, ...r1, ...apres, ...diffRest]);
const r = aleatoire(20261029), fp = [...poses].filter(c => !deja.has(c)).sort((a, b) => a - b);
for (let i = fp.length - 1; i > 0; i--) { const k = Math.floor(r() * (i + 1)); [fp[i], fp[k]] = [fp[k], fp[i]]; }
const base = fp.slice(0, N).sort((a, b) => a - b), tous = [...new Set([...deja, ...base])].sort((a, b) => a - b);
const out = { partie, cibles: cibles.size, poses: poses.size, differes: diff.length, ecritesParLaPasse: ecrites, differesRestants: diffRest, posesParCheminDuLot: lotChemin, posesSignaleesR1: r1, posesDeuxCutsApresUnDiffere: apres, echantillonBase: base, total: tous.length, tous };
fs.writeFileSync(sortie, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ecrites: ecrites.length, differesRestants: diffRest.length, cheminDuLot: lotChemin.length, R1: r1.length, apresDiffere: apres.length, echantillon: base.length, totalDistinct: tous.length }));
