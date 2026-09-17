#!/usr/bin/env node
'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const args=process.argv.slice(2), arg=n=>{const i=args.indexOf(n);return i>=0?args[i+1]:null;};
const ROOT=path.resolve(arg('--root')||'reconstructed');
const BANANE=path.resolve(arg('--banane')||'banane');
const OUT=path.resolve(arg('--output')||'boundary-context.json');
const N=require(path.join(BANANE,'tools/native-replay.cjs'));
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const rows=[], exportsSeen=[];
for(const cohort of ['historical','final']){
  const dir=path.join(ROOT,cohort); if(!fs.existsSync(dir))continue;
  for(const name of fs.readdirSync(dir).sort()){
    if(!name.endsWith('.json'))continue;
    const raw=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
    if(!raw.session?.id?.startsWith('0c58c033'))continue;
    exportsSeen.push({cohort,name,sessionId:raw.session.id,segment:raw.segment??null,metrics:raw.session.metrics??null});
    const deref=N.derefer(raw.dictionaries);
    for(const rec of raw.records||[]){
      const ident=deref(rec.identity??null)||{};
      const ge=deref(rec.geometryEligibility??null)||{};
      const snaps=deref(rec.railSnapshots??null)||{};
      const visitIndex=rec.visitIndex??ident.visitIndex??null;
      for(const side of ['left','right']){
        const e=ge?.[side]; if(!e)continue;
        const snap=(snaps?.[side]||[]).find(s=>s.snapshotId===e.snapshotId)??null;
        const rail=snap?.rail??null;
        rows.push({cohort,sourceFile:name,sessionId:raw.session.id,visitId:rec.visitId??null,visitIndex,part:ident.part??null,cut:ident.cut??null,side,pageId:ident.pageId??null,frameId:ident.frameId??null,visitStatus:rec.status??null,lidarStatus:rec.lidarStatus??null,geometryStatus:e.status??null,snapshotId:e.snapshotId??null,captureId:e.captureId??null,chunkIds:[...(e.chunkIds||[])],profileOriginSceneRelative:rail?.profileOriginSceneRelative??null,profileLocalToSceneRelative:rail?.profileLocalToSceneRelative??null,matrixSha256:rail?.profileLocalToSceneRelative?hash(rail.profileLocalToSceneRelative):null});
      }
    }
  }
}
rows.sort((a,b)=>(a.visitIndex??1e9)-(b.visitIndex??1e9)||String(a.visitId).localeCompare(String(b.visitId))||a.side.localeCompare(b.side));
const uniqueIndices=[...new Set(rows.map(r=>r.visitIndex).filter(Number.isFinite))].sort((a,b)=>a-b);
const before=uniqueIndices.filter(x=>x<245).slice(-3), at=uniqueIndices.filter(x=>x===245), after=uniqueIndices.filter(x=>x>245).slice(0,3);
const selected=new Set([...before,...at,...after]);
const contextRows=rows.filter(r=>selected.has(r.visitIndex));
const out={format:'banane-vertical-alignment-boundary-context-v1',sessionPrefix:'0c58c033',boundaryVisitIndex:245,selection:{rule:'three nearest distinct visitIndex values before, exact boundary if present, three nearest after; presentation context only, not an anomaly threshold',before,at,after},exportsSeen,fullObservedVisitIndexRange:uniqueIndices.length?{min:uniqueIndices[0],max:uniqueIndices.at(-1),count:uniqueIndices.length}:null,contextRows,allRowsCount:rows.length,explicitTimestampFieldsObserved:false,note:'No human fields are read. Identifiers, pose state and chunk association only.'};
fs.writeFileSync(OUT,JSON.stringify(out,null,2)+'\n'); console.log(JSON.stringify(out,null,2));
