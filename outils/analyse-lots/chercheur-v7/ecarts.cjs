#!/usr/bin/env node
'use strict';
/*
 * ecarts.cjs — écart par cut entre la pose v6 du lot et la dernière validation de l'opérateur, par rail et par axe (CH-012).
 *   node --max-old-space-size=12000 ecarts.cjs --banane <dépôt banane> --lot <dossier journal> --echo <dossier Écho> --partie N \
 *        --tirage tirage.json --sortie par-cut-reglage.json
 * RÈGLE : seuls les cuts du RÉGLAGE du tirage sont écrits. Les cuts d'examen et de garde ne sont ni lus ni écrits ici
 * (ils sont comptés par rôle, sans écart). Les règles « cible / posé / jugé » sont celles de tools/juger-lot.cjs
 * (lotDe, ciblesDe, posesDe, etatPose recopiés : le module ne les exporte pas).
 * Repère des écarts : repère profil de la pose du lot (longitudinal, latéral, vertical), signe = validation moins pose v6.
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
const fini = v => Number.isFinite(v);
const instant = e => { const t = Date.parse(e && e.timestamp || ''); return fini(t) ? t : null; };

/* --- recopié de tools/juger-lot.cjs (lotDe, ciblesDe, posesDe) --- */
function lotDe(journal, p) {
  const ev = journal.events.filter(e => instant(e) !== null).sort((x, y) => instant(x) - instant(y));
  const departs = ev.filter(e => e.type === 'batch-started' && e.batch && e.batch.id);
  const mien = departs.filter(e => e.identity && e.identity.part === p).pop();
  if (!mien) return null;
  const Bt = mien.batch.id, t0 = instant(mien); let fin = Infinity;
  const suivant = departs.find(e => instant(e) > t0 && e.batch.id !== Bt); if (suivant) fin = instant(suivant);
  const arret = ev.find(e => e.type === 'batch-stopped-at-end' && instant(e) > t0);
  if (arret) fin = Math.min(fin, instant(arret) + 5000);
  else { const rel = ev.find(e => e.type === 'relecture-debut' && e.batchId === Bt); if (rel) fin = Math.min(fin, instant(rel)); }
  return { ev, B: Bt, t0, fin };
}
function cibles(lot, p) {
  const c = new Map();
  for (const e of lot.ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === lot.B && e.identity && e.identity.part === p && Number.isInteger(e.identity.cut)) c.set(e.identity.cut, e);
  for (const e of lot.ev) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === p && instant(e) >= lot.t0 && instant(e) <= lot.t0 + 30000) c.delete(e.identity.cut);
  return c;
}
function poses(lot, c) {
  const s = new Set();
  for (const e of lot.ev) {
    if (e.type !== 'esv-observation' || e.kind !== 'write') continue;
    const t = instant(e); if (t < lot.t0 || t >= lot.fin) continue;
    const ok = Number.isInteger(e.status) && e.status >= 200 && e.status < 300;
    if (ok && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && c.has(e.rowIndex)) s.add(e.rowIndex);
  }
  return s;
}

const journal = Poses.lireJournalDir(a.lot);
const echo = Poses.lireEcho(Lot.dossiersEcho([a.echo]));
const lot = lotDe(journal, partie), cib = cibles(lot, partie), pos = poses(lot, cib);
const { table } = J.joindre(echo.records, journal, { partie, base: 'auto', poses: false, visiteSansActionBonne: true, sessions: echo.sessions || [],
  pagesPerdues: echo.pagesPerdues || [], capturesParVisite: echo.capturesParVisite || {}, evenementsEcho: echo.evenements || [] });
const ligne = new Map(table.filter(l => l.partie === partie).map(l => [l.cut, l]));
const arr = v => fini(v) ? Math.round(v * 100) / 100 : null;
const rail = r => r && r.repere === 'profil' ? { long: arr(r.longitudinalMm), lat: arr(r.lateralMm), vert: arr(r.verticalMm), d3: arr(r.dist3dMm) } : null;

const comptes = { reglage: 0, examen: 0, garde: 0 }, sortie = [];
for (const cut of pos) {
  const role = T.roleDe(tirage, cut); comptes[role]++;
  if (role !== 'reglage') continue;
  const l = ligne.get(cut), e = cib.get(cut), lo = e && e.lotObservation || {};
  const base = { cut, shape: e && e.identity ? e.identity.shape || null : null, stage: lo.stage || null, crossing: lo.crossing ?? null, levelCrossing: lo.levelCrossing ?? null,
    anchorsUsed: Array.isArray(lo.anchorsUsed) ? lo.anchorsUsed.length : (fini(lo.anchorsUsed) ? lo.anchorsUsed : null) };
  if (!l || !l.dansEcho) { sortie.push({ ...base, etat: 'sans-echo' }); continue; }
  if (l.referenceHumaine !== 'observee') { sortie.push({ ...base, etat: 'non-juge' }); continue; }
  if (l.regleVisiteBon) { sortie.push({ ...base, etat: 'controle', max3d: 0 }); continue; }
  if (typeof l.base !== 'string' || !l.base.startsWith('ariane')) { sortie.push({ ...base, etat: 'repere', baseRepere: l.base }); continue; }
  const h = l.ecartHumain;
  sortie.push({ ...base, etat: fini(h && h.maxDist3dMm) ? 'corrige' : 'non-juge', max3d: arr(h && h.maxDist3dMm), gauche: rail(h && h.gauche), droite: rail(h && h.droite) });
}
const res = { format: 'ariane-chercheur-v7-ecarts-reglage-v1', partie, tirage: path.basename(a.tirage), posesParRole: comptes,
  note: 'Seul le réglage est écrit. Signe : validation de l’opérateur moins pose v6, repère profil de la pose v6.', cuts: sortie };
fs.writeFileSync(a.sortie, JSON.stringify(res, null, 1));
const etats = {}; for (const c of sortie) etats[c.etat] = (etats[c.etat] || 0) + 1;
console.log(JSON.stringify({ posesParRole: comptes, reglageEtats: etats }));
