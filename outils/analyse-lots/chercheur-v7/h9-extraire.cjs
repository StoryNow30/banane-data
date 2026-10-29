#!/usr/bin/env node
'use strict';
/*
 * h9-extraire.cjs — jeu d'hypothèses de gcv2-jeu + candidats H9 (CONCEPTION-H9.md). `tools/gcv2-jeu.cjs` n'est PAS modifié : lu, trois ajouts EN MÉMOIRE, compilé sous son chemin d'origine.
 *   (1) avant la construction des items H2 : pour chaque rail, une pose par valeur distincte (écart ≥ 2 mm) de décalage des voisins HUMAINS de H6 (±10 cuts), pose d'ESV d'origine
 *       translatée de ce décalage ; marquée origine « H9 », sous « h9-voisin », et munie du trait h6 pour que ses points soient comptés sur la capture translatée (comme H6) ;
 *   (2) ajoutées après les items H2, via la même fonction de déduplication (0,75 mm : une H9 qui tombe sur une pose existante s'y fond et laisse « H9 » dans ses origines) ;
 *   (3) le plafond de 12 poses ne s'applique pas aux H9.
 *   node --max-old-space-size=12000 h9-extraire.cjs --banane <tronc> --journal J.json --echo <dossier Écho> --partie N --projet P --sortie jeu.jsonl --comptes c.json [--tirage T.json --role reglage]
 */
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const T = a.tirage ? require('./tirage.cjs') : null, tirage = a.tirage ? JSON.parse(fs.readFileSync(a.tirage, 'utf8')) : null;
const garder = cut => !T || T.roleDe(tirage, cut) === (a.role || 'reglage');
const chemin = path.join(a.banane, 'tools/gcv2-jeu.cjs');
let src = fs.readFileSync(chemin, 'utf8').replace(/^#!.*\n/, '');
const unique = (s, nom) => { if (src.split(s).length !== 2) throw Error('ancre introuvable ou multiple : ' + nom); };
const A1 = "    /* H2 : par priorité (compétitive STRONG, compétitive, STRONG écartée), à perte croissante. */";
const A2 = "    for (const it of h2Items) if (!ajoute(it)) tronques[s].push(it.mm.map(v => arrondi(v, 2)));";
const A3 = "      if (gardees.length >= MAX_HYP) return false;";
for (const [s, n] of [[A1, 'A1'], [A2, 'A2'], [A3, 'A3']]) unique(s, n);
src = src.replace(A1, `    const items9 = [];
    if (baseH6) { const dejaVus = []; for (const v of voisinsH6(identity, voisins).filter(x => x.source === 'humain')) { const off = v.decalage[s], b = baseH6[s];
      if (dejaVus.some(o => Math.hypot(o[0] - off[0], o[1] - off[1]) < 2)) continue; dejaVus.push(off);
      items9.push({ origine: 'H9', sous: 'h9-voisin', mm: [b[0], b[1] + off[0], b[2] + off[1]], calage: null, cellule: null,
        h6: { source: 'humain', ampleurMm: Math.hypot(off[0], off[1]), distCuts: Math.abs(v.identity.cut - identity.cut), n: 1, dispersionMm: null } }); } }
` + A1);
src = src.replace(A2, A2 + "\n    for (const it of items9) ajoute(it);");
src = src.replace(A3, "      if (gardees.length >= MAX_HYP && it.origine !== 'H9') return false;");
const m = new Module(chemin, null); m.filename = chemin; m.paths = Module._nodeModulePaths(path.dirname(chemin));
m._compile(src, chemin);
const G = m.exports;
const dossiersEcho = [];
(function marche(d) { const es = fs.readdirSync(d, { withFileTypes: true }); if (es.some(e => e.isFile() && /^ariane-echo-.*\.json$/.test(e.name))) dossiersEcho.push(d); for (const e of es) if (e.isDirectory()) marche(path.join(d, e.name)); })(a.echo);
const projet = Number(a.projet), partie = Number(a.partie);
const c = G.controlerManifeste({ projet, partie, jugerReservee: false });
const r = G.construire({ projet, partie, echo: dossiersEcho, journaux: [a.journal], sansLot: false, jeu: c.jeu, journal: () => {} });
const lignes = r.lignes.filter(l => !Number.isInteger(l.cut) || garder(l.cut));
fs.writeFileSync(a.sortie, lignes.map(l => JSON.stringify(l)).join('\n') + '\n');
fs.writeFileSync(a.comptes, JSON.stringify({ jeu: c.jeu, lignesProduites: r.lignes.length, lignesEcrites: lignes.length, role: T ? a.role : 'toutes', hypH9: lignes.filter(l => l.type === 'hyp' && (l.origines || []).includes('H9')).length }, null, 1));
console.log(JSON.stringify({ lignes: lignes.length }));
