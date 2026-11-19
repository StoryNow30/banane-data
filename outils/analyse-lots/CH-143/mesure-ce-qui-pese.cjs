#!/usr/bin/env node
'use strict';
/* CH-143 (lot A4 d'Ariane 6) — CE QUI PÈSE À L'OPÉRATEUR, MESURÉ SUR SES EXPORTS.
 *
 * Trois chiffres, un lot = un `batchId` :
 *  1. le temps de relecture, par lot (durée du `relecture-fin`) et par cut (durées des `relecture-ombre`) ;
 *  2. les cuts posés à la main (`finsLot.main`) et ceux écrits par la seconde passe (`finsLot.ecritsPasse`) ;
 *  3. la durée des lots (`finsLot.dureeMs`).
 *
 * Lecture seule : chaque journal est lu par `unzip -p` (aucune extraction). Dédoublonnage par `batchId`
 * (une session peut être exportée deux fois). Aucune donnée de terrain en sortie : parties, comptes, durées.
 *
 *   node outils/analyse-lots/CH-143/mesure-ce-qui-pese.cjs \
 *     [--collections <dossier>] [--sortie <fichier.json>] [--md <fichier.md>]
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const COLLECTIONS = '/home/opencode/banane-data/collections';
const MAX_BUF = 512 * 1024 * 1024;

function args(a) {
  const o = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i], v = () => a[++i];
    if (k === '--collections') o.collections = v();
    else if (k === '--sortie') o.sortie = v();
    else if (k === '--md') o.md = v();
    else throw Error(`option inconnue : ${k}`);
  }
  o.collections = o.collections || COLLECTIONS;
  return o;
}

const membres = zip => execFileSync('unzip', ['-Z1', zip], { maxBuffer: 32 * 1024 * 1024 })
  .toString('utf8').split('\n').filter(Boolean);
const lireJournal = (zip, membre) =>
  JSON.parse(execFileSync('unzip', ['-p', zip, membre], { maxBuffer: MAX_BUF }).toString('utf8'));

/* Le journal d'un lot est réparti sur plusieurs volumes : on cherche l'archive qui le porte. */
function journalDeCollection(dossier) {
  const brut = path.join(dossier, 'raw');
  if (!fs.existsSync(brut)) return null;
  for (const f of fs.readdirSync(brut).filter(x => /^ariane-lot-.*\.zip$/.test(x))) {
    const zip = path.join(brut, f);
    const m = membres(zip).find(x => /ariane-journal-v4-.*\.json$/.test(x));
    if (m) return { zip, membre: m, fichier: f };
  }
  return null;
}

const mediane = a => {
  if (!a.length) return null;
  const v = a.slice().sort((x, y) => x - y);
  return Math.round(v[v.length >> 1]);
};
const centile = (a, p) => {
  if (!a.length) return null;
  const v = a.slice().sort((x, y) => x - y);
  return Math.round(v[Math.min(v.length - 1, Math.floor((v.length - 1) * p))]);
};
const min = ms => (Number.isFinite(ms) ? Math.round(ms / 60000) : null);

const o = args(process.argv.slice(2));
const lots = new Map();      // batchId -> ligne
const dureesParCut = [];     // {batchId, totalMs, navigationMs, captureMs, calculMs}
const collections = [];

for (const d of fs.readdirSync(o.collections).sort()) {
  const dossier = path.join(o.collections, d);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const j = journalDeCollection(dossier);
  if (!j) continue;
  const journal = lireJournal(j.zip, j.membre);
  let fins = 0, relus = 0;
  const dureesLot = [];

  for (const f of journal.finsLot || []) {
    if (!f || !f.batchId) continue;
    fins++;
    const ligne = {
      collection: d, fichier: j.fichier, partie: f.part, batchId: f.batchId,
      poses: f.poses ?? null, differes: f.differes ?? null, main: f.main ?? null,
      ecritsPasse: f.ecritsPasse ?? null, dureeMs: f.dureeMs ?? null,
      startedAt: f.startedAt ?? null, endedAt: f.endedAt ?? null,
      etat: f.etat ?? null, motif: f.motif ?? null,
      relecture: null,
    };
    if (!lots.has(f.batchId)) lots.set(f.batchId, ligne);
  }

  for (const e of journal.events || []) {
    if (e.type === 'relecture-fin' && e.batchId) {
      relus++;
      const l = lots.get(e.batchId);
      if (l) l.relecture = { faits: e.faits ?? null, corriges: e.corriges ?? null,
        dureeMs: e.dureeMs ?? null, vus: e.vus ?? null, issue: e.issue ?? null };
    } else if (e.type === 'relecture-ombre' && e.durees) {
      dureesLot.push({
        batchId: e.batchId ?? null,
        mode: e.mode ?? null, action: e.action ?? null, zone: e.zone ?? null, role: e.role ?? null,
        totalMs: e.durees.totalMs, navigationMs: e.durees.navigationMs,
        captureMs: e.durees.captureMs, calculMs: e.durees.calculMs,
      });
    }
  }
  /* Une même session exportée deux fois ne compte qu'une fois : on garde TOUS les événements du premier
   * journal qui porte ce `batchId`, et on ignore les suivants. */
  const vusDurees = new Set(dureesParCut.map(d => d.batchId).filter(Boolean));
  for (const d of dureesLot) {
    if (d.batchId && vusDurees.has(d.batchId)) continue;
    dureesParCut.push(d);
  }
  for (const d of dureesLot) if (d.batchId) vusDurees.add(d.batchId);
  collections.push({ collection: d, journal: j.fichier, lots: fins, relectures: relus });
}

/* Les lots sans `finsLot` mais avec un `relecture-fin` gardent leur relecture : on les ajoute par la ligne existante. */
const lignes = [...lots.values()].sort((a, b) => (a.collection + a.partie).localeCompare(b.collection + b.partie));

/* Temps de relecture ACTIF par lot : la somme des durées par cut (`relecture-ombre.durees.totalMs`), qui
 * exclut les pauses et les absences. Le `dureeMs` du `relecture-fin` est du temps MUR (départ → fin) : il est
 * gardé à part, jamais confondu avec le travail. */
const actifParLot = new Map();
for (const d of dureesParCut) {
  if (!d.batchId || !Number.isFinite(d.totalMs)) continue;
  actifParLot.set(d.batchId, (actifParLot.get(d.batchId) || 0) + d.totalMs);
}
for (const l of lignes) l.relectureActiveMs = actifParLot.get(l.batchId) ?? null;

const total = k => lignes.reduce((s, l) => s + (Number.isFinite(l[k]) ? l[k] : 0), 0);
const avecRelecture = lignes.filter(l => Number.isFinite(l.relectureActiveMs) && l.relectureActiveMs > 0);
const msParCut = avecRelecture.map(l => (l.relecture?.faits ? l.relectureActiveMs / l.relecture.faits : null)).filter(Number.isFinite);
const totaux = {
  lots: lignes.length,
  poses: total('poses'), differes: total('differes'), posesALaMain: total('main'), ecritsPasse: total('ecritsPasse'),
  dureeLotsMs: total('dureeMs'),
  dureeRelectureActiveMs: total('relectureActiveMs'),
  dureeRelectureMurMs: lignes.reduce((s, l) => s + (l.relecture && Number.isFinite(l.relecture.dureeMs) ? l.relecture.dureeMs : 0), 0),
  cutsRelus: avecRelecture.reduce((s, l) => s + (l.relecture.faits || 0), 0),
  cutsCorriges: avecRelecture.reduce((s, l) => s + (l.relecture.corriges || 0), 0),
  dureeLotMedianeMs: mediane(lignes.map(l => l.dureeMs).filter(Number.isFinite)),
  msParCutMediane: mediane(msParCut), msParCutP90: centile(msParCut, 0.9),
  partRelectureSurLot: null,
};
if (totaux.dureeLotsMs) totaux.partRelectureSurLot = +(100 * totaux.dureeRelectureActiveMs / totaux.dureeLotsMs).toFixed(1);
totaux.dureeTotaleMs = totaux.dureeLotsMs + totaux.dureeRelectureActiveMs;
totaux.partRelectureSurTotal = totaux.dureeTotaleMs
  ? +(100 * totaux.dureeRelectureActiveMs / totaux.dureeTotaleMs).toFixed(1) : null;

const parCut = {
  n: dureesParCut.length,
  totalMsMediane: mediane(dureesParCut.map(x => x.totalMs)),
  totalMsP90: centile(dureesParCut.map(x => x.totalMs), 0.9),
  totalMsMax: dureesParCut.length ? Math.max(...dureesParCut.map(x => x.totalMs)) : null,
  navigationMsMediane: mediane(dureesParCut.map(x => x.navigationMs).filter(Number.isFinite)),
  captureMsMediane: mediane(dureesParCut.map(x => x.captureMs).filter(Number.isFinite)),
  calculMsMediane: mediane(dureesParCut.map(x => x.calculMs).filter(Number.isFinite)),
};

/* Où passe le temps : par mode de relecture et par action d'ombre. Sert au lot D — si les cuts corrigés
 * coûtent beaucoup plus cher que les cuts seulement visités, relire d'abord les douteux est rentable. */
function grouper(cle) {
  const g = new Map();
  for (const d of dureesParCut) {
    const k = cle(d);
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(d);
  }
  return [...g.entries()]
    .map(([k, v]) => ({
      cle: k, n: v.length,
      totalMs: v.reduce((s, d) => s + (Number.isFinite(d.totalMs) ? d.totalMs : 0), 0),
      medianeMs: mediane(v.map(d => d.totalMs)),
      p90Ms: centile(v.map(d => d.totalMs), 0.9),
    }))
    .sort((a, b) => b.totalMs - a.totalMs);
}
const parMode = grouper(d => d.mode ?? 'inconnu');
const parAction = grouper(d => d.action ?? 'inconnue');

const resume = { genereLe: new Date().toISOString(), collections, totaux, parCut, parMode, parAction,
  lots: lignes.map(l => ({ ...l, minutesLot: min(l.dureeMs),
    minutesRelectureActive: min(l.relectureActiveMs),
    minutesRelectureMur: min(l.relecture?.dureeMs),
    secondesParCutRelec: l.relecture?.faits && Number.isFinite(l.relectureActiveMs)
      ? Math.round(l.relectureActiveMs / l.relecture.faits / 100) / 10 : null })) };

/* Tableau lisible : une ligne par lot, triée par collection puis partie. */
const md = [];
md.push('| Collection | Partie | Posés | Différés | À la main | Passe | Durée lot | Relus | Corrigés | Relecture active | s/cut |');
md.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const l of resume.lots) {
  md.push(`| ${l.collection.slice(0, 10)}… | ${l.partie} | ${l.poses ?? '—'} | ${l.differes ?? '—'} | ${l.main ?? '—'} | ${l.ecritsPasse ?? '—'} | ${l.minutesLot ?? '—'} min | ${l.relecture?.faits ?? '—'} | ${l.relecture?.corriges ?? '—'} | ${l.minutesRelectureActive ?? '—'} min | ${l.secondesParCutRelec ?? '—'} |`);
}
md.push('');
md.push(`**Totaux** : ${totaux.lots} lots, ${totaux.poses} posés, ${totaux.differes} différés, **${totaux.posesALaMain} posés à la main**, ${totaux.ecritsPasse} écrits par la passe.`);
md.push(`Durée des lots : **${Math.round(totaux.dureeLotsMs / 3600000 * 10) / 10} h** (médiane ${min(totaux.dureeLotMedianeMs)} min).`);
md.push(`Relecture ACTIVE (somme du temps par cut, pauses exclues) : **${Math.round(totaux.dureeRelectureActiveMs / 3600000 * 10) / 10} h** pour ${totaux.cutsRelus} cuts relus. Le lot mesuré ne comprend pas la relecture : elle s'ajoute après lui (${totaux.partRelectureSurLot} % du temps de pose). Posé + relu = ${Math.round(totaux.dureeTotaleMs / 3600000 * 10) / 10} h, dont **${totaux.partRelectureSurTotal} %** de relecture.`);
md.push(`Relecture en temps MUR (\`relecture-fin.dureeMs\`, pauses et absences comprises) : ${Math.round(totaux.dureeRelectureMurMs / 3600000 * 10) / 10} h — à ne pas confondre avec le travail.`);
md.push(`Par cut relu (${parCut.n} événements) : médiane ${parCut.totalMsMediane} ms — navigation ${parCut.navigationMsMediane}, capture ${parCut.captureMsMediane}, calcul ${parCut.calculMsMediane}.`);
md.push('');
md.push('**Par mode** : ' + parMode.map(g => `${g.cle} — ${g.n} cuts, ${Math.round(g.totalMs / 60000)} min, médiane ${g.medianeMs} ms`).join(' ; ') + '.');
md.push('**Par action d’ombre** : ' + parAction.map(g => `${g.cle} — ${g.n} cuts, ${Math.round(g.totalMs / 60000)} min, médiane ${g.medianeMs} ms`).join(' ; ') + '.');

console.log(md.join('\n'));
if (o.sortie) { fs.mkdirSync(path.dirname(o.sortie), { recursive: true }); fs.writeFileSync(o.sortie, JSON.stringify(resume, null, 1)); }
if (o.md) { fs.mkdirSync(path.dirname(o.md), { recursive: true }); fs.writeFileSync(o.md, md.join('\n') + '\n'); }
