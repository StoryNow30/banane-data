#!/usr/bin/env node
'use strict';
/* CH-142 (lot A2 d'Ariane 6) : QUAND L'ANCRE DE TRAJECTOIRE SE TAIT SUR LE TERRAIN.
 *
 * Mesure seule. Pour chaque lot-partie exporté des lots de terrain listés ci-dessous, lit la liste d'ESV
 * portée par le MÊME export de lot (jamais une autre collection), la décompacte et applique les règles de
 * src/ancre-trajectoire.js (`lignes`, `preparer`, `axe`) à chaque cut visité et à chaque cut posé du journal
 * du lot. Classe chaque cut dans la première cause de mutisme qui s'applique, dans l'ordre du ticket :
 *   1. liste-absente                (la partie n'a pas de liste d'ESV dans l'export du lot)
 *   2. liste-courte                 (moins de minLignesListe = 100 lignes utilisables)
 *   3. cut-hors-liste               (ligne absente ou bout de liste)
 *   4. voie-courante-insuffisante   (pas assez de lignes de voie courante intactes / sens non établi)
 *   et `etablie` quand l'ancre rend un axe.
 *
 * Populations : `visite` = cut lu par Ariane (before-captured ou proposed dans le journal du lot) ;
 * `pose` = cut dont l'écriture a été observée (validation-ecriture-observee, statut 2xx). Un cut accepté
 * sans écriture observée est compté à part (`accepte_sans_ecriture`) et n'entre dans aucune des deux
 * populations principales.
 *
 * Aucune extraction sur disque : chaque membre d'archive est lu par `unzip -p` (une archive à la fois).
 * Aucune donnée de terrain en sortie : lot (identifiant de version), numéro de partie, numéro de cut,
 * comptes, seuils et causes. Le texte des listes et le journal ne sortent pas de ce dossier.
 *
 *   node --max-old-space-size=2048 outils/analyse-lots/CH-142/mesure-ancre-muette.cjs \
 *     [--donnees DIR] [--banane DIR] [--sortie DIR] [--lots V18,V19.1,V19,V20,V15]
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const LOTS = {
  V18: '2026-11-16_v18_constellation-25-32',
  'V19.1': '2026-11-17_v191_lot-et-echo',
  V19: '2026-11-17_v19_constellation-p2-3',
  V20: '2026-11-18_v20_lot-parties6-15',
  V15: '2026-11-12_v15_constellations-21-23_0-4',
};
const CAUSES = ['liste-absente', 'liste-courte', 'cut-hors-liste', 'voie-courante-insuffisante'];

function args(a) {
  const o = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i], v = () => a[++i];
    if (k === '--donnees') o.donnees = v();
    else if (k === '--banane') o.banane = v();
    else if (k === '--sortie') o.sortie = v();
    else if (k === '--lots') o.lots = v().split(',').map(s => s.trim()).filter(Boolean);
    else throw Error(`option inconnue : ${k}`);
  }
  o.donnees = o.donnees || process.env.BANANE_DATA || '/home/opencode/banane-data';
  o.banane = o.banane || process.env.BANANE || '/home/opencode/banane';
  o.sortie = o.sortie || path.join(__dirname, 'sorties');
  o.lots = o.lots || Object.keys(LOTS);
  return o;
}

const unzip = (zip, member, max) =>
  execFileSync('unzip', ['-p', zip, member], { maxBuffer: max || 32 * 1024 * 1024 }).toString('utf8');
const membres = zip =>
  execFileSync('unzip', ['-Z1', zip], { maxBuffer: 8 * 1024 * 1024 }).toString('utf8').split('\n').filter(Boolean);

/* Éléments de premier niveau d'un tableau JSON, sans parser tout l'objet : rend les sous-chaînes des objets.
 * Le journal peut porter un tableau homonyme imbriqué (compteur d'événements) : on garde le plus long. */
function elementsDepuis(txt, i, cle) {
  const marque = `"${cle}":[`;
  const out = [];
  let p = i + marque.length, depth = 1, inStr = false, esc = false, start = p;
  for (; p < txt.length; p++) {
    const c = txt[p];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '[' || c === '{') { depth++; continue; }
    if (c === ']' || c === '}') { depth--; if (depth === 0) break; continue; }
    if (c === ',' && depth === 1) { out.push(txt.slice(start, p)); start = p + 1; }
  }
  if (p > start) out.push(txt.slice(start, p));
  return out;
}
function elements(txt, cle) {
  const marque = `"${cle}":[`;
  let best = [], i = -1;
  while ((i = txt.indexOf(marque, i + 1)) >= 0) {
    const e = elementsDepuis(txt, i, cle);
    if (e.length > best.length) best = e;
  }
  return best;
}

/* Journal du lot : populations par (partie, cut). Aucun objet du journal n'est conservé après lecture. */
function populations(txt) {
  const visites = new Map(), poses = new Map(), ecritures = new Map();
  const ajouter = (m, part, cut) => {
    if (!Number.isInteger(part) || !Number.isInteger(cut) || cut < 0) return;
    if (!m.has(part)) m.set(part, new Set());
    m.get(part).add(cut);
  };
  let nEvents = 0, nTypes = {};
  for (const s of elements(txt, 'events')) {
    let e;
    try { e = JSON.parse(s); } catch (_) { continue; }
    nEvents++; nTypes[e.type] = (nTypes[e.type] || 0) + 1;
    const id = e.identity || {};
    const part = id.part ?? e.part, cut = id.cut ?? e.cut;
    if (e.type === 'before-captured' || e.type === 'proposed' || e.type === 'passe-differes-ombre') ajouter(visites, part, cut);
    if (e.type === 'validation-ecriture-observee' && Number(e.statut) >= 200 && Number(e.statut) < 300) ajouter(ecritures, part, cut);
    if (e.type === 'validation-accepted') ajouter(poses, part, cut);
  }
  const sansEcriture = new Map();
  for (const [part, cuts] of poses) for (const cut of cuts) if (!(ecritures.get(part) || new Set()).has(cut)) ajouter(sansEcriture, part, cut);
  return { visites, poses, ecritures, sansEcriture, nEvents, nTypes };
}

/* Liste d'ESV d'une partie : décompactée par le module du dépôt, puis mesurée par ses propres règles. */
function etatListe(A, LM, txt, fichier) {
  let snap;
  try { snap = JSON.parse(txt); } catch (_) { return { present: true, illisible: true, fichier }; }
  if (!snap || snap.format !== 'ariane-liste-instantane-1') return { present: true, illisible: true, fichier };
  const table = LM.decompacter(snap);
  if (!table) return { present: true, illisible: true, fichier, partie: snap.partie };
  const Lg = A.lignes(table);
  const n = table.n, m = Lg ? Lg.m : 0;
  const out = { present: true, fichier, partie: snap.partie, n, m, at: snap.at || null, _table: table,
    short: m < A.REGLAGE.minLignesListe, model: null };
  if (!out.short) {
    const Mo = A.preparer(table);
    out.model = { ok: Mo.ok, raison: Mo.raison || null, lignesPleines: Mo.lignesPleines ?? null, sens: Mo.sens ?? null,
      rapportSens: Mo.rapportSens ?? null };
  }
  return out;
}

/* Cause d'un cut, dans l'ordre du ticket ; `axe` du module pour les cas 3 et 4. */
function causeCut(A, etat, cut) {
  if (!etat || !etat.present || etat.illisible) return { cause: 'liste-absente', detail: null };
  if (etat.short) return { cause: 'liste-courte', detail: null };
  const Mo = etat._mo || (etat._mo = A.preparer(etat._table));
  if (!Mo.ok) return { cause: Mo.raison === 'liste' ? 'liste-courte' : 'voie-courante-insuffisante', detail: null };
  const ax = A.axe(Mo, cut);
  if (!ax.muet) return { cause: 'etablie', detail: ax, ax };
  if (ax.muet === 'ligne-absente' || ax.muet === 'bout-de-liste') return { cause: 'cut-hors-liste', detail: null, ax };
  if (ax.muet === 'liste') return { cause: 'liste-courte', detail: null, ax };
  return { cause: 'voie-courante-insuffisante', detail: null, ax };
}

function vide() {
  const v = {}, p = {};
  for (const c of [...CAUSES, 'etablie']) { v[c] = 0; p[c] = 0; }
  return { visites: 0, poses: 0, acceptes_sans_ecriture: 0, v, p };
}
function cumul(t, cause, pop) {
  if (pop.visite) { t.visites++; t.v[cause]++; }
  if (pop.pose) { t.poses++; t.p[cause]++; }
  if (pop.acc) t.acceptes_sans_ecriture++;
}
const muetsPoses = t => t.poses - t.p.etablie;
const muetsVisites = t => t.visites - t.v.etablie;
const pct = (n, d) => d ? Math.round(1000 * n / d) / 10 : null;
const pctTxt = (n, d) => d ? `${pct(n, d)} %` : '—';

function main() {
  const o = args(process.argv.slice(2));
  const A = require(path.join(o.banane, 'src', 'ancre-trajectoire.js'));
  const LM = require(path.join(o.banane, 'src', 'liste-memoire.js'));
  fs.mkdirSync(o.sortie, { recursive: true });

  const detail = [], parLotPartie = [], parLot = [], anomalies = [], listesAbsentes = new Map();
  const total = vide(), totalPrincipal = vide();
  let nLots = 0, nLotsParties = 0, nLotsPartiesSansListe = 0;
  let nLotsPartiesPrincipal = 0, nLotsPartiesSansListePrincipal = 0;

  for (const id of o.lots) {
    const dossier = LOTS[id];
    if (!dossier) { anomalies.push(`lot inconnu : ${id}`); continue; }
    const raw = path.join(o.donnees, 'collections', dossier, 'raw');
    if (!fs.existsSync(raw)) { anomalies.push(`${id} : dossier absent (${dossier})`); continue; }
    const zips = fs.readdirSync(raw).filter(f => /^ariane-lot-.*\.zip$/i.test(f)).sort().map(f => path.join(raw, f));
    if (!zips.length) {
      const sept = fs.readdirSync(raw).filter(f => /^ariane-lot-.*\.7z$/i.test(f));
      anomalies.push(`${id} : aucune archive de lot au format zip` + (sept.length ? ` (${sept.length} archive(s) 7z non lues, outil absent de ce poste)` : ''));
      continue;
    }

    /* Inventaire des membres : listes et journal, par archive. */
    const listesZip = new Map(), journaux = [];
    for (const z of zips) {
      for (const m of membres(z)) {
        const ml = /^ariane-liste-partie(\d+)-.*\.json$/.exec(m);
        if (ml) {
          const p = Number(ml[1]);
          if (!listesZip.has(p)) listesZip.set(p, { zip: z, member: m });
          else anomalies.push(`${id} : deux listes pour la partie ${p} (garde la première)`);
        }
        if (/^ariane-journal-v4-.*\.json$/.test(m)) journaux.push({ zip: z, member: m });
      }
    }
    if (journaux.length !== 1) { anomalies.push(`${id} : ${journaux.length} journal(aux) de lot, lot sauté`); continue; }
    const jtxt = unzip(journaux[0].zip, journaux[0].member, 512 * 1024 * 1024);
    const P = populations(jtxt);
    const parties = [...new Set([...P.visites.keys(), ...P.poses.keys(), ...P.sansEcriture.keys()])].filter(p => Number.isInteger(p)).sort((a, b) => a - b);
    if (!parties.length) { anomalies.push(`${id} : aucun cut visité ou posé dans le journal`); continue; }

    const etats = new Map();
    for (const p of parties) {
      if (!listesZip.has(p)) { etats.set(p, { present: false, fichier: null }); continue; }
      const L = listesZip.get(p);
      const etat = etatListe(A, LM, unzip(L.zip, L.member, 32 * 1024 * 1024), L.member);
      etats.set(p, etat);
      if (etat.partie != null && etat.partie !== p) anomalies.push(`${id} : liste de la partie ${p} porte partie=${etat.partie}`);
    }

    nLots++;
    const TL = vide(), parPartieLot = new Map();
    const principal = id !== 'V15';
    for (const p of parties) {
      nLotsParties++;
      if (principal) nLotsPartiesPrincipal++;
      const etat = etats.get(p);
      const cuts = [...new Set([...(P.visites.get(p) || []), ...(P.poses.get(p) || []), ...(P.sansEcriture.get(p) || [])])].sort((a, b) => a - b);
      if (!etat || !etat.present || etat.illisible) {
        nLotsPartiesSansListe++;
        if (principal) nLotsPartiesSansListePrincipal++;
        listesAbsentes.set(`${id} p${p}`, { lot: id, partie: p, cuts: cuts.length });
      }
      const TP = vide();
      for (const cut of cuts) {
        const vis = (P.visites.get(p) || new Set()).has(cut);
        const pos = (P.poses.get(p) || new Set()).has(cut);
        const acc = (P.sansEcriture.get(p) || new Set()).has(cut);
        const ecr = (P.ecritures.get(p) || new Set()).has(cut);
        const { cause, detail: ax, ax: motif } = causeCut(A, etat, cut);
        cumul(TP, cause, { visite: vis, pose: pos, acc });
        cumul(TL, cause, { visite: vis, pose: pos, acc });
        cumul(total, cause, { visite: vis, pose: pos, acc });
        if (principal) cumul(totalPrincipal, cause, { visite: vis, pose: pos, acc });
        detail.push({ lot: id, partie: p, cut, visite: vis ? 1 : 0, pose: pos ? 1 : 0, ecriture_observee: ecr ? 1 : 0, accepte_sans_ecriture: acc ? 1 : 0,
          liste_presente: etat && etat.present ? 1 : 0, liste_illisible: etat && etat.illisible ? 1 : 0,
          lignes_utilisables: etat && Number.isInteger(etat.m) ? etat.m : 0,
          modele_ok: etat && etat.model ? (etat.model.ok ? 1 : 0) : '',
          sens: etat && etat.model && etat.model.sens != null ? etat.model.sens : '',
          rapport_sens: etat && etat.model && etat.model.rapportSens != null ? Math.round(etat.model.rapportSens * 1000) / 1000 : '',
          fenetre: ax && ax.fenetre != null ? ax.fenetre : '',
          lignes_voie: ax && ax.lignes != null ? ax.lignes : '',
          motif_axe: motif ? (motif.muet || 'etablie') : cause,
          cause });
      }
      parPartieLot.set(p, TP);
      parLotPartie.push({ lot: id, partie: p, liste_presente: etat && etat.present ? 1 : 0,
        lignes_utilisables: etat && Number.isInteger(etat.m) ? etat.m : 0,
        modele_ok: etat && etat.model ? (etat.model.ok ? 1 : 0) : '', t: TP });
    }
    parLot.push({ lot: id, parties: parties.length, t: TL, parPartie: [...parPartieLot.entries()] });
  }

  /* ---------------- sorties ---------------- */
  const esc = v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const COLS = ['lot', 'partie', 'cut', 'visite', 'pose', 'ecriture_observee', 'accepte_sans_ecriture', 'liste_presente', 'liste_illisible',
    'lignes_utilisables', 'modele_ok', 'sens', 'rapport_sens', 'fenetre', 'lignes_voie', 'motif_axe', 'cause'];
  fs.writeFileSync(path.join(o.sortie, 'detail.csv'),
    [COLS.join(','), ...detail.map(d => COLS.map(c => esc(d[c])).join(','))].join('\n') + '\n');

  const L = [];
  L.push('# CH-142 — part des cuts où l\'ancre de trajectoire est muette, par lot et par cause');
  L.push('');
  L.push('Mesure sur les journaux de lot et les listes d\'ESV du **même export de lot** ; règles et seuils de `src/ancre-trajectoire.js` (`minLignesListe: 100`, `minLignes: 30`, fenêtres 200/400/800/1600, `sensRapportMin: 1.10`, `sensFaibleMaxMm: 20`).');
  L.push('Populations : `visités` = cuts lus par Ariane (`before-captured` ou `proposed`) ; `posés` = cuts validés par Ariane (`validation-accepted`), dont la colonne `ecriture_observee` dit ceux dont l\'écriture 2xx a été observée. **Le pourcentage principal porte sur les cuts posés** : c\'est là que l\'ancre doit s\'établir pour protéger une pose.');
  L.push('');
  L.push('## Par lot');
  L.push('');
  L.push('| lot | parties | cuts visités | cuts posés | muets (posés) | % muet (posés) | % muet (visités) | établie (posés) | liste-absente | liste-courte | cut-hors-liste | voie-courante-insuffisante |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
  const ligne = (nom, parties, t) => `| ${nom} | ${parties} | ${t.visites} | ${t.poses} | ${muetsPoses(t)} | ${pctTxt(muetsPoses(t), t.poses)} | ${pctTxt(muetsVisites(t), t.visites)} | ${t.p.etablie} | ${t.p['liste-absente']} | ${t.p['liste-courte']} | ${t.p['cut-hors-liste']} | ${t.p['voie-courante-insuffisante']} |`;
  for (const x of parLot) L.push(ligne(x.lot, x.parties, x.t));
  L.push(ligne('**total principal (V18 à V20)**', nLotsPartiesPrincipal, totalPrincipal));
  if (parLot.some(x => x.lot === 'V15')) L.push(ligne('total avec V15 (comparaison)', nLotsParties, total));
  L.push('');
  L.push('## Par lot-partie');
  L.push('');
  L.push('| lot-partie | liste | lignes utilisables | cuts visités | cuts posés | muets (posés) | % muet (posés) | établie | absente | courte | hors-liste | voie-courante |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const x of parLotPartie) {
    const nom = `${x.lot} p${x.partie}`;
    L.push(`| ${nom} | ${x.liste_presente ? 'oui' : 'non'} | ${x.lignes_utilisables} | ${x.t.visites} | ${x.t.poses} | ${muetsPoses(x.t)} | ${pctTxt(muetsPoses(x.t), x.t.poses)} | ${x.t.p.etablie} | ${x.t.p['liste-absente']} | ${x.t.p['liste-courte']} | ${x.t.p['cut-hors-liste']} | ${x.t.p['voie-courante-insuffisante']} |`);
  }
  L.push('');
  L.push('## Ce que la mesure compte');
  L.push('');
  L.push(`- lots lus : ${nLots} ; lots-parties avec au moins un cut : ${nLotsParties} ; dont **sans liste d\'ESV dans l\'export du lot** : ${nLotsPartiesSansListe} (${pct(nLotsPartiesSansListe, nLotsParties)} %).`);
  L.push(`- cuts de l\'union visité ∪ posé : ${detail.length} ; visités : ${total.visites} ; posés : ${total.poses} ; posés sans écriture observée : ${total.acceptes_sans_ecriture}.`);
  L.push(`- cuts muets (posés) : ${muetsPoses(total)} sur ${total.poses} (${pct(muetsPoses(total), total.poses)} %) ; cuts muets (visités) : ${muetsVisites(total)} sur ${total.visites} (${pct(muetsVisites(total), total.visites)} %).`);
  L.push(`- causes sur les posés : ${CAUSES.map(c => `${c} ${total.p[c]}`).join(' ; ')}.`);
  L.push(`- causes sur les visités : ${CAUSES.map(c => `${c} ${total.v[c]}`).join(' ; ')}.`);
  L.push('');
  L.push('## Total principal (V18 à V20), hors V15 de comparaison');
  L.push('');
  L.push(`- lots-parties : ${nLotsPartiesPrincipal} ; sans liste : ${nLotsPartiesSansListePrincipal} (${pct(nLotsPartiesSansListePrincipal, nLotsPartiesPrincipal)} %).`);
  L.push(`- cuts visités : ${totalPrincipal.visites} ; posés : ${totalPrincipal.poses} ; posés sans écriture observée : ${totalPrincipal.acceptes_sans_ecriture}.`);
  L.push(`- cuts muets (posés) : ${muetsPoses(totalPrincipal)} sur ${totalPrincipal.poses} (${pct(muetsPoses(totalPrincipal), totalPrincipal.poses)} %) ; cuts muets (visités) : ${muetsVisites(totalPrincipal)} sur ${totalPrincipal.visites} (${pct(muetsVisites(totalPrincipal), totalPrincipal.visites)} %).`);
  L.push(`- causes sur les posés : ${CAUSES.map(c => `${c} ${totalPrincipal.p[c]}`).join(' ; ')}.`);
  if (listesAbsentes.size) {
    L.push('');
    L.push('Lots-parties sans liste (tous leurs cuts sont `liste-absente`, sans comblement par une autre collection) :');
    for (const [k, v] of listesAbsentes) L.push(`- ${k} : ${v.cuts} cut(s).`);
  }
  if (anomalies.length) {
    L.push('');
    L.push('Anomalies de lecture (le lot reste mesuré sur ce qui est lisible) :');
    for (const a of anomalies) L.push(`- ${a}`);
  }
  fs.writeFileSync(path.join(o.sortie, 'tableau.md'), L.join('\n') + '\n');

  const resume = {
    chantier: 'CH-142',
    titre: 'Part des cuts où l\'ancre de trajectoire est muette, par lot et par cause',
    mesure: 'ÉTABLI : journaux et listes d\'ESV des exports de lot, règles de src/ancre-trajectoire.js',
    seuils: A.REGLAGE,
    populations: {
      visite: 'before-captured ou proposed dans le journal du lot',
      pose: 'validation-accepted ; ecriture_observee dit les écritures 2xx observées, accepte_sans_ecriture les poses acceptées sans écriture vue',
      principale: 'pose',
    },
    ordre_des_causes: CAUSES,
    lots: Object.fromEntries(parLot.map(x => [x.lot, {
      parties: x.parties,
      visites: x.t.visites, poses: x.t.poses, acceptes_sans_ecriture: x.t.acceptes_sans_ecriture,
      muets_poses: muetsPoses(x.t), pourcentage_muet_poses: pct(muetsPoses(x.t), x.t.poses),
      muets_visites: muetsVisites(x.t), pourcentage_muet_visites: pct(muetsVisites(x.t), x.t.visites),
      etablie_poses: x.t.p.etablie,
      causes_poses: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, x.t.p[c]])),
      causes_visites: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, x.t.v[c]])),
      par_partie: Object.fromEntries(x.parPartie.map(([p, t]) => [`p${p}`, {
        visites: t.visites, poses: t.poses, muets_poses: muetsPoses(t), pourcentage_muet_poses: pct(muetsPoses(t), t.poses),
        causes_poses: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, t.p[c]])),
      }])),
    }])),
    total: {
      visites: total.visites, poses: total.poses, acceptes_sans_ecriture: total.acceptes_sans_ecriture,
      muets_poses: muetsPoses(total), pourcentage_muet_poses: pct(muetsPoses(total), total.poses),
      muets_visites: muetsVisites(total), pourcentage_muet_visites: pct(muetsVisites(total), total.visites),
      causes_poses: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, total.p[c]])),
      causes_visites: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, total.v[c]])),
    },
    principal: { lots: o.lots.filter(x => x !== 'V15'),
      lots_parties: nLotsPartiesPrincipal, lots_parties_sans_liste: nLotsPartiesSansListePrincipal,
      part_lots_parties_sans_liste: pct(nLotsPartiesSansListePrincipal, nLotsPartiesPrincipal),
      visites: totalPrincipal.visites, poses: totalPrincipal.poses, acceptes_sans_ecriture: totalPrincipal.acceptes_sans_ecriture,
      muets_poses: muetsPoses(totalPrincipal), pourcentage_muet_poses: pct(muetsPoses(totalPrincipal), totalPrincipal.poses),
      muets_visites: muetsVisites(totalPrincipal), pourcentage_muet_visites: pct(muetsVisites(totalPrincipal), totalPrincipal.visites),
      causes_poses: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, totalPrincipal.p[c]])),
      causes_visites: Object.fromEntries([...CAUSES, 'etablie'].map(c => [c, totalPrincipal.v[c]])),
    },
    comparaison: parLot.some(x => x.lot === 'V15') ? { lot: 'V15', hors_total_principal: true } : null,
    lots_parties: nLotsParties,
    lots_parties_sans_liste: nLotsPartiesSansListe,
    part_lots_parties_sans_liste: pct(nLotsPartiesSansListe, nLotsParties),
    anomalies,
  };
  fs.writeFileSync(path.join(o.sortie, 'resume.json'), JSON.stringify(resume, null, 2) + '\n');

  process.stdout.write(`lots ${nLots} ; lots-parties ${nLotsParties} (sans liste ${nLotsPartiesSansListe}) ; cuts ${detail.length} ; visités ${total.visites} ; posés ${total.poses}\n`);
  process.stdout.write(`principal : muets posés ${muetsPoses(totalPrincipal)}/${totalPrincipal.poses} (${pct(muetsPoses(totalPrincipal), totalPrincipal.poses)} %) ; ` +
    CAUSES.map(c => `${c}=${totalPrincipal.p[c]}`).join(' ') + '\n');
  for (const x of parLot) process.stdout.write(`  ${x.lot} : posés ${x.t.poses} ; muets ${muetsPoses(x.t)} (${pctTxt(muetsPoses(x.t), x.t.poses)})\n`);
}

main();
