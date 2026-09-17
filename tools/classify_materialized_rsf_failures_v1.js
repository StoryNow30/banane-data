#!/usr/bin/env node
'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const args=process.argv.slice(2), arg=n=>{const i=args.indexOf(n);return i>=0?args[i+1]:null;};
const ROOT=path.resolve(arg('--root')||'reconstructed');
const BANANE=path.resolve(arg('--banane')||'banane');
const RSFROOT=path.resolve(arg('--rsf-method')||'rsf-method');
const OUT=path.resolve(arg('--output')||'rsf-failure-families-materialized.json');
const N=require(path.join(BANANE,'tools/native-replay.cjs'));
const RSF=require(path.join(RSFROOT,'tools/running-surface-failure-lab.cjs'));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
function loadJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}
function sourceBase(s){return path.basename(String(s).replaceAll('\\','/'));}
function registry(){
  const dir=path.join(BANANE,'data/capsules/rsf-v1'), m=loadJson(path.join(dir,'manifest.json')), rows=[];
  for(const s of m.shards){const p=path.join(dir,s.file),buf=fs.readFileSync(p);if(sha256(buf)!==s.sha256)throw Error(`capsule SHA mismatch ${s.file}`);for(const line of buf.toString('utf8').split(/\r?\n/))if(line)rows.push(JSON.parse(line));}
  if(rows.length!==239)throw Error(`registry ${rows.length}`); return rows;
}
function rawMap(){const m=new Map();for(const cohort of ['historical','final']){const d=path.join(ROOT,cohort);for(const n of fs.readdirSync(d).filter(x=>x.endsWith('.json'))){const raw=loadJson(path.join(d,n));m.set(`${cohort}|${n}`,raw);}}return m;}
function captureFor(cap,raw){
  const deref=N.derefer(raw.dictionaries),rec=raw.records.find(r=>r.visitId===cap.key.visitId);if(!rec)throw Error(`visit ${cap.key.visitId}`);
  const ge=deref(rec.geometryEligibility??null)?.[cap.key.side],snaps=deref(rec.railSnapshots??null)?.[cap.key.side]||[];if(!ge)throw Error(`eligibility ${cap.key.visitId}/${cap.key.side}`);
  const snap=snaps.find(s=>s.snapshotId===ge.snapshotId);if(!snap?.rail)throw Error(`rail ${cap.key.visitId}/${cap.key.side}`);
  const byId=new Map((raw.clouds||[]).map(c=>[c.chunkId,c])),pts=[],vis=[];
  for(const id of ge.chunkIds||[]){const c=byId.get(id);if(!c)throw Error(`chunk ${id}`);for(let i=0;i<c.pointsSceneRelative.length;i++){pts.push(c.pointsSceneRelative[i]);vis.push(c.visibleByClipBoxes?c.visibleByClipBoxes[i]:true);}}
  return{rails:{[cap.key.side]:snap.rail},pointsSceneRelative:pts,visibleByClipBoxes:vis};
}
const regs=registry(),raws=rawMap(),rows=[];
for(const cap of regs.filter(x=>x.key.cohort==='failure')){
  const raw=raws.get(`${cap.provenance.archive}|${sourceBase(cap.provenance.sourceFile)}`);if(!raw)throw Error(`source ${cap.provenance.archive}/${cap.provenance.sourceFile}`);
  const capture=captureFor(cap,raw), tr=RSF.trace(capture,cap.key.side), land=RSF.supportLandscape(tr), family=RSF.failureFamily(tr,land);
  rows.push({identity:{sessionId:cap.key.sessionId,visitId:cap.key.visitId,visitIndex:cap.key.visitIndex,part:cap.key.part,cut:cap.key.cut,side:cap.key.side},failureFamily:family,topRowsAtCoarseBest:tr.topRowsAtCoarse??null,topRowsAtRefinedBest:tr.topRowsAtRefined??null,refinedBest:tr.refinedBest?{u:tr.refinedBest.u,z:tr.refinedBest.z,loss:tr.refinedBest.loss}:null,gridPointsWithEnoughRows:land?.gridPointsWithEnoughRows??null,nearestSupportedPlacement:land?.nearestSupportedPlacement?{u:land.nearestSupportedPlacement.u,z:land.nearestSupportedPlacement.z,distance:land.nearestSupportedPlacement.distance,loss:land.nearestSupportedPlacement.loss,topRows:land.nearestSupportedPlacement.topRows,lossDelta:land.nearestSupportedPlacement.lossDelta,lossRatioToBest:land.nearestSupportedPlacement.lossRatioToBest}:null});
}
const counts={};for(const r of rows)counts[r.failureFamily]=(counts[r.failureFamily]||0)+1;
if(rows.length!==63)throw Error(`failure rows ${rows.length}`);
if(counts['aucun-support-nulle-part-sur-la-grille']!==56||counts['support-ailleurs-mais-perte-nettement-superieure']!==5||counts['raffinement-a-quitte-le-support']!==2)throw Error(`unexpected families ${JSON.stringify(counts)}`);
const body={format:'banane-rsf-failure-families-materialized-v1',methodCommit:'4005aa4569bd597d3b15be6bc35482a187f547a4',dataCommit:'d541686d3a98569125cdbdb261ef121c9f533d6a',role:'frozen RSF V1 descriptive taxonomy applied to the 63 failure payloads re-read from materialized source data; no human fields',counts,rows};
body.sha256=sha256(Buffer.from(JSON.stringify({format:body.format,methodCommit:body.methodCommit,dataCommit:body.dataCommit,counts:body.counts,rows:body.rows}),'utf8'));
fs.writeFileSync(OUT,JSON.stringify(body,null,2)+'\n');console.log(JSON.stringify({counts,minority:rows.filter(r=>r.failureFamily!=='aucun-support-nulle-part-sur-la-grille'),sha256:body.sha256},null,2));
