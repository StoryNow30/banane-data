/* CH-015 tâche 6 (b) : effet d'orphelin de la règle R3. R3 = « un des 2 cuts précédents (n-1, n-2) est un différé du lot ET moins de 2 appuis (lotObservation.anchorsUsed.length ; à défaut 0) ».
 * Si R3 diffère un cut X, ses suivants (X+1 à X+3) perdent un appui : on compte combien deviennent des racines (0 appui), le taux de poses fausses d'aujourd'hui (> 50 mm, jugés) de ces suivants
 * comparé à celui des racines actuelles, puis une simulation avec cascade (un cut différé par R3 compte comme différé pour les suivants et n'est plus un appui).
 * node orphelins-r3.cjs <outils-banane> <dossier-lot> <partie> <cuts-detail.json> <sortie.json>   (lecture seule, hypothèse : un appui retiré n'est pas remplacé par un cut plus ancien) */
const fs = require('node:fs'), path = require('node:path');
const [outils, lotDir, partieS, cutsFic, sortie] = process.argv.slice(2); const partie = Number(partieS);
const Poses = require(path.join(outils, 'precision-poses.cjs')); const j = Poses.lireJournalDir(lotDir); const cuts = JSON.parse(fs.readFileSync(cutsFic)); const par = new Map(cuts.map(c => [c.cut, c]));
const sh = new Map(); for (const e of j.events) if (e.type === 'gcv1-shadow-observed' && e.identity && e.identity.part === partie) sh.set(e.identity.cut, e.lotObservation || {});
const ancres = c => { const L = sh.get(c) || {}; return Array.isArray(L.anchorsUsed) ? L.anchorsUsed : (L.l1 && L.l1.chaine && Number.isFinite(L.l1.chaine.appuis) ? Array(L.l1.chaine.appuis).fill(null) : []); };
const chemin = c => { const L = sh.get(c); return L && L.command ? L.command.action + ':' + L.command.reason : 'inconnu'; };
const jug = c => c.pose && (c.etat === 'corrige' || c.etat === 'controle'), f50 = c => jug(c) && c.mm > 50;
const wilson = (k, n) => { if (!n) return null; const z = 1.96, p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [+((c - m) / d).toFixed(3), +((c + m) / d).toFixed(3)]; };
const stat = pop => { const J = pop.filter(jug), k = J.filter(f50).length; return { posés: pop.length, jugés: J.length, plus50: k, taux: J.length ? +(k / J.length).toFixed(3) : null, ic95: wilson(k, J.length) }; };
const diff0 = new Set(cuts.filter(c => !c.pose).map(c => c.cut)), posesC = cuts.filter(c => c.pose);
/* (1) sans cascade : X = posés signalés par R3 d'après les différés actuels */
const R3 = c => (diff0.has(c - 1) || diff0.has(c - 2)) && ancres(c).length < 2; const X = new Set(posesC.filter(c => R3(c.cut)).map(c => c.cut));
const suivants = posesC.filter(c => !X.has(c.cut) && [1, 2, 3].some(k => X.has(c.cut - k)));
const orph = suivants.map(c => { const a = ancres(c.cut), reste = a.filter(x => x === null || !X.has(x)); return { c, avant: a.length, apres: reste.length }; });
const devenusRacines = orph.filter(o => o.apres === 0 && o.avant > 0), perdentUnAppui = orph.filter(o => o.apres < o.avant);
const racinesActuelles = posesC.filter(c => ancres(c.cut).length === 0 && sh.get(c.cut) && Array.isArray((sh.get(c.cut) || {}).anchorsUsed));
const sans = { signalesR3: stat(posesC.filter(c => X.has(c.cut))), suivants1a3: stat(suivants.map(o => o)), suivantsPerdentUnAppui: stat(perdentUnAppui.map(o => o.c)), suivantsDevenusRacines: stat(devenusRacines.map(o => o.c)),
  racinesActuelles: stat(racinesActuelles), dontRacinesDejaSignaleesR3: racinesActuelles.filter(c => X.has(c.cut)).length };
/* (2) avec cascade, dans l'ordre des numéros ; un cut posé est différé si R3 sur l'état simulé */
const def = new Set(diff0), ajoutes = [];
for (const c of posesC.map(x => x.cut).sort((a, b) => a - b)) { const a = ancres(c).filter(x => x === null || !def.has(x)); if ((def.has(c - 1) || def.has(c - 2)) && a.length < 2) { def.add(c); ajoutes.push(c); } }
const cas = ajoutes.map(c => par.get(c)); const cascade = { difleresAjoutes: ajoutes.length, partDesPoses: +(ajoutes.length / posesC.length).toFixed(3), differesTotal: def.size, partDesCibles: +(def.size / cuts.length).toFixed(3),
  ajoutesJuges: cas.filter(jug).length, fauxPlus50Evites: cas.filter(f50).length, fauxPlus50Restants: posesC.filter(f50).length - cas.filter(f50).length, ajoutesParRapportAuSansCascade: ajoutes.length - X.size };
/* définitions : chemins des cuts signalés */
const parChemin = {}; for (const c of X) { const k = chemin(c); parChemin[k] = (parChemin[k] || 0) + 1; }
/* (c) dénominateur D-223 */
const J = posesC.filter(jug), non = posesC.filter(c => !jug(c)); const adj = c => diff0.has(c - 1) || diff0.has(c + 1), Jna = J.filter(c => !adj(c.cut));
const d223 = { posés: posesC.length, jugés: J.length, plus50Juges: J.filter(f50).length, tauxJuges: stat(J).taux, ic95Juges: stat(J).ic95, planchersurTousLesPoses: +(J.filter(f50).length / posesC.length).toFixed(4), nonJuges: non.length,
  jugesNonVoisinsDeDiffere: stat(Jna), nonJugesAttendusSiMemeTauxQueNonVoisins: Math.round(non.length * (stat(Jna).taux || 0)), nonJugesVoisinsDeDiffere: non.filter(c => adj(c.cut)).length };
const out = { partie, definitions: { appuis: 'lotObservation.anchorsUsed.length (à défaut l1.chaine.appuis ; sinon 0)', precedentDiffere: 'cut-1 ou cut-2 numériques parmi les cibles du lot sans écriture de validation à la fin du lot (+5 s), écritures de la passe après l\'arrêt comprises', moteurSeulDansR3: true }, cheminDesSignalesR3: parChemin, sansCascade: sans, avecCascade: cascade, d223 };
fs.writeFileSync(sortie, JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
