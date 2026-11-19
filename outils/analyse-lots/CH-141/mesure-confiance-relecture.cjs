#!/usr/bin/env node
'use strict';
/* CH-141, F2 — LA CONFIANCE GARDE-T-ELLE QUELQUE CHOSE DANS LA RELECTURE ?
 *
 * Mesure seule, lecture seule, aucune donnée de terrain en sortie (numéros de partie et de cut, comptes,
 * seuils). À partir d'un journal de lot (`ariane-journal-v4-*.json`) et des Échos de la même session :
 *
 *  1. compte les corrections de relecture (`relecture-ombre`, `action=corrige`) et celles qui portent une
 *     confiance 0 sur un rail ; distingue les 0 structurels (rail repêché par S1, `s1=true`) des 0 publiés
 *     par A* ;
 *  2. pour chaque correction à 0, cherche dans les Échos une visite humaine POSTÉRIEURE à l'écriture :
 *     c'est le seul juge de terrain possible. Dit combien sont jamais revues, revues sans validation,
 *     revues avec une validation (et de combien l'opérateur a alors bougé) ;
 *  3. applique les seuils du fichier de réglages par défaut (PN 85, ADV 95, abords 80, vert-hors-zone 90,
 *     écartement 0) aux mêmes corrections : combien passeraient, combien seraient bloquées, par zone.
 *
 *   node outils/analyse-lots/CH-141/mesure-confiance-relecture.cjs \
 *     --journal <ariane-journal-v4-*.json> --echo <dossier des JSON d'Écho> [--sortie <fichier.json>]
 *
 * Le dossier d'Écho se fabrique en décompactant les archives `ariane-echo-*.zip` (les segments se lisent
 * indifféremment, la visite la plus tardive gagne).
 */
const fs = require('node:fs');
const path = require('node:path');

const SIDES = ['left', 'right'];
const DEFAUT = { pn: 85, adv: 95, abords: 80, 'vert-hors-zone': 90, ecartement: 0 };

function args(a) {
  const o = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i], v = () => a[++i];
    if (k === '--journal') o.journal = v();
    else if (k === '--echo') o.echo = v();
    else if (k === '--sortie') o.sortie = v();
    else throw Error(`option inconnue : ${k}`);
  }
  if (!o.journal || !o.echo) throw Error('--journal et --echo sont requis');
  return o;
}

const pourcent = (n, d) => (d ? Math.round((100 * n) / d) : 0);
const mediane = a => {
  if (!a.length) return null;
  const v = a.slice().sort((x, y) => x - y);
  return v[v.length >> 1];
};

/* Corrections de relecture à confiance nulle, et la confiance minimale par correction. */
function corrections(ev) {
  const toutes = ev.filter(e => e.type === 'relecture-ombre' && e.action === 'corrige');
  const aZero = toutes.filter(e => SIDES.some(s => (e.confiance || {})[s] === 0));
  const s1 = aZero.filter(e => SIDES.some(s => (e.confiance || {})[s] === 0 && (e.s1 || {})[s] === true));
  return { toutes, aZero, s1 };
}

/* Visites humaines lues dans les Échos : (partie/cut) -> [{debut, etiquette, delta}]. */
function visites(dossier) {
  const carte = new Map();
  for (const f of fs.readdirSync(dossier).filter(x => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dossier, f), 'utf8'));
    const ids = j.dictionaries?.identities || [];
    for (const r of j.records || []) {
      const ref = r.identity?.__ref;
      const id = ref ? ids[Number(ref.split(':')[1])] : r.identity;
      if (!id || !Number.isInteger(id.part) || !Number.isInteger(id.cut)) continue;
      const k = `${id.part}/${id.cut}`;
      if (!carte.has(k)) carte.set(k, []);
      carte.get(k).push({
        debut: Date.parse(r.startedAt),
        etiquette: r.observedLabelCandidate || null,
        delta: r.humanDelta || null,
      });
    }
  }
  return carte;
}

const o = args(process.argv.slice(2));
const journal = JSON.parse(fs.readFileSync(o.journal, 'utf8'));

/* 1. Correction à confiance nulle = le champ `confiance` du journal, écrit par la relecture. */
const { toutes, aZero, s1 } = corrections(journal.events || []);
const detail = aZero.map(e => ({ part: e.identity.part, cut: e.identity.cut, t: Date.parse(e.timestamp),
  zone: e.zone, pireMm: e.pireMm, confiance: e.confiance, s1: e.s1 || null }));

/* 2. Le seul juge possible : une visite humaine postérieure à l'écriture. */
const vus = visites(o.echo);
let jamais = 0, sansValidation = 0, avecValidation = 0;
const juges = [];
for (const c of detail) {
  const apres = (vus.get(`${c.part}/${c.cut}`) || []).filter(v => v.debut > c.t);
  if (!apres.length) { jamais++; continue; }
  const v = apres.find(x => /VALIDATE/.test(String(x.etiquette)));
  if (!v) { sansValidation++; continue; }
  avecValidation++;
  const mouvement = SIDES.map(s => v.delta?.[s]?.distanceMm).filter(Number.isFinite);
  juges.push({ part: c.part, cut: c.cut, etiquette: v.etiquette, correctionMm: c.pireMm, mouvementMm: mouvement });
}

/* 3. Effet des seuils du défaut sur les MÊMES corrections (lecture seule du fichier proposé pour le constat). */
const parZone = {}, bloqueesParZone = {};
let passent = 0;
for (const e of toutes) {
  const seuil = DEFAUT[e.zone] ?? 0;
  const c = e.confiance || {};
  const ok = SIDES.every(s => Number.isFinite(c[s]) && c[s] >= seuil);
  parZone[e.zone] = (parZone[e.zone] || 0) + 1;
  if (ok) passent++;
  else bloqueesParZone[e.zone] = (bloqueesParZone[e.zone] || 0) + 1;
}
const minima = toutes.map(e => Math.min(...SIDES.map(s => (Number.isFinite((e.confiance || {})[s]) ? e.confiance[s] : -1))));

const sortie = {
  corrections: toutes.length,
  aConfianceNulle: aZero.length,
  dontSentineleS1: s1.length,
  dontConfiancePublieeAZero: aZero.length - s1.length,
  juge: { jamaisRevues: jamais, revuesSansValidation: sansValidation, revuesAvecValidation: avecValidation, cas: juges },
  seuilsDefaut: { passeraient: passent, bloquees: toutes.length - passent,
    pourcentageBloquees: pourcent(toutes.length - passent, toutes.length),
    bloqueesParZone, parZone,
    confianceMinMediane: mediane(minima) },
};
const cible = o.sortie || path.join(__dirname, 'sorties', `confiance-relecture-${Date.now()}.json`);
fs.mkdirSync(path.dirname(cible), { recursive: true });
fs.writeFileSync(cible, JSON.stringify(sortie, null, 1));

console.log(`corrections de relecture : ${toutes.length}, dont ${aZero.length} à confiance nulle`);
console.log(`  sentinelle S1 (non calibrée) : ${s1.length} ; confiance A* publiée à 0 : ${aZero.length - s1.length}`);
console.log(`juge de terrain : jamais revues ${jamais}, revues sans validation ${sansValidation}, revues avec une validation ${avecValidation}`);
for (const j of juges) console.log(`  ${j.part}/${j.cut} ${j.etiquette} correction ${j.correctionMm} mm, opérateur ${JSON.stringify(j.mouvementMm)}`);
console.log(`seuils du défaut : ${passent} passeraient (${pourcent(passent, toutes.length)} %), ${toutes.length - passent} bloquées (${pourcent(toutes.length - passent, toutes.length)} %)`);
console.log(`  bloquées par zone : ${JSON.stringify(bloqueesParZone)}`);
console.log(`écrit : ${cible}`);
