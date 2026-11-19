#!/usr/bin/env node
'use strict';
/* CH-139 (lot A1 d'Ariane 6) : la mesure « la deuxième passe ne pose plus sur branche », sur le corpus de CH-116.
 * Lit les rejeux du banc de CH-116 (tools/banc-differes.cjs, profil L1-se) et le corpus jugé (corpus.jsonl) ;
 * rend le tableau standard par lot, le tableau des poses de la deuxième passe PAR MOTIF, et le différentiel
 * avant/après (différés, poses justes perdues, erreurs évitées), ventilé par lot-partie et par lot.
 * Juge unique, celui de CH-116/CH-113 : écart = pire des deux rails, distance 3D, contre la pose finale de
 * l'opérateur ; juste ≤ 10 mm ; mauvaise voie > 50 mm ; cuts écartés par D-285 (`exclu`) non jugés.
 * Aucune donnée de terrain n'est écrite ici que des numéros de cut et des millimètres (dossier banane-data).
 *
 *   node mesure.cjs --travail T [--corpus C.jsonl] [--sortie DOSSIER]
 *       [--noms ch139-livre-zjp,ch139-N-zjp,ch139-sans-branche] [--avant ch139-N-zjp] [--apres ch139-sans-branche]
 * Sorties : <nom>-tableau.md (standard), motifs-<nom>.md (passe par motif), differentiel.md, differentiel.csv, resume.json.
 */
const fs = require('node:fs'), path = require('node:path');
const SIDES = ['left', 'right'];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pire = (p, q) => Math.max(dist(p.left, q.left), dist(p.right, q.right));
const classe = e => e <= 10 ? 'juste' : e <= 50 ? '10-50' : 'plus-50';
const arr1 = v => Math.round(v * 10) / 10;
const med = a => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const lireJsonl = f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(s => JSON.parse(s));

function args(a) {
  const o = { noms: ['ch139-livre-zjp', 'ch139-N-zjp', 'ch139-sans-branche'], avant: 'ch139-N-zjp', apres: 'ch139-sans-branche' };
  for (let i = 0; i < a.length; i++) {
    const k = a[i], v = () => a[++i];
    if (k === '--travail') o.travail = v(); else if (k === '--corpus') o.corpus = v(); else if (k === '--sortie') o.sortie = v();
    else if (k === '--noms') o.noms = v().split(','); else if (k === '--avant') o.avant = v(); else if (k === '--apres') o.apres = v();
    else throw Error('option inconnue ' + k);
  }
  o.travail = o.travail || process.env.CH116_TRAVAIL;
  if (!o.travail) throw Error('--travail (ou CH116_TRAVAIL) requis');
  o.corpus = o.corpus || path.join(o.travail, 'corpus.jsonl');
  o.sortie = o.sortie || path.join(__dirname, 'sorties');
  return o;
}

/* ------------------------------------------------------------------ chargement */
function chargerCorpus(f) {
  const m = new Map();
  for (const l of lireJsonl(f)) m.set(`${l.lot}-p${l.partie}-r${l.rang}:${l.cut}`, l);
  return m;
}
/* Un rejeu : Map « cle:cut » → { cle, lot, partie, cut, x (profil L1-se), c (corpus, ou null) }. */
function chargerRejeu(nom, travail, C) {
  const dir = path.join(travail, 'rejeux', nom), out = new Map();
  if (!fs.existsSync(dir)) throw Error(`rejeu « ${nom} » absent (${dir})`);
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort()) {
    const cle = f.slice(0, -6), m = /^(\d+[ab]?)-p(\d+)-r(\d+)$/.exec(cle);
    if (!m) throw Error(`clé de lot inattendue : ${cle}`);
    const [, lot, partie, rang] = m;
    for (const l of lireJsonl(path.join(dir, f)).filter(x => x.type === 'cut')) {
      const c = C.get(`${cle}:${l.cut}`) || null;
      out.set(`${cle}:${l.cut}`, { cle, lot, partie: Number(partie), rang: Number(rang), cut: l.cut, x: (l.profils || {})['L1-se'] || {}, c });
    }
  }
  return out;
}
const poseDe = r => r.x && r.x.etat === 'pose' && r.x.decal ? r.x.decal : null;
const jugeable = r => !!(r.c && r.c.poseFinale && !r.c.exclu);
function mmDe(r) { const p = poseDe(r); return p && jugeable(r) ? arr1(pire(p, r.c.poseFinale)) : null; }

/* ------------------------------------------------------------------ tableau standard (celui de banc.cjs juger) */
const vide = () => ({ cuts: 0, poses: 0, posesJuges: 0, juste: 0, '10-50': 0, 'plus-50': 0, differes: 0, differesJuges: 0, reposesJustes: 0, reposesFaux: 0, bonsBloques: 0, liste50: [], listeReposesFaux: [], listeBloques: [] });
function standard(R) {
  const parLot = {}, total = vide();
  for (const r of R.values()) {
    const T = (parLot[r.lot] = parLot[r.lot] || vide()), pose = poseDe(r), mm = mmDe(r);
    for (const t of [T, total]) t.cuts++;
    if (pose) {
      for (const t of [T, total]) t.poses++;
      if (mm != null) {
        const cl = classe(mm);
        for (const t of [T, total]) {
          t.posesJuges++; t[cl]++;
          if (cl === 'plus-50') t.liste50.push(`${r.partie}/${r.cut}`);
          if (r.c.sortLot === 'differe') { if (cl === 'juste') t.reposesJustes++; else { t.reposesFaux++; t.listeReposesFaux.push(`${r.partie}/${r.cut}`); } }
        }
      }
    } else {
      for (const t of [T, total]) { t.differes++; if (jugeable(r)) t.differesJuges++; }
      if (jugeable(r) && r.c.sortLot === 'pose' && r.c.classe === 'juste') for (const t of [T, total]) { t.bonsBloques++; t.listeBloques.push(`${r.partie}/${r.cut}`); }
    }
  }
  return { parLot, total };
}
const ENTETE = '| lot | cuts | posés | jugés | ≤ 10 | 10–50 | > 50 | différés (jugés) | reposés justes / faux | bons bloqués |\n|---|---|---|---|---|---|---|---|---|---|';
const ligne = (n, t) => `| ${n} | ${t.cuts} | ${t.poses} | ${t.posesJuges} | ${t.juste} | ${t['10-50']} | ${t['plus-50']} | ${t.differes} (${t.differesJuges}) | ${t.reposesJustes} / ${t.reposesFaux} | ${t.bonsBloques} |`;
function tableauStd(J) {
  const out = [ENTETE, ...Object.entries(J.parLot).map(([k, t]) => ligne(k, t)), ligne('**total**', J.total)];
  if (J.total.liste50.length) out.push('', `> 50 mm : ${J.total.liste50.join(' ')}`);
  if (J.total.listeReposesFaux.length) out.push(`reposés faux : ${J.total.listeReposesFaux.join(' ')}`);
  if (J.total.listeBloques.length) out.push(`bons bloqués : ${J.total.listeBloques.join(' ')}`);
  return out.join('\n');
}

/* ------------------------------------------------------------------ poses de la deuxième passe, par motif */
/* Pose ÉCRITE de la passe : état `pose`, `passe2` présent, pas `nonEcrite` (plafond ou refus-vue). Motif : `l1.motif`
 * (resumer de la décision). Les refus d'ancre de la passe perdent `l1` dans la ligne du banc : motif inconnu, comptés à part. */
function motifsPasse(R) {
  const parMotif = new Map(), autres = new Map();
  const noter = (map, k, r, mm) => { const t = map.get(k) || { n: 0, juges: 0, justes: 0, fausses: 0, plus50: 0, ecarts: [], cuts: [] }; t.n++; t.cuts.push(`${r.partie}/${r.cut}${mm != null ? ' ' + mm + ' mm' : ''}`); if (mm != null) { t.juges++; t.ecarts.push(mm); if (mm <= 10) t.justes++; else { t.fausses++; if (mm > 50) t.plus50++; } } map.set(k, t); };
  for (const r of R.values()) {
    const x = r.x; if (!x.passe2) continue;
    const mm = mmDe(r);
    if (x.etat === 'pose' && !x.passe2.nonEcrite) noter(parMotif, (x.l1 && x.l1.motif) || 'sans motif (test 13)', r, mm);
    else if (x.passe2.nonPosee === 'sans-branche') noter(autres, 'non posée : sans-branche (variante CH-139)', r, null);
    else if (x.passe2.nonEcrite) noter(autres, `non écrite : ${x.passe2.nonEcrite}`, r, null);
    else if (x.source === 'ancre') noter(autres, 'refus ancre (motif non consigné)', r, null);
    else if (x.passe2.motif === 'garde-appuis') noter(autres, 'garde des appuis', r, null);
    else if (x.passe2.motif === 'recherche-large') noter(autres, 'recherche large', r, null);
    else noter(autres, `décision « rien » : ${x.passe2.motif ?? '?'}`, r, null);
  }
  return { parMotif, autres };
}
function tableauMotifs(M, titre) {
  const out = [titre, '', '| motif | poses | jugées | justes ≤ 10 | fausses > 10 | dont > 50 | écart médian | écart max |', '|---|---|---|---|---|---|---|---|'];
  const ligneM = (k, t) => `| ${k} | ${t.n} | ${t.juges} | ${t.justes} | ${t.fausses} | ${t.plus50} | ${t.ecarts.length ? arr1(med(t.ecarts)) + ' mm' : '—'} | ${t.ecarts.length ? arr1(Math.max(...t.ecarts)) + ' mm' : '—'} |`;
  const tot = { n: 0, juges: 0, justes: 0, fausses: 0, plus50: 0, ecarts: [] };
  for (const [k, t] of [...M.parMotif.entries()].sort((a, b) => b[1].n - a[1].n)) { out.push(ligneM(k, t)); tot.n += t.n; tot.juges += t.juges; tot.justes += t.justes; tot.fausses += t.fausses; tot.plus50 += t.plus50; tot.ecarts.push(...t.ecarts); }
  out.push(ligneM('**total**', tot), '', 'Décisions de la passe qui ne posent pas (comptées à part) :', '', '| catégorie | n |', '|---|---|');
  for (const [k, t] of [...M.autres.entries()].sort((a, b) => b[1].n - a[1].n)) out.push(`| ${k} | ${t.n} |`);
  out.push('', 'Détail des poses par motif :');
  for (const [k, t] of M.parMotif.entries()) out.push(`- ${k} : ${t.cuts.join(' ; ')}`);
  for (const [k, t] of M.autres.entries()) if (!/^décision « rien »/.test(k)) out.push(`- ${k} : ${t.cuts.join(' ; ')}`);
  return out.join('\n');
}

/* ------------------------------------------------------------------ différentiel avant/après */
function differentiel(A, B) {
  const parCle = new Map(), cats = { justesPerdues: [], justesDegradees: [], erreursEvitees: [], faussesCorrigees: [], nouvellesJustes: [], nouvellesFausses: [], nouvellesNonJugees: [], deplacees: [], autres: [] };
  const vider = () => ({ cuts: 0, diffA: 0, diffB: 0, justesA: 0, justesB: 0, faussesA: 0, faussesB: 0, plus50A: 0, plus50B: 0, justesPerdues: 0, justesDegradees: 0, erreursEvitees: 0, faussesCorrigees: 0, nouvellesJustes: 0, nouvellesFausses: 0, deplacees: 0 });
  const total = vider(), parLot = new Map(), parPartie = new Map();
  const compte = (t, r, mA, mB, cat) => {
    t.cuts++; const pA = poseDe(r), pB = poseDe(B.get(`${r.cle}:${r.cut}`));
    if (!pA) t.diffA++; if (!pB) t.diffB++;
    if (mA != null) { if (mA <= 10) t.justesA++; else { t.faussesA++; if (mA > 50) t.plus50A++; } }
    if (mB != null) { if (mB <= 10) t.justesB++; else { t.faussesB++; if (mB > 50) t.plus50B++; } }
    if (cat && t[cat] != null) t[cat]++;
  };
  for (const [k, r] of A.entries()) {
    const q = B.get(k); if (!q) throw Error(`cut ${k} absent du rejeu après`);
    const pA = poseDe(r), pB = poseDe(q), mA = mmDe(r), mB = mmDe(q);
    let cat = null;
    if (pA && !pB) cat = mA != null && mA <= 10 ? 'justesPerdues' : mA != null ? 'erreursEvitees' : 'autres';
    else if (!pA && pB) cat = mB == null ? 'nouvellesNonJugees' : mB <= 10 ? 'nouvellesJustes' : 'nouvellesFausses';
    else if (pA && pB) {
      if (mA != null && mB != null) {
        if (mA <= 10 && mB > 10) cat = 'justesDegradees';
        else if (mA > 10 && mB <= 10) cat = 'faussesCorrigees';
        else if (Math.abs(mA - mB) > 1) cat = 'deplacees';
      } else if (pire(pA, pB) > 1) cat = 'deplacees';
    }
    if (cat) cats[cat].push({ cle: r.cle, lot: r.lot, partie: r.partie, cut: r.cut, mA, mB });
    const e = { cle: r.cle, lot: r.lot, partie: r.partie, cut: r.cut, etatA: pA ? 'pose' : 'differe', mmA: mA, etatB: pB ? 'pose' : 'differe', mmB: mB, cat: cat || '' };
    parCle.set(k, e);
    const tl = parLot.get(r.lot) || (parLot.set(r.lot, vider()), parLot.get(r.lot));
    const tp = parPartie.get(r.cle) || (parPartie.set(r.cle, vider()), parPartie.get(r.cle));
    for (const t of [total, tl, tp]) compte(t, r, mA, mB, cat === 'justesPerdues' || cat === 'justesDegradees' || cat === 'erreursEvitees' || cat === 'faussesCorrigees' || cat === 'nouvellesJustes' || cat === 'nouvellesFausses' || cat === 'deplacees' ? cat : null);
  }
  /* Cuts directement supprimés par la variante (passe2.nonPosee = sans-branche), et leur sort avant. */
  const supprimes = [];
  for (const [k, q] of B.entries()) if (q.x.passe2 && q.x.passe2.nonPosee === 'sans-branche') { const r = A.get(k); supprimes.push({ cle: q.cle, lot: q.lot, partie: q.partie, cut: q.cut, avant: poseDe(r) ? `pose ${mmDe(r) != null ? mmDe(r) + ' mm' : '(non jugée)'}` : 'differe', apres: poseDe(q) ? `pose ${mmDe(q) != null ? mmDe(q) + ' mm' : '(non jugée)'}` : 'differe' }); }
  return { total, parLot, parPartie, cats, parCle, supprimes };
}
const ENTETE_D = '| lot-partie | cuts | différés A → B | justes A → B | fausses A → B | justes perdues | justes dégradées | erreurs évitées | fausses → justes | nouvelles justes | nouvelles fausses | poses déplacées |';
function ligneD(n, t) { return `| ${n} | ${t.cuts} | ${t.diffA} → ${t.diffB} | ${t.justesA} → ${t.justesB} | ${t.faussesA} → ${t.faussesB} | ${t.justesPerdues} | ${t.justesDegradees} | ${t.erreursEvitees} | ${t.faussesCorrigees} | ${t.nouvellesJustes} | ${t.nouvellesFausses} | ${t.deplacees} |`; }
function tableauDiff(D, avant, apres) {
  const out = [`Différentiel « ${avant} » (A) → « ${apres} » (B), même corpus, même banc.`, '',
    'Juste ≤ 10 mm ; fausse > 10 mm ; « justes perdues » = pose juste en A, différée en B ; « erreurs évitées » = pose fausse en A, différée en B ; « déplacées » = pose des deux côtés, écart à la vérité changé de plus de 1 mm (ricochets compris).', '',
    ENTETE_D, '|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const [k, t] of [...D.parPartie.entries()].sort()) out.push(ligneD(k, t));
  out.push(ligneD('**total**', D.total), '', 'Par lot :', '', ENTETE_D.replace('lot-partie', 'lot'), '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const [k, t] of [...D.parLot.entries()].sort()) out.push(ligneD(k, t));
  const nom = { justesPerdues: 'Justes perdues (pose juste → différé)', justesDegradees: 'Justes dégradées (pose juste → pose > 10 mm)', erreursEvitees: 'Erreurs évitées (pose fausse → différé)', faussesCorrigees: 'Fausses → justes', nouvellesJustes: 'Nouvelles poses justes (différé → pose ≤ 10 mm)', nouvellesFausses: 'Nouvelles poses fausses (différé → pose > 10 mm)', nouvellesNonJugees: 'Nouvelles poses non jugées', deplacees: 'Poses déplacées (> 1 mm)', autres: 'Autres changements' };
  for (const [k, l] of Object.entries(D.cats)) {
    out.push('', `${nom[k]} : ${l.length}`);
    for (const c of l.sort((a, b) => a.partie - b.partie || a.cut - b.cut)) out.push(`  ${c.lot} p${c.partie}/${c.cut} : ${c.mA != null ? c.mA + ' mm' : 'pose/différé'} → ${c.mB != null ? c.mB + ' mm' : 'pose/différé'}`);
  }
  out.push('', `Cuts où la variante supprime directement une pose « branche » de la passe : ${D.supprimes.length}`);
  for (const s of D.supprimes.sort((a, b) => a.partie - b.partie || a.cut - b.cut)) out.push(`  ${s.lot} p${s.partie}/${s.cut} : avant ${s.avant} ; après ${s.apres}`);
  return out.join('\n');
}

/* ------------------------------------------------------------------ main */
function main() {
  const o = args(process.argv.slice(2));
  fs.mkdirSync(o.sortie, { recursive: true });
  const C = chargerCorpus(o.corpus), R = {}, J = {}, resume = { corpus: o.corpus, cuts: C.size, runs: {} };
  for (const nom of o.noms) {
    R[nom] = chargerRejeu(nom, o.travail, C); J[nom] = standard(R[nom]);
    fs.writeFileSync(path.join(o.sortie, nom + '-tableau.md'), `Rejeu « ${nom} » contre le corpus (${o.corpus}) :\n\n${tableauStd(J[nom])}\n`);
    const M = motifsPasse(R[nom]);
    fs.writeFileSync(path.join(o.sortie, 'motifs-' + nom + '.md'), tableauMotifs(M, `Poses de la deuxième passe PAR MOTIF, rejeu « ${nom} » (poses écrites, plafond 10 compris) :`) + '\n');
    resume.runs[nom] = { cuts: R[nom].size, standard: J[nom].total, motifs: Object.fromEntries([...M.parMotif.entries()].map(([k, t]) => [k, { n: t.n, juges: t.juges, justes: t.justes, fausses: t.fausses, plus50: t.plus50, median: t.ecarts.length ? arr1(med(t.ecarts)) : null, max: t.ecarts.length ? arr1(Math.max(...t.ecarts)) : null }])) };
    process.stdout.write(`« ${nom} » : ${R[nom].size} cuts ; différés ${J[nom].total.differes} ; justes ${J[nom].total.juste} ; > 50 mm ${J[nom].total['plus-50']} ; poses de la passe ${[...M.parMotif.values()].reduce((s, t) => s + t.n, 0)}\n`);
  }
  if (R[o.avant] && R[o.apres]) {
    const D = differentiel(R[o.avant], R[o.apres]);
    fs.writeFileSync(path.join(o.sortie, 'differentiel.md'), tableauDiff(D, o.avant, o.apres) + '\n');
    fs.writeFileSync(path.join(o.sortie, 'differentiel.csv'), ['cle;cut;etatA;mmA;etatB;mmB;categorie', ...[...D.parCle.values()].map(e => [e.cle, e.cut, e.etatA, e.mmA ?? '', e.etatB, e.mmB ?? '', e.cat].join(';'))].join('\n') + '\n');
    resume.differentiel = { avant: o.avant, apres: o.apres, total: D.total, parLot: Object.fromEntries(D.parLot), parPartie: Object.fromEntries(D.parPartie), supprimes: D.supprimes.length };
    process.stdout.write(`différentiel : différés ${D.total.diffA} → ${D.total.diffB} ; justes ${D.total.justesA} → ${D.total.justesB} ; justes perdues ${D.total.justesPerdues} ; erreurs évitées ${D.total.erreursEvitees} ; suppressions directes ${D.supprimes.length}\n`);
  }
  fs.writeFileSync(path.join(o.sortie, 'resume.json'), JSON.stringify(resume, null, 1));
  process.stdout.write(`sorties : ${o.sortie}\n`);
}
main();
