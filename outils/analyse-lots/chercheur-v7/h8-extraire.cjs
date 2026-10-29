#!/usr/bin/env node
'use strict';
/*
 * h8-extraire.cjs — jeu d'hypothèses de gcv2-jeu + les VOISINS SÛRS de chaque cut (décalages par rail), pour la candidate H8 (CH-012, D-266).
 *   node --max-old-space-size=12000 h8-extraire.cjs --banane <tronc> --journal J.json --echo <dossier Écho> --partie N --projet P --sortie jeu.jsonl --voisins voisins.json --comptes c.json
 *        [--tirage T.json --role reglage]
 * `tools/gcv2-jeu.cjs` n'est PAS modifié : le script le lit, ajoute EN MÉMOIRE une seule ligne dans `hypothesesDuCut` (enregistrement des voisins que H6 utilise, familles « lot » et
 * « tous »), le compile sous son chemin d'origine (ses require relatifs restent valides) et appelle `construire` comme la ligne de commande. Hypothèses identiques : la ligne ajoutée
 * n'écrit que dans un tableau. Partie réservée : `controlerManifeste` refuse, le script s'arrête. Avec --tirage et --role, voisins et lignes écrits = ceux du rôle seulement.
 */
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const T = a.tirage ? require('./tirage.cjs') : null, tirage = a.tirage ? JSON.parse(fs.readFileSync(a.tirage, 'utf8')) : null;
const garder = cut => !T || T.roleDe(tirage, cut) === (a.role || 'reglage');
const chemin = path.join(a.banane, 'tools/gcv2-jeu.cjs');
let src = fs.readFileSync(chemin, 'utf8').replace(/^#!.*\n/, '');
const ancre = '  const tronquesH6 = { left: 0, right: 0 };';
if (src.split(ancre).length !== 2) throw Error('ancre introuvable ou multiple dans gcv2-jeu.cjs');
src = src.replace(ancre, "  if (global.__H8VOISINS) global.__H8VOISINS.push({ cut: identity.cut, lot: voisinsH6(identity, voisinsLot || voisins.filter(a => a.source === 'lot')).map(a => ({ cut: a.identity.cut, source: a.source, left: a.decalage.left, right: a.decalage.right })), tous: voisinsH6(identity, voisins).map(a => ({ cut: a.identity.cut, source: a.source, left: a.decalage.left, right: a.decalage.right })) });\n" + ancre);
const m = new Module(chemin, null); m.filename = chemin; m.paths = Module._nodeModulePaths(path.dirname(chemin));
global.__H8VOISINS = [];
m._compile(src, chemin);
const G = m.exports;
const dossiersEcho = [];
(function marche(d) { const es = fs.readdirSync(d, { withFileTypes: true }); if (es.some(e => e.isFile() && /^ariane-echo-.*\.json$/.test(e.name))) dossiersEcho.push(d); for (const e of es) if (e.isDirectory()) marche(path.join(d, e.name)); })(a.echo);
const projet = Number(a.projet), partie = Number(a.partie);
const c = G.controlerManifeste({ projet, partie, jugerReservee: false });
const r = G.construire({ projet, partie, echo: dossiersEcho, journaux: [a.journal], sansLot: false, jeu: c.jeu, journal: () => {} });
const lignes = r.lignes.filter(l => !Number.isInteger(l.cut) || garder(l.cut));
fs.writeFileSync(a.sortie, lignes.map(l => JSON.stringify(l)).join('\n') + '\n');
const vois = global.__H8VOISINS.filter(v => garder(v.cut));
fs.writeFileSync(a.voisins, JSON.stringify(vois));
fs.writeFileSync(a.comptes, JSON.stringify({ jeu: c.jeu, lignesProduites: r.lignes.length, lignesEcrites: lignes.length, voisinsEnregistres: global.__H8VOISINS.length, voisinsEcrits: vois.length, role: T ? a.role : 'toutes' }, null, 1));
console.log(JSON.stringify({ lignes: lignes.length, voisins: vois.length }));
