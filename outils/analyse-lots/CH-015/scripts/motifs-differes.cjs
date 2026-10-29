/* CH-015 : motifs des différés, par partie, pour un ou plusieurs dossiers d'export (journal lu dans les zips).
 * Usage : node motifs-differes.cjs <outils-banane> <dossier-export>... ; sort une ligne JSON par partie du dernier lot.
 * Un différé = cible du lot sans écriture de validation ; motif = motif GCV1 du rail (écartement hors contrat prioritaire). */
const path = require('node:path');
const [outils, ...dossiers] = process.argv.slice(2);
const Poses = require(path.join(outils, 'precision-poses.cjs'));
const t = e => Date.parse(e.timestamp || '');
for (const d of dossiers) {
  const j = Poses.lireJournalDir(d);
  const ev = j.events.filter(e => Number.isFinite(t(e))).sort((a, b) => t(a) - t(b));
  const parties = [...new Set(ev.filter(e => e.type === 'batch-started' && e.identity && Number.isInteger(e.identity.part)).map(e => e.identity.part))].sort((a, b) => a - b);
  for (const p of parties) {
    const dep = ev.filter(e => e.type === 'batch-started' && e.batch && e.identity && e.identity.part === p).pop(); if (!dep) continue;
    const B = dep.batch.id, t0 = t(dep);
    const arret = ev.find(e => e.type === 'batch-stopped-at-end' && t(e) > t0);
    const fin = arret ? t(arret) + 5000 : Infinity;
    const cibles = new Set();
    for (const e of ev) if (e.type === 'gcv1-shadow-observed' && e.batchId === B && e.identity.part === p) cibles.add(e.identity.cut);
    for (const e of ev) if (e.type === 'capture-abandoned' && e.reason === 'depart-sur-vert' && e.identity && e.identity.part === p && t(e) >= t0 && t(e) <= t0 + 30000) cibles.delete(e.identity.cut);
    const poses = new Set();
    for (const e of ev) if (e.type === 'esv-observation' && e.kind === 'write' && t(e) >= t0 && t(e) < fin && e.status >= 200 && e.status < 300 && e.body && e.body.ExtractionStatus === 'valid' && e.body.TreatedByOperator === true && cibles.has(e.rowIndex)) poses.add(e.rowIndex);
    const df = new Map(); for (const e of ev) if (e.type === 'defer-finalized' && e.identity && e.identity.part === p && e.batchId === B) df.set(e.identity.cut, e);
    const vp = new Map(); for (const e of ev) if (e.type === 'voie-predite-ombre' && e.identity && e.identity.part === p && e.batchId === B) vp.set(e.identity.cut, e);
    const diff = [...cibles].filter(c => !poses.has(c)).sort((a, b) => a - b);
    const motif = c => { const e = df.get(c); const m = ['left', 'right'].map(s => e && e.rails && e.rails[s] && e.rails[s].gcv1 && e.rails[s].gcv1.motif); return m.includes('gauge-out-of-contract') ? 'gauge-out-of-contract' : (m[0] || m[1] || 'inconnu'); };
    const cnt = (f) => diff.reduce((a, c) => { const k = f(c); a[k] = (a[k] || 0) + 1; return a; }, {});
    let paquets = 0, prev = null; for (const c of diff) { if (prev === null || c - prev > 1) paquets++; prev = c; }
    const invalides = (j.fichesDepart || []).filter(f => f.partie === p).pop();
    console.log(JSON.stringify({ dossier: path.basename(d), partie: p, version: dep.version || j.version, invalidesAuDepart: invalides ? invalides.invalides : null, cibles: cibles.size, poses: poses.size, differes: diff.length,
      partDifferes: cibles.size ? Math.round(1000 * diff.length / cibles.size) / 10 : null, paquets, motif: cnt(motif), voiePredite: cnt(c => vp.get(c) ? String(vp.get(c).raison).replace(/^(left|right):.*$/, 'cote:aucun-minimum-ou-cadre') : 'aucune') }));
  }
}
