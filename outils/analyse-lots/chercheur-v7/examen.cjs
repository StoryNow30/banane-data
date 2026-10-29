#!/usr/bin/env node
'use strict';
/*
 * examen.cjs — examen de CH-012 sur une partie entière (partie 20), protocole PROTOCOLE-EXAMEN-PARTIE20.md. Un seul script, une seule ouverture.
 *
 *   node --max-old-space-size=12000 examen.cjs --banane <dépôt banane (tronc)> --journal J.json --corpus <dossier des corpus> --echo <dossier Écho> \
 *        --lot ID --partie N --projet P --travail <dossier temporaire> --sortie <préfixe des fichiers de résultat> [--tirage T.json --role reglage]
 *
 * Mode répétition : avec --tirage et --role reglage, seuls les cuts de ce rôle sont gardés (validation du script sur le réglage de la partie 17 avant l'ouverture).
 * Sans --tirage : tous les cuts de la partie (examen).
 *
 * Étapes : (1) rejeu `base` de tools/banc-differes.cjs ; (2) jugement des poses du lot contre l'Écho (règles de tools/juger-lot.cjs, recopiées comme dans ecarts.cjs) ;
 * (3) PORTE DE FIDÉLITÉ : au moins 95 % des poses du lot rejouées à 0,8 mm ; sinon la simulation n'est pas calculée ; (4) v6 contre l'opérateur sous 3, 5 et 10 mm
 * (pire rail, 3D) ; (5) simulation du clic arrondi (même règle que simulation-arrondi.cjs) et différence appariée avec la v6 sur les mêmes rails déplacés par
 * l'opérateur, bootstrap par blocs de 20 cuts ; (6) H0, H1 et oracle par tools/gcv2-jeu.cjs construire (--juger-partie-reservee). Tous les chiffres : tous les cuts, puis
 * sans les cuts décalés de plus de 100 mm en latéral (mode de défaut « voie décalée »). Critère écrit avant : non régressif si la borne basse de la différence appariée
 * (arrondi moins v6) à 3 et à 5 mm est ≥ −3 points ; gain seulement si la borne basse est positive.
 */
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const a = {}; const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) a[argv[i].replace(/^--/, '')] = argv[i + 1];
const B = a.banane, partie = Number(a.partie), projet = Number(a.projet);
const J = require(path.join(B, 'tools/jointure-echo-orbite.cjs')), Poses = require(path.join(B, 'tools/precision-poses.cjs')), Lot = require(path.join(B, 'tools/juger-lot.cjs'));
const T = a.tirage ? require('./tirage.cjs') : null, tirage = a.tirage ? JSON.parse(fs.readFileSync(a.tirage, 'utf8')) : null;
const garder = cut => !T || T.roleDe(tirage, cut) === (a.role || 'reglage');
const fini = Number.isFinite, GRAINE = 20261029, BLOC = 20, TOL_FIDELITE_MM = 0.8, SEUIL_FIDELITE = 0.95, DECALE_LAT_MM = 100;
fs.mkdirSync(a.travail, { recursive: true });
const instant = e => { const t = Date.parse(e && e.timestamp || ''); return fini(t) ? t : null; };
const wilson = (k, n) => { if (!n) return [null, null]; const z = 1.96, p = k / n, q = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [Math.round(1000 * (c - m) / q) / 10, Math.round(1000 * (c + m) / q) / 10]; };
function alea(g) { let s = g >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/* Bootstrap par blocs de BLOC cuts : f reçoit la liste des éléments d'un échantillon de blocs et rend un nombre ; IC percentile à 95 %. */
function bootBlocs(items, f, rep = 2000) {
  const blocs = new Map(); for (const it of items) { const b = Math.floor(it.cut / BLOC); if (!blocs.has(b)) blocs.set(b, []); blocs.get(b).push(it); }
  const G = [...blocs.values()], r = alea(GRAINE), v = [];
  if (!G.length) return [null, null];
  for (let i = 0; i < rep; i++) { const s = []; for (let j = 0; j < G.length; j++) s.push(...G[Math.floor(r() * G.length)]); v.push(f(s)); }
  v.sort((x, y) => x - y); return [Math.round(1000 * v[Math.floor(0.025 * rep)]) / 10, Math.round(1000 * v[Math.floor(0.975 * rep)]) / 10];
}
const partsSeuils = (items, val) => { const o = { n: items.length }; for (const s of [3, 5, 10]) { const k = items.filter(x => val(x) <= s).length; o['sous' + s] = { k, part: items.length ? Math.round(1000 * k / items.length) / 10 : null, wilson: wilson(k, items.length), bootBlocs: bootBlocs(items, S => S.length ? S.filter(x => val(x) <= s).length / S.length : 0) }; } return o; };

/* --- (1) rejeu base --- */
const corpus = [];
(function marche(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) marche(p); else if (/ariane-gcv1-corpus-.*\.json$/.test(e.name)) corpus.push(p); } })(a.corpus);
corpus.sort();
const brutRejeu = path.join(a.travail, 'rejeu.jsonl');
const rr = cp.spawnSync(process.execPath, ['--max-old-space-size=12000', path.join(B, 'tools/banc-differes.cjs'), 'rejouer', '--partie', `${projet}:${partie}`, '--journal', a.journal, ...corpus.flatMap(c => ['--corpus', c]), '--lot', a.lot, '--sortie', brutRejeu, '--profils', 'base'], { stdio: ['ignore', 'ignore', 'ignore'], cwd: B });
const res = { format: 'ariane-chercheur-v7-examen-v1', partie, projet, role: T ? a.role : 'toutes', statutRejeu: rr.status };
if (rr.status !== 0 || !fs.existsSync(brutRejeu)) { res.erreur = 'rejeu base échoué'; fs.writeFileSync(a.sortie + '-resultats.json', JSON.stringify(res, null, 1)); console.log(JSON.stringify(res)); process.exit(1); }
const rejeu = new Map(fs.readFileSync(brutRejeu, 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => l.type === 'cut').map(l => [l.cut, l]));

/* --- (2) jugement des poses du lot (règles de juger-lot, recopiées) --- */
const journal = JSON.parse(fs.readFileSync(a.journal, 'utf8'));
const evs = journal.events.filter(e => instant(e) !== null).sort((x, y) => instant(x) - instant(y));
const departs = evs.filter(e => e.type === 'batch-started' && e.batch && e.batch.id);
const dep = departs.find(e => e.batch.id === a.lot), t0 = instant(dep); let fin = Infinity;
const suivant = departs.find(e => instant(e) > t0 && e.batch.id !== a.lot); if (suivant) fin = instant(suivant);
const arret = evs.find(e => e.type === 'batch-stopped-at-end' && instant(e) > t0);
if (arret) fin = Math.min(fin, instant(arret) + 5000); else { const rel = evs.find(e => e.type === 'relecture-debut' && e.batchId === a.lot); if (rel) fin = Math.min(fin, instant(rel)); }
const cibles = new Map();
for (const e of evs) if (e.type === 'gcv1-shadow-observed' && e.batchId === a.lot && e.identity && e.identity.part === partie && Number.isInteger(e.identity.cut)) cibles.set(e.identity.cut, e);
for (const e of evs) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === partie && instant(e) >= t0 && instant(e) <= t0 + 30000) cibles.delete(e.identity.cut);
const poses = new Set();
for (const e of evs) {
  if (e.type !== 'esv-observation' || e.kind !== 'write') continue;
  const t = instant(e); if (t < t0 || t >= fin) continue;
  if (Number.isInteger(e.status) && e.status >= 200 && e.status < 300 && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && cibles.has(e.rowIndex)) poses.add(e.rowIndex);
}
const echo = Poses.lireEcho(Lot.dossiersEcho([a.echo]));
const { table } = J.joindre(echo.records, journal, { partie, base: 'auto', poses: false, visiteSansActionBonne: true, sessions: echo.sessions || [], pagesPerdues: echo.pagesPerdues || [], capturesParVisite: echo.capturesParVisite || {}, evenementsEcho: echo.evenements || [] });
const ligne = new Map(table.filter(l => l.partie === partie).map(l => [l.cut, l]));
const arr = v => fini(v) ? Math.round(v * 100) / 100 : null, rail = r => r && r.repere === 'profil' ? { lat: arr(r.lateralMm), vert: arr(r.verticalMm), d3: arr(r.dist3dMm) } : null;
const px = new Map();
for (const e of journal.events) if (e.type === 'applied-verified' && e.identity && e.observed && e.observed.vueFin && e.observed.vueFin.pixelMm > 0) px.set(e.identity.cut, e.observed.vueFin.pixelMm);
const cuts = [];
const compte = { cibles: cibles.size, posesLot: poses.size, gardes: 0, etats: {} };
for (const cut of poses) {
  if (!garder(cut)) continue; compte.gardes++;
  const l = ligne.get(cut); let c = { cut, etat: null };
  if (!l || !l.dansEcho) c.etat = 'sans-echo';
  else if (l.referenceHumaine !== 'observee') c.etat = 'non-juge';
  else if (l.regleVisiteBon) { c.etat = 'controle'; c.max3d = 0; c.gauche = { lat: 0, vert: 0, d3: 0 }; c.droite = { lat: 0, vert: 0, d3: 0 }; }
  else if (typeof l.base !== 'string' || !l.base.startsWith('ariane')) c.etat = 'repere';
  else if (fini(l.ecartHumain && l.ecartHumain.maxDist3dMm)) { c.etat = 'corrige'; c.max3d = arr(l.ecartHumain.maxDist3dMm); c.gauche = rail(l.ecartHumain.gauche); c.droite = rail(l.ecartHumain.droite); }
  else c.etat = 'non-juge';
  compte.etats[c.etat] = (compte.etats[c.etat] || 0) + 1; cuts.push(c);
}
res.compte = compte;

/* --- (3) porte de fidélité --- */
const d3 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
let comp = 0, tient = 0;
for (const c of cuts) {
  const rj = rejeu.get(c.cut); if (!rj || !rj.reel.pose || !rj.profils.base || rj.profils.base.etat !== 'pose' || !rj.profils.base.decal || !rj.reel.decal) continue;
  comp++; if (Math.max(d3(rj.reel.decal.left, rj.profils.base.decal.left), d3(rj.reel.decal.right, rj.profils.base.decal.right)) <= TOL_FIDELITE_MM) tient++;
}
res.fidelite = { comparables: comp, a08mm: tient, part: comp ? Math.round(1000 * tient / comp) / 10 : null, wilson: wilson(tient, comp), seuil: SEUIL_FIDELITE * 100, porte: comp > 0 && tient / comp >= SEUIL_FIDELITE };

/* --- (4) v6 contre l'opérateur --- */
const jug = cuts.filter(c => c.etat === 'corrige' || c.etat === 'controle');
const decale = c => Math.max(Math.abs(c.gauche ? c.gauche.lat : 0), Math.abs(c.droite ? c.droite.lat : 0)) > DECALE_LAT_MM;
res.decales = { cutsJuges: jug.filter(decale).length };
res.v6 = { tous: partsSeuils(jug, c => c.max3d), sansDecales: partsSeuils(jug.filter(c => !decale(c)), c => c.max3d), corrigesSeuls: partsSeuils(jug.filter(c => c.etat === 'corrige'), c => c.max3d), corrigesSeulsSansDecales: partsSeuils(jug.filter(c => c.etat === 'corrige' && !decale(c)), c => c.max3d) };

/* --- (5) simulation du clic arrondi, différence appariée --- */
if (res.fidelite.porte) {
  const lignes = [];
  for (const c of jug) {
    if (c.etat !== 'corrige' || !px.has(c.cut) || !rejeu.has(c.cut)) continue;
    const rj = rejeu.get(c.cut); if (!rj.reel.pose || !rj.profils.base.decal || !rj.reel.decal) continue;
    const p = px.get(c.cut);
    for (const [cote, s] of [['gauche', 'left'], ['droite', 'right']]) {
      const e = c[cote]; if (!e || !(e.d3 > 0)) continue;
      const r = [1, 2].map(i => rj.profils.base.decal[s][i] - rj.reel.decal[s][i]), dp = r.map(x => (x <= -p / 2 ? -p : 0));
      const avant = Math.hypot(e.lat, e.vert), apres = Math.hypot(e.lat - dp[0], e.vert - dp[1]);
      lignes.push({ cut: c.cut, cote, avant, apres, decale: decale(c) });
    }
  }
  const diff = (items, s) => { const f = S => S.length ? (S.filter(x => x.apres <= s).length - S.filter(x => x.avant <= s).length) / S.length : 0; const d = f(items); return { n: items.length, avant: items.filter(x => x.avant <= s).length, apres: items.filter(x => x.apres <= s).length, hausses: items.filter(x => x.avant > s && x.apres <= s).length, baisses: items.filter(x => x.avant <= s && x.apres > s).length, diffPoints: Math.round(1000 * d) / 10, bootBlocs: bootBlocs(items, S => f(S)) }; };
  const med = (v) => { v = v.slice().sort((x, y) => x - y); return v.length ? Math.round(v[v.length >> 1] * 100) / 100 : null; };
  const pack = items => ({ rails: items.length, medianeAvant: med(items.map(x => x.avant)), medianeApres: med(items.map(x => x.apres)), sous3: diff(items, 3), sous5: diff(items, 5) });
  res.simulationArrondi = { tous: pack(lignes), sansDecales: pack(lignes.filter(x => !x.decale)) };
  const verdict = o => { const b3 = o.sous3.bootBlocs[0], b5 = o.sous5.bootBlocs[0]; return { nonRegressif: b3 !== null && b3 >= -3 && b5 >= -3, gain3: b3 > 0, gain5: b5 > 0 }; };
  res.simulationArrondi.verdict = { tous: verdict(res.simulationArrondi.tous), sansDecales: verdict(res.simulationArrondi.sansDecales) };
} else res.simulationArrondi = { non_publiee: 'porte de fidélité non tenue' };

/* --- (6) H0, H1, oracle --- */
const dossiersEcho = [];
(function marche(d) { const es = fs.readdirSync(d, { withFileTypes: true }); if (es.some(e => e.isFile() && /^ariane-echo-.*\.json$/.test(e.name))) dossiersEcho.push(d); for (const e of es) if (e.isDirectory()) marche(path.join(d, e.name)); })(a.echo);
const brutJeu = path.join(a.travail, 'jeu.jsonl');
const jj = cp.spawnSync(process.execPath, ['--max-old-space-size=12000', path.join(B, 'tools/gcv2-jeu.cjs'), 'construire', '--partie', `${projet}:${partie}`, '--journal', a.journal, ...dossiersEcho.flatMap(d => ['--echo', d]), '--sortie', brutJeu, ...(T ? [] : ['--juger-partie-reservee'])], { stdio: ['ignore', 'ignore', 'ignore'], cwd: B });
res.statutJeu = jj.status;
if (jj.status === 0 && fs.existsSync(brutJeu)) {
  const L = fs.readFileSync(brutJeu, 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(l => garder(l.cut));
  const cu = new Map(L.filter(l => l.type === 'cut').map(l => [l.cut, l])), par = new Map();
  for (const h of L.filter(l => l.type === 'hyp')) {
    const c = cu.get(h.cut); if (!c || c.etat !== 'calcule') continue;
    const e = h.etiquette && h.etiquette.ecartMm; if (!fini(e)) continue;
    const k = h.cut + '|' + h.rail; if (!par.has(k)) par.set(k, { cut: h.cut, ref: c.reference, h0: null, h1: null, min: Infinity });
    const r = par.get(k); r.min = Math.min(r.min, e); if (h.origine === 'H0') r.h0 = e; if (h.origine === 'H1') r.h1 = r.h1 === null ? e : Math.min(r.h1, e);
  }
  const decalesCuts = new Set(jug.filter(decale).map(c => c.cut));
  const R = [...par.values()].filter(r => r.ref === 'validation' && r.h0 !== null && r.h1 !== null);
  const h = items => ({ rails: items.length, cuts: new Set(items.map(r => r.cut)).size, H0: partsSeuils(items, r => r.h0), H1: partsSeuils(items, r => r.h1), oracle: partsSeuils(items, r => r.min) });
  res.hypotheses = { tous: h(R), sansDecales: h(R.filter(r => !decalesCuts.has(r.cut))), cutsVisites: cu.size };
  try { fs.unlinkSync(brutJeu); } catch { /* absent */ }
}
try { fs.unlinkSync(brutRejeu); } catch { /* absent */ }
fs.writeFileSync(a.sortie + '-resultats.json', JSON.stringify(res, null, 1));
fs.writeFileSync(a.sortie + '-par-cut.json', JSON.stringify({ format: 'ariane-chercheur-v7-examen-par-cut-v1', partie, cuts }, null, 1));
console.log(JSON.stringify({ role: res.role, compte: res.compte, fidelite: res.fidelite, v6tous: res.v6.tous.sous3 && { n: res.v6.tous.n, sous3: res.v6.tous.sous3.part, sous5: res.v6.tous.sous5.part }, hypRails: res.hypotheses && res.hypotheses.tous.rails }));
