#!/usr/bin/env node
'use strict';
/*
 * jeu-filtre.cjs — lance tools/gcv2-jeu.cjs construire, ne garde que les lignes de RÉGLAGE, supprime la sortie brute (CH-012).
 *
 *   node jeu-filtre.cjs --banane <dépôt banane> --journal J.json --echo <dossier Écho> --partie N --projet P \
 *        --tirage tirage.json --brut <fichier temporaire> --sortie jeu-reglage.jsonl --comptes comptes.json
 *
 * Mêmes conditions que rejeu-filtre.cjs (intégrateur, 29/10/2026) : un seul script, sorties standard et d'erreur du jeu ni affichées
 * ni gardées, brut supprimé par le script lui-même, SHA-256 commité avant le premier lancement, règle = le fichier du tirage, comptes
 * lus / écrits / écartés archivés (par rôle et par type de ligne). Une ligne sans numéro de cut n'est jamais écrite, sauf l'en-tête
 * réduit à son type et son format.
 */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const T = require('./tirage.cjs'); const tirage = JSON.parse(fs.readFileSync(a.tirage, 'utf8'));
const dossiersEcho = [];
(function marche(d) { const es = fs.readdirSync(d, { withFileTypes: true }); if (es.some(e => e.isFile() && /^ariane-echo-.*\.json$/.test(e.name))) dossiersEcho.push(d); for (const e of es) if (e.isDirectory()) marche(path.join(d, e.name)); })(a.echo);
const args = ['--max-old-space-size=12000', path.join(a.banane, 'tools/gcv2-jeu.cjs'), 'construire', '--partie', `${a.projet}:${a.partie}`, '--journal', a.journal,
  ...dossiersEcho.flatMap(d => ['--echo', d]), '--sortie', a.brut];
const r = cp.spawnSync(process.execPath, args, { stdio: ['ignore', 'ignore', 'ignore'], cwd: a.banane });
const comptes = { statutJeu: r.status, lignesLues: 0, ecrites: 0, parType: {}, ecartees: { examen: 0, garde: 0, sansCut: 0 }, ecrit: a.sortie };
try {
  if (r.status === 0 && fs.existsSync(a.brut)) {
    const lignes = fs.readFileSync(a.brut, 'utf8').split('\n').filter(Boolean), sortie = [];
    for (const brute of lignes) {
      comptes.lignesLues++;
      const l = JSON.parse(brute);
      if (!Number.isInteger(l.cut)) {
        comptes.ecartees.sansCut++;
        if (comptes.lignesLues === 1) sortie.push(JSON.stringify({ type: l.type || 'entete', format: l.format || null }));
        continue;
      }
      const role = T.roleDe(tirage, l.cut);
      if (role === 'reglage') { sortie.push(brute); comptes.ecrites++; comptes.parType[l.type] = (comptes.parType[l.type] || 0) + 1; } else comptes.ecartees[role]++;
    }
    fs.writeFileSync(a.sortie, sortie.join('\n') + '\n');
  }
} finally { try { fs.unlinkSync(a.brut); } catch { /* déjà absent */ } }
fs.writeFileSync(a.comptes, JSON.stringify(comptes, null, 1));
console.log(JSON.stringify(comptes));
