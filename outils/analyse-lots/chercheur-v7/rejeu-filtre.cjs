#!/usr/bin/env node
'use strict';
/*
 * rejeu-filtre.cjs — lance tools/banc-differes.cjs rejouer, ne garde que les lignes de RÉGLAGE, supprime la sortie brute (CH-012).
 *
 *   node rejeu-filtre.cjs --banane <dépôt banane> --journal J.json --corpus <dossier avec les corpus> --lot ID --partie N --projet P \
 *        --profils base[,L1] --tirage tirage.json --brut <fichier temporaire> --sortie rejeu-reglage.jsonl --comptes comptes.json
 *
 * Conditions (intégrateur, 29/10/2026) : un seul script lance le rejeu, écrit les lignes de réglage et supprime lui-même la sortie
 * brute ; ni la sortie standard ni la sortie d'erreur du rejeu ne sont affichées ni gardées ; le script est commité avant son
 * premier lancement (SHA-256 dans rejeu-filtre.cjs.sha256) ; la règle de sélection est le fichier du tirage. Les comptes lus /
 * écrits / écartés (par rôle) sont archivés. L'en-tête du rejeu (première ligne) est réduit à son format et à son SHA de paramètres.
 */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const T = require('./tirage.cjs'); const tirage = JSON.parse(fs.readFileSync(a.tirage, 'utf8'));
const corpus = [];
(function marche(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) marche(p); else if (/ariane-gcv1-corpus-.*\.json$/.test(e.name)) corpus.push(p); } })(a.corpus);
corpus.sort();
const args = ['--max-old-space-size=12000', path.join(a.banane, 'tools/banc-differes.cjs'), 'rejouer', '--partie', `${a.projet}:${a.partie}`, '--journal', a.journal,
  ...corpus.flatMap(c => ['--corpus', c]), '--lot', a.lot, '--sortie', a.brut, '--profils', a.profils || 'base'];
const r = cp.spawnSync(process.execPath, args, { stdio: ['ignore', 'ignore', 'ignore'], cwd: a.banane });
const comptes = { statutRejeu: r.status, lignesLues: 0, ecrites: 0, ecartees: { examen: 0, garde: 0, sansCut: 0 }, ecrit: a.sortie };
try {
  if (r.status === 0 && fs.existsSync(a.brut)) {
    const lignes = fs.readFileSync(a.brut, 'utf8').split('\n').filter(Boolean), sortie = [];
    for (const [i, brute] of lignes.entries()) {
      comptes.lignesLues++;
      const l = JSON.parse(brute);
      if (i === 0 && l.type !== 'cut') { sortie.push(JSON.stringify({ type: l.type || 'entete', format: l.format || null, parametres: l.parametres ? { sha256: l.parametres.sha256 || null } : null })); continue; }
      if (!Number.isInteger(l.cut)) { comptes.ecartees.sansCut++; continue; }
      const role = T.roleDe(tirage, l.cut);
      if (role === 'reglage') { sortie.push(brute); comptes.ecrites++; } else comptes.ecartees[role]++;
    }
    fs.writeFileSync(a.sortie, sortie.join('\n') + '\n');
  }
} finally { try { fs.unlinkSync(a.brut); } catch { /* déjà absent */ } }
fs.writeFileSync(a.comptes, JSON.stringify(comptes, null, 1));
console.log(JSON.stringify(comptes));
