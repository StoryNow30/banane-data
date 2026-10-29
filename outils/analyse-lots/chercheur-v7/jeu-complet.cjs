#!/usr/bin/env node
'use strict';
/* jeu-complet.cjs — gcv2-jeu construire sur une partie en APPRENTISSAGE (manifeste du tronc), sans filtre de rôle (partie 20, D-266). Sortie dans le dossier de travail,
 * jamais dans le dépôt. Aucune option de jugement de partie réservée : si la partie est réservée, l'outil refuse et le script s'arrête. */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const dossiersEcho = [];
(function marche(d) { const es = fs.readdirSync(d, { withFileTypes: true }); if (es.some(e => e.isFile() && /^ariane-echo-.*\.json$/.test(e.name))) dossiersEcho.push(d); for (const e of es) if (e.isDirectory()) marche(path.join(d, e.name)); })(a.echo);
const r = cp.spawnSync(process.execPath, ['--max-old-space-size=12000', path.join(a.banane, 'tools/gcv2-jeu.cjs'), 'construire', '--partie', `${a.projet}:${a.partie}`, '--journal', a.journal, ...dossiersEcho.flatMap(d => ['--echo', d]), '--sortie', a.sortie], { stdio: ['ignore', 'ignore', 'pipe'], cwd: a.banane });
const lignes = fs.existsSync(a.sortie) ? fs.readFileSync(a.sortie, 'utf8').split('\n').filter(Boolean).length : 0;
const err = String(r.stderr || '').split('\n').filter(l => /réserv|apprentissage|refus/i.test(l)).slice(0, 2).join(' | ');
fs.writeFileSync(a.comptes, JSON.stringify({ statut: r.status, lignes, dossiersEcho: dossiersEcho.length, avisManifeste: err || null }, null, 1));
console.log(JSON.stringify({ statut: r.status, lignes, avisManifeste: err || null }));
