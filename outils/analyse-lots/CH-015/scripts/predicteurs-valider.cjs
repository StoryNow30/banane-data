#!/usr/bin/env node
/* CH-015 tâche 3 : applique à n'importe quel lot + Écho les deux règles « avant la pose » trouvées sur la partie 20 (4.9.5.23) et chiffre leur valeur.
 *   R1 : « un des deux cuts précédents (n-1, n-2) est différé »
 *   R2 : R1 ET « aucun appui de chaîne » (appuis = 0 : anchorsUsed vide ; à défaut chaîne.appuis de L1)
 * Lecture seule. Les descripteurs ne sont que ce que le lot sait à la décision du cut (consigné au journal) et l'issue des cuts précédents du lot.
 *
 * node predicteurs-valider.cjs --outils <dossier tools/ de banane> --lot <dossier d'export du lot> --echo <dossier d'export Écho> --partie N
 *      [--tirage <tirage.json> [--role reglage]] [--json sortie.json]
 *
 * Avec --tirage, seuls les cuts du rôle demandé (défaut : reglage, tirage.cjs de CH-012) sont évalués ; un cut dont n-1 ou n-2 n'est pas du même
 * rôle est « non évaluable » et sorti du calcul (compté), pour ne lire l'issue d'aucun cut d'un autre rôle. Rien d'autre que des comptes n'est écrit.
 * Définitions identiques à tools/juger-lot.cjs : cibles, posés, jugés (corrigé ou contrôlé bon), faux = pire écart latéral > 100 mm, > 50 mm et > 20 mm en 3D.
 * Coût d'une garde = nombre de posés signalés, qui deviendraient des différés (en plus des différés actuels). */
'use strict';
const fs = require('node:fs'), path = require('node:path');
const a = (() => { const o = { role: 'reglage' }, v = process.argv.slice(2); for (let i = 0; i < v.length; i++) { if (!v[i].startsWith('--')) throw Error('argument inconnu : ' + v[i]); o[v[i].slice(2)] = v[++i]; } return o; })();
for (const k of ['outils', 'lot', 'echo', 'partie']) if (!a[k]) throw Error('--' + k + ' manquant');
const partie = Number(a.partie);
const J = require(path.join(a.outils, 'jointure-echo-orbite.cjs')), Poses = require(path.join(a.outils, 'precision-poses.cjs'));
const fini = Number.isFinite, t = e => Date.parse(e.timestamp || '');

/* rôle d'un cut d'après un tirage de CH-012 (même règle que tirage.cjs roleDe) */
let roleDe = () => 'tous';
if (a.tirage) {
  const T = JSON.parse(fs.readFileSync(a.tirage)); const ex = new Set(T.blocsExamen);
  roleDe = (cut) => { if (ex.has(Math.floor(cut / T.bloc))) return 'examen';
    for (let d = -T.garde; d <= T.garde; d++) if (cut + d >= 0 && cut + d < T.cuts && ex.has(Math.floor((cut + d) / T.bloc))) return 'garde'; return 'reglage'; };
}
const garder = cut => !a.tirage || roleDe(cut) === a.role;

const journal = Poses.lireJournalDir(a.lot);
const ev = journal.events.filter(e => fini(t(e))).sort((x, y) => t(x) - t(y));
const dep = ev.filter(e => e.type === 'batch-started' && e.batch && e.batch.id && e.identity && e.identity.part === partie).pop();
if (!dep) throw Error('aucun lot de la partie ' + partie + ' dans ce journal');
const B = dep.batch.id, t0 = t(dep), arret = ev.find(e => e.type === 'batch-stopped-at-end' && t(e) > t0), fin = arret ? t(arret) + 5000 : Infinity;
const cibles = new Set();
for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === partie && Number.isInteger(e.identity.cut)) cibles.add(e.identity.cut);
for (const e of ev) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === partie && t(e) >= t0 && t(e) <= t0 + 30000) cibles.delete(e.identity.cut);
const poses = new Set();
for (const e of ev) if (e.type === 'esv-observation' && e.kind === 'write' && t(e) >= t0 && t(e) < fin && Number.isInteger(e.status) && e.status >= 200 && e.status < 300
  && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && cibles.has(e.rowIndex)) poses.add(e.rowIndex);
const shadow = new Map(); for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === partie) shadow.set(e.identity.cut, e);

const echo = Poses.lireEcho(J.dossiersEcho ? J.dossiersEcho([a.echo]) : [a.echo]);
const { table } = J.joindre(echo.records, journal, { partie, base: 'auto', poses: false, visiteSansActionBonne: true, sessions: echo.sessions || [],
  pagesPerdues: echo.pagesPerdues || [], capturesParVisite: echo.capturesParVisite || {}, evenementsEcho: echo.evenements || [] });
const lignes = new Map(table.filter(l => l.partie === partie).map(l => [l.cut, l]));

const abs = v => fini(v) ? Math.abs(v) : null;
const rows = []; let nonEvaluables = 0, horsRole = 0;
for (const cut of [...cibles].sort((x, y) => x - y)) {
  if (!garder(cut)) { horsRole++; continue; }
  if (!garder(cut - 1) || !garder(cut - 2)) { nonEvaluables++; continue; }
  const L = (shadow.get(cut) || {}).lotObservation || {}, pose = poses.has(cut), l = lignes.get(cut);
  const appuis = Array.isArray(L.anchorsUsed) ? L.anchorsUsed.length : (L.l1 && L.l1.chaine && fini(L.l1.chaine.appuis) ? L.l1.chaine.appuis : null);
  const prec = k => cibles.has(cut - k) && !poses.has(cut - k);
  const r = { cut, pose, deuxPrec: prec(1) || prec(2), appuis, jug: false };
  if (pose && l && l.dansEcho && l.referenceHumaine === 'observee') {
    if (l.regleVisiteBon) Object.assign(r, { jug: true, mm: 0, lat: 0 });
    else if (typeof l.base === 'string' && l.base.startsWith('ariane') && l.ecartHumain && fini(l.ecartHumain.maxDist3dMm)) {
      const lats = ['gauche', 'droite'].map(c => abs((l.ecartHumain[c] || {}).lateralMm)).filter(fini);
      Object.assign(r, { jug: true, mm: l.ecartHumain.maxDist3dMm, lat: lats.length ? Math.max(...lats) : null });
    }
  }
  rows.push(r);
}
const posesR = rows.filter(r => r.pose), jug = posesR.filter(r => r.jug);
const F = r => fini(r.lat) && r.lat > 100, G50 = r => r.mm > 50, G20 = r => r.mm > 20;
const wilson = (k, n) => { if (!n) return null; const z = 1.96, p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [+((c - m) / d).toFixed(3), +((c + m) / d).toFixed(3)]; };
const regles = { 'R1 un des 2 cuts précédents est différé': r => r.deuxPrec, 'R2 R1 ET appuis = 0': r => r.deuxPrec && r.appuis === 0 };
const out = { partie, role: a.tirage ? a.role : 'tous', cibles: rows.length, posés: posesR.length, différés: rows.length - posesR.length, jugés: jug.length,
  faux100: jug.filter(F).length, plus50: jug.filter(G50).length, plus20: jug.filter(G20).length, nonEvaluables, horsRole: a.tirage ? horsRole : 0,
  appuisInconnus: posesR.filter(r => r.appuis === null).length, regles: {} };
for (const [nom, f] of Object.entries(regles)) {
  const sp = posesR.filter(f), sj = jug.filter(f), k = (g) => sj.filter(g).length, T = (g) => jug.filter(g).length;
  out.regles[nom] = { posésSignalés: sp.length, partDesPosés: posesR.length ? +(sp.length / posesR.length).toFixed(3) : null, coûtDifférésSupplémentaires: sp.length,
    jugésSignalés: sj.length, faux100: k(F), plus50: k(G50), plus20: k(G20),
    précisionFaux100: sj.length ? +(k(F) / sj.length).toFixed(3) : null, icPrécision: wilson(k(F), sj.length),
    rappelFaux100: T(F) ? +(k(F) / T(F)).toFixed(3) : null, rappelPlus50: T(G50) ? +(k(G50) / T(G50)).toFixed(3) : null,
    tauxFauxParmiJugésNonSignalés: (jug.length - sj.length) ? +((T(F) - k(F)) / (jug.length - sj.length)).toFixed(3) : null };
}
if (a.json) fs.writeFileSync(a.json, JSON.stringify(out, null, 1));
const v = x => x === null || x === undefined ? '—' : String(x).replace('.', ',');
console.log(`Partie ${partie}, cuts évalués : ${out.role}${a.tirage ? ` (hors rôle ${out.horsRole}, non évaluables ${out.nonEvaluables})` : ''}`);
console.log(`  cibles ${out.cibles}, posés ${out.posés}, différés ${out.différés}, jugés ${out.jugés}, faux > 100 mm ${out.faux100}, > 50 mm ${out.plus50}, > 20 mm ${out.plus20}`);
for (const [nom, r] of Object.entries(out.regles)) console.log(`  ${nom} : signalés ${r.posésSignalés} posés (${v(r.partDesPosés)} des posés ; coût ${r.coûtDifférésSupplémentaires} différés de plus), dont ${r.jugésSignalés} jugés : faux ${r.faux100} (précision ${v(r.précisionFaux100)} IC ${JSON.stringify(r.icPrécision)}), > 50 mm ${r.plus50}, > 20 mm ${r.plus20} ; rappel faux ${v(r.rappelFaux100)}, rappel > 50 mm ${v(r.rappelPlus50)} ; taux de faux parmi les jugés non signalés ${v(r.tauxFauxParmiJugésNonSignalés)}`);
