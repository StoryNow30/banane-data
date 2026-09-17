#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const args=process.argv.slice(2);
const arg=n=>{const i=args.indexOf(n);return i>=0?args[i+1]:null;};
const DATA=path.resolve(arg('--data')||'datasets/native-v4.6-2026-09-16');
const BANANE=path.resolve(arg('--banane')||'../banane');
const OUT=path.resolve(arg('--output')||'provenance-result.json');
const DATA_COMMIT='d541686d3a98569125cdbdb261ef121c9f533d6a';
const BASE_COMMIT='52d4f529557641dd34d1c2296722e937c48702d0';
const FAILURE_REASON='Plan de roulement non estimable.';
const C=require(path.join(BANANE,'vendor/capture-core.js'));
const G=require(path.join(BANANE,'src/geometry.js'));
const N=require(path.join(BANANE,'tools/native-replay.cjs'));
const CAP=require(path.join(BANANE,'tools/banane-capsule.cjs'));
const LAB=require(path.join(BANANE,'tools/vertical-alignment-provenance-v1.cjs'));

const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const finite=Number.isFinite;
function loadJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}
function canonical(v){if(Array.isArray(v))return'['+v.map(canonical).join(',')+']';if(v&&typeof v==='object')return'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
function stat(vals){return LAB.stats(vals.filter(finite));}
function median(vals){return stat(vals).median;}
function idKey(k){return `${k.sessionId}|${k.visitId}|${k.side}`;}
function compactRef(r){return{sessionId:r.identity.sessionId,visitId:r.identity.visitId,visitIndex:r.identity.visitIndex,part:r.identity.part,cut:r.identity.cut,side:r.identity.side,cohort:r.identity.cohort};}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);}
function dot(a,b){return a.reduce((s,x,i)=>s+x*b[i],0);}
function norm(a){return Math.hypot(...a);}
function angle(a,b){const d=dot(a,b)/(norm(a)*norm(b));return Math.acos(Math.max(-1,Math.min(1,d)));}
function matrixDiff(a,b){return Math.max(...a.map((x,i)=>Math.abs(x-b[i])));}

function loadCapsuleRegistry(){
  const dir=path.join(BANANE,'data/capsules/rsf-v1');
  const m=loadJson(path.join(dir,'manifest.json'));
  const rows=[];
  for(const s of m.shards){
    const p=path.join(dir,s.file),buf=fs.readFileSync(p);
    if(sha256(buf)!==s.sha256)throw Error(`capsule shard SHA mismatch ${s.file}`);
    for(const line of buf.toString('utf8').split(/\r?\n/))if(line)rows.push(JSON.parse(line));
  }
  if(rows.length!==239)throw Error(`capsule registry ${rows.length} != 239`);
  return{manifest:m,rows};
}

function allIndices(){
  const out=[];
  for(const archive of ['historical','final']){
    const root=path.join(DATA,archive);
    if(!fs.existsSync(root))continue;
    for(const e of fs.readdirSync(root,{withFileTypes:true})){
      if(!e.isDirectory())continue;
      const p=path.join(root,e.name,'_index.json');
      if(fs.existsSync(p)){const idx=loadJson(p);out.push({archive,indexPath:p,dir:path.dirname(p),idx,sourceName:idx.sourceName});}
    }
  }
  return out;
}

function loadRootObject(entry){
  const rep=entry.idx.semanticRepresentation;
  if(rep.kind!=='object-shards')throw Error(`unsupported root ${rep.kind} ${entry.sourceName}`);
  const out={};
  for(const s of rep.shards)Object.assign(out,loadJson(path.join(DATA,s.path)));
  return out;
}

function buildIndexByArchiveName(entries){
  const m=new Map();
  for(const e of entries)m.set(`${e.archive}|${e.sourceName}`,e);
  return m;
}

function sourceBasename(s){return path.basename(String(s).replaceAll('\\','/'));}

function locateVisitPayloads(registry,entries){
  const byName=buildIndexByArchiveName(entries),rootCache=new Map(),partial=[];
  for(const cap of registry){
    const archive=cap.provenance.archive;
    const name=sourceBasename(cap.provenance.sourceFile);
    const entry=byName.get(`${archive}|${name}`);
    if(!entry)throw Error(`materialized source missing ${archive}/${name}`);
    let raw=rootCache.get(entry.indexPath);
    if(!raw){raw=loadRootObject(entry);rootCache.set(entry.indexPath,raw);}
    if(raw.session?.id!==cap.key.sessionId)throw Error(`session mismatch ${name}`);
    const deref=N.derefer(raw.dictionaries);
    const rec=raw.records.find(r=>r.visitId===cap.key.visitId);
    if(!rec)throw Error(`visit missing ${cap.key.visitId} in ${name}`);
    const identity=deref(rec.identity);
    if(identity.part!==cap.key.part||identity.cut!==cap.key.cut)throw Error(`identity mismatch ${cap.key.visitId}`);
    const ge=deref(rec.geometryEligibility??null)?.[cap.key.side];
    const snaps=deref(rec.railSnapshots??null)?.[cap.key.side]||[];
    if(!ge||ge.status!=='comparable-candidate')throw Error(`eligibility mismatch ${cap.key.part}/${cap.key.cut}/${cap.key.side}`);
    const snap=snaps.find(s=>s.snapshotId===ge.snapshotId);
    if(!snap?.rail)throw Error(`snapshot missing ${ge.snapshotId}`);
    partial.push({cap,entry,rawMeta:{segment:raw.segment??null,sessionMetrics:raw.session?.metrics??null},identity,ge,snap,chunkIds:[...(ge.chunkIds||[])]});
  }
  return{partial,rootFiles:[...rootCache.keys()].sort()};
}

function scanNeededChunks(partial,entries){
  const neededByArchive={historical:new Set(),final:new Set()};
  for(const p of partial)for(const id of p.chunkIds)neededByArchive[p.entry.archive].add(id);
  const found={historical:new Map(),final:new Map()},consulted=[];
  for(const archive of ['historical','final']){
    const need=neededByArchive[archive];
    for(const e of entries.filter(x=>x.archive===archive)){
      const node=e.idx.semanticRepresentation.largeEntries?.clouds;
      if(!node||!need.size)continue;
      for(const shard of node.shards||[]){
        const fp=path.join(DATA,shard.path); consulted.push(path.relative(DATA,fp));
        const arr=loadJson(fp);
        for(const c of arr){
          if(!need.has(c.chunkId))continue;
          const normalized={points:c.pointsSceneRelative,visible:c.visibleByClipBoxes??null};
          const h=sha256(Buffer.from(canonical(normalized),'utf8'));
          if(found[archive].has(c.chunkId)){
            const prev=found[archive].get(c.chunkId);
            if(prev.contentSha256!==h)throw Error(`non-identical duplicate chunk ${c.chunkId}`);
            prev.occurrences.push({sourceName:e.sourceName,shard:path.relative(DATA,fp)});
          }else found[archive].set(c.chunkId,{chunkId:c.chunkId,...normalized,contentSha256:h,occurrences:[{sourceName:e.sourceName,shard:path.relative(DATA,fp)}]});
        }
      }
    }
    const miss=[...need].filter(x=>!found[archive].has(x));
    if(miss.length)throw Error(`missing ${archive} chunks ${miss.slice(0,10).join(',')} (${miss.length})`);
  }
  return{neededByArchive,found,consulted:[...new Set(consulted)].sort()};
}

function reconstructPayloads(partial,chunks){
  const rows=[],parity=[];
  for(const p of partial){
    const archive=p.entry.archive;
    const cs=p.chunkIds.map(id=>{const c=chunks.found[archive].get(id);return{chunkId:id,points:c.points,visible:c.visible};});
    const payload={
      key:{corpus:p.cap.key.corpus,cohort:p.cap.key.cohort,sessionId:p.cap.key.sessionId,visitId:p.cap.key.visitId,visitIndex:p.cap.key.visitIndex,part:p.identity.part,cut:p.identity.cut,side:p.cap.key.side},
      target:{pageId:p.identity.pageId,part:p.identity.part,cut:p.identity.cut,shape:p.identity.shape,frameId:p.identity.frameId,projectId:p.identity.projectId??null},
      railInitialState:p.snap.rail,
      snapshot:{snapshotId:p.ge.snapshotId,criteriaVersion:p.ge.criteriaVersion??null},
      chunkRefs:[...p.chunkIds],chunks:cs,
      provenance:{archive,corpus:p.cap.key.corpus,sourceFile:p.entry.sourceName,snapshotId:p.ge.snapshotId,captureId:p.ge.captureId??null,pointsSupplied:cs.reduce((n,c)=>n+c.points.length,0),materializedDataCommit:DATA_COMMIT,
        chunkMaterializedSources:p.chunkIds.map(id=>({chunkId:id,occurrences:chunks.found[archive].get(id).occurrences}))}
    };
    /* integrity-only compatibility with sealed capsule hash; referenceStatus is never retained in analysis/output */
    const integritySnapshot={snapshotId:p.ge.snapshotId,criteriaVersion:p.ge.criteriaVersion??null,referenceStatus:p.ge.referenceStatus??null};
    const checkPayload={key:payload.key,target:payload.target,railInitialState:payload.railInitialState,snapshot:integritySnapshot,chunkRefs:payload.chunkRefs,chunks:payload.chunks};
    const h=CAP.shaOf(checkPayload),ok=h===p.cap.payloadSha256;
    parity.push({identity:payload.key,expected:p.cap.payloadSha256,materialized:h,match:ok});
    if(!ok)throw Error(`payload parity mismatch ${p.cap.key.part}/${p.cap.key.cut}/${p.cap.key.side}`);
    payload.payloadSha256=p.cap.payloadSha256;
    rows.push(payload);
  }
  return{rows,parity};
}

function visiblePoints(payload){const out=[];for(const c of payload.chunks)for(let i=0;i<c.points.length;i++)if(c.visible?.[i]!==false)out.push(c.points[i]);return out;}
function traceRail(payload){
  const capture=CAP.captureFromPayload(payload),t=CAP.trace(capture,payload.key.side),proposal=G.propose(capture,payload.key.side);
  return{seedZ:t.seed?.[1]??null,coarseBestZ:t.coarseBest?.z??null,coarseBestLoss:t.coarseBest?.loss??null,refinedBestZ:t.refinedBest?.z??null,refinedBestLoss:t.refinedBest?.loss??null,topRows:t.topRows??null,exit:t.exit,proposalStatus:proposal?.status??null,proposalReasons:proposal?.reasons??[],proposalLoss:proposal?.metrics?.templateLoss??null};
}
function augment(payload){
  const a=LAB.analyzeRail(payload),vp=visiblePoints(payload),tr=traceRail(payload);
  const perChunkRaw=payload.chunks.map(c=>{const zs=[];for(let i=0;i<c.points.length;i++)if(c.visible?.[i]!==false)zs.push(c.points[i][2]);return{chunkId:c.chunkId,rawSceneZ:stat(zs)};});
  a.rawSceneZStatistics=stat(vp.map(p=>p[2]));
  a.perChunkRawSceneZ=perChunkRaw;
  a.engineTrace=tr;
  a.sourceProvenance.materializedDataCommit=DATA_COMMIT;
  a.sourceProvenance.materializedChunkSources=payload.provenance.chunkMaterializedSources;
  delete a.sourceProvenance.explicitTimestamp;
  return a;
}

function addContexts(rails){
  const groups=new Map();
  for(const r of rails){const k=`${r.identity.sessionId}|${r.identity.side}`;(groups.get(k)||groups.set(k,[]).get(k)).push(r);}
  for(const xs of groups.values()){
    xs.sort((a,b)=>a.identity.visitIndex-b.identity.visitIndex||a.identity.cut-b.identity.cut);
    for(let i=0;i<xs.length;i++){
      const cmp=(a,b)=>({from:compactRef(a),to:compactRef(b),visitIndexDelta:b.identity.visitIndex-a.identity.visitIndex,profileOriginDisplacement:dist(a.profileOrigin,b.profileOrigin),axisOrientationDeltaRadians:{x:angle(a.profileAxes.x,b.profileAxes.x),y:angle(a.profileAxes.y,b.profileAxes.y),z:angle(a.profileAxes.z,b.profileAxes.z)},matrixMaxAbsDelta:matrixDiff(a.matrixAudit.providedProfileLocalToSceneRelative,b.matrixAudit.providedProfileLocalToSceneRelative),projectedCloudMedianDelta:(b.sceneProjectedCloudStatistics?.median??NaN)-(a.sceneProjectedCloudStatistics?.median??NaN),cloudContourMedianGapDelta:(b.cloudContourRelation?.medianDifference??NaN)-(a.cloudContourRelation?.medianDifference??NaN)});
      xs[i].neighborContinuityContext={previous:i?cmp(xs[i-1],xs[i]):null,next:i+1<xs.length?cmp(xs[i],xs[i+1]):null,scope:'selected 239 rails only'};
      if(xs[i].identity.cohort==='failure'){
        const controls=xs.filter(r=>r.identity.cohort==='control');
        const nearest=controls.map(c=>({c,d:Math.abs(c.identity.visitIndex-xs[i].identity.visitIndex)})).sort((a,b)=>a.d-b.d)[0];
        xs[i].sameSessionSideControlContext=nearest?{visitIndexDistance:nearest.d,control:compactRef(nearest.c),comparison:cmp(nearest.c,xs[i])}:null;
      }
    }
  }
  const byVisit=new Map();for(const r of rails){const k=`${r.identity.sessionId}|${r.identity.visitId}`;(byVisit.get(k)||byVisit.set(k,[]).get(k)).push(r);}
  for(const xs of byVisit.values()){
    const l=xs.find(r=>r.identity.side==='left'),r=xs.find(r=>r.identity.side==='right');if(!l||!r)continue;
    const lset=new Set(l.sourceProvenance.chunkRefs),rset=new Set(r.sourceProvenance.chunkRefs),inter=[...lset].filter(x=>rset.has(x));
    l.sameVisitOppositeSideContext={opposite:compactRef(r),sameFrameId:l.sourceProvenance.frameId===r.sourceProvenance.frameId,sameSnapshotId:l.sourceProvenance.snapshotId===r.sourceProvenance.snapshotId,chunkIntersection:inter,exactSameChunks:JSON.stringify(l.sourceProvenance.chunkRefs)===JSON.stringify(r.sourceProvenance.chunkRefs)};
    r.sameVisitOppositeSideContext={opposite:compactRef(l),sameFrameId:l.sourceProvenance.frameId===r.sourceProvenance.frameId,sameSnapshotId:l.sourceProvenance.snapshotId===r.sourceProvenance.snapshotId,chunkIntersection:inter,exactSameChunks:JSON.stringify(l.sourceProvenance.chunkRefs)===JSON.stringify(r.sourceProvenance.chunkRefs)};
  }
}

function summarize(rails){
  const cohorts={};
  for(const cohort of ['failure','control']){
    const xs=rails.filter(r=>r.identity.cohort===cohort);
    cohorts[cohort]={rails:xs.length,rawSceneZMedianAcrossRails:stat(xs.map(r=>r.rawSceneZStatistics.median)),sceneProjectedMedianAcrossRails:stat(xs.map(r=>r.sceneProjectedCloudStatistics?.median)),profileLocalZMedianAcrossRails:stat(xs.map(r=>r.profileLocalCloudStatistics?.median)),cloudContourGapAcrossRails:stat(xs.map(r=>r.cloudContourRelation?.medianDifference)),seedZAcrossRails:stat(xs.map(r=>r.engineTrace.seedZ)),coarseBestZAcrossRails:stat(xs.map(r=>r.engineTrace.coarseBestZ)),refinedBestZAcrossRails:stat(xs.map(r=>r.engineTrace.refinedBestZ)),topRowsAcrossRails:stat(xs.map(r=>r.engineTrace.topRows)),lossAcrossRails:stat(xs.map(r=>r.engineTrace.refinedBestLoss))};
  }
  const stage={};for(const r of rails)stage[r.firstObservedStage]=(stage[r.firstObservedStage]||0)+1;
  const failures=rails.filter(r=>r.identity.cohort==='failure');
  const controls=rails.filter(r=>r.identity.cohort==='control');
  const projPass=rails.filter(r=>r.projectionIndependentVsTransform?.passes).length;
  const chunkCounts={};for(const r of rails)chunkCounts[r.chunkComposition.chunkCount]=(chunkCounts[r.chunkComposition.chunkCount]||0)+1;
  const sameVisitPairs=rails.filter(r=>r.sameVisitOppositeSideContext).length/2;
  const sessions={};for(const r of rails){const s=r.identity.sessionId;(sessions[s]??={failures:0,controls:0});sessions[s][r.identity.cohort==='failure'?'failures':'controls']++;}
  const special={
    clusterPart1Right5083_5276:rails.filter(r=>r.identity.part===1&&r.identity.side==='right'&&r.identity.cut>=5083&&r.identity.cut<=5276).map(r=>({identity:compactRef(r),projectedMedian:r.sceneProjectedCloudStatistics?.median,localMedian:r.profileLocalCloudStatistics?.median,gap:r.cloudContourRelation?.medianDifference,seedZ:r.engineTrace.seedZ,topRows:r.engineTrace.topRows,stage:r.firstObservedStage})),
    session3876864f:rails.filter(r=>r.identity.sessionId.startsWith('3876864f')).map(r=>compactRef(r)),
    sessionD9ccb:rails.filter(r=>r.identity.sessionId.startsWith('d9ccb')).map(r=>({identity:compactRef(r),gap:r.cloudContourRelation?.medianDifference,stage:r.firstObservedStage})),
    session0c58Visit245Boundary:rails.filter(r=>r.identity.sessionId.startsWith('0c58c033')&&Math.abs(r.identity.visitIndex-245)<=8).map(r=>({identity:compactRef(r),gap:r.cloudContourRelation?.medianDifference,origin:r.profileOrigin,stage:r.firstObservedStage}))
  };
  return{rails:rails.length,projectionEquivalent:projPass,projectionNonEquivalent:rails.length-projPass,firstObservedStage:stage,cohorts,cohortMedianDifferences:{rawSceneZ:(cohorts.failure.rawSceneZMedianAcrossRails.median??NaN)-(cohorts.control.rawSceneZMedianAcrossRails.median??NaN),sceneProjection:(cohorts.failure.sceneProjectedMedianAcrossRails.median??NaN)-(cohorts.control.sceneProjectedMedianAcrossRails.median??NaN),profileLocalZ:(cohorts.failure.profileLocalZMedianAcrossRails.median??NaN)-(cohorts.control.profileLocalZMedianAcrossRails.median??NaN),cloudContourGap:(cohorts.failure.cloudContourGapAcrossRails.median??NaN)-(cohorts.control.cloudContourGapAcrossRails.median??NaN)},chunkCounts,sameVisitPairs,sessions,special};
}

function hypotheses(summary){
  const transformEquivalent=summary.projectionEquivalent===summary.rails;
  return{
    A:{status:'COMPATIBLE',statement:'A difference may already exist in captured scene coordinates, but absolute scene Z is location-dependent; the decisive pre-transform observation is the cloud/profile scene-relative projection, not raw Z alone.'},
    B:{status:'NON TESTABLE',statement:'The materialized dataset exposes reconstructed scene points and chunk boundaries but not the upstream reconstruction inputs/transform chain needed to decide whether reconstruction introduced the disagreement.'},
    C:{status:transformEquivalent?'CONTREDIT':'COMPATIBLE',statement:transformEquivalent?'Independent scene-axis projection and sceneRelativeToProfileLocal Z agree within the predeclared numerical envelope on all rails; the implemented scene-to-profile transform does not introduce the observed relative vertical disagreement.':'At least one rail is not numerically equivalent, so transform introduction remains compatible for those rails.'},
    D:{status:'COMPATIBLE',statement:'The disagreement is observable in the scene-relative relation between the cloud and profile pose; this is compatible with pose/cloud inconsistency but does not identify which side of the relation is causal.'},
    E:{status:'NON TESTABLE',statement:'No explicit chunk acquisition, frame, and profile-pose timestamps are available to establish contemporaneity.'},
    F:{status:transformEquivalent?'CONTREDIT':'COMPATIBLE',statement:transformEquivalent?'The cohort separation is observable before coarse/refined search, so it is not introduced only by the search engine.':'Pre-search localization is incomplete for some rails.'},
    G:{status:'COMPATIBLE',statement:'Multiple upstream mechanisms can remain jointly compatible because LiDAR acquisition, pose generation, association timing, and upstream scene transforms are not separable with current provenance.'}
  };
}

(function main(){
  const manifest=loadJson(path.join(DATA,'manifest.json'));
  const registry=loadCapsuleRegistry();
  const entries=allIndices();
  const {partial,rootFiles}=locateVisitPayloads(registry.rows,entries);
  const chunks=scanNeededChunks(partial,entries);
  const rec=reconstructPayloads(partial,chunks);
  const rails=rec.rows.map(augment);addContexts(rails);
  const summary=summarize(rails),hyp=hypotheses(summary);
  const consulted={manifest:'manifest.json',rootObjectFiles:rootFiles.map(p=>path.relative(DATA,p)),cloudShardFiles:chunks.consulted,materializedSourceIndices:[...new Set(partial.map(p=>path.relative(DATA,p.entry.indexPath)))].sort(),neededChunkIds:{historical:[...chunks.neededByArchive.historical].sort(),final:[...chunks.neededByArchive.final].sort()}};
  const result={format:'banane-vertical-alignment-provenance-v1-materialized-run',source:{repository:'StoryNow30/banane-data',commit:DATA_COMMIT,dataset:'datasets/native-v4.6-2026-09-16',manifestSha256:sha256(fs.readFileSync(path.join(DATA,'manifest.json'))),archiveAuthority:manifest.archives??manifest.sourceArchives??null},banane:{repository:'StoryNow30/banane',base:BASE_COMMIT,labBranch:'lab-vertical-alignment-provenance-v1'},population:{rails:239,failures:63,controls:176,registryRole:'identity/source locator only; all measured pose/chunk/point values re-read from materialized data'},integrity:{payloadParityMatches:rec.parity.filter(x=>x.match).length,payloadParityMismatches:rec.parity.filter(x=>!x.match).length,parity:rec.parity},consulted,summary,hypotheses:hyp,provenanceGap:{code:'PROVENANCE_GAP',missing:['explicit acquisition timestamp for each LiDAR chunk','explicit timestamp for frameId','explicit timestamp for snapshot/profile pose state','upstream sensor-to-scene transform chain and its timestamp/version','explicit association event tying profile pose state to LiDAR acquisition instant'],causalConsequence:'LiDAR acquisition, profile pose, temporal association, snapshot timing, and upstream scene transformation cannot be separated as causal source.'},rails};
  result.deterministicSha256=sha256(Buffer.from(canonical(result),'utf8'));
  fs.writeFileSync(OUT,JSON.stringify(result,null,2)+'\n');
  console.log('MATERIALIZED_PROVENANCE_SUMMARY');console.log(JSON.stringify({integrity:result.integrity.payloadParityMatches,summary,hypotheses:hyp,deterministicSha256:result.deterministicSha256},null,2));
})();
