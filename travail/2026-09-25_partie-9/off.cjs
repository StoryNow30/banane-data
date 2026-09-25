const A=require(require('path').resolve(process.env.BANANE||'.')+'/tools/acceptance-report.cjs');
const lot=A.loadLot(process.argv[2],'x');const caps=new Map(lot.corpus.clouds.map(c=>[c.captureId,c]));
const obs=lot.diagnostic.observations.filter(o=>o.identity.part===9).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])*1000;
const res=[];for(const o of obs){const l=o.lotObservation,cap=caps.get(o.lidar?.captureId);if(!l?.positions||!cap)continue;
 res.push({cut:o.identity.cut,stage:l.stage,L:d(l.positions.left,cap.rails.left.positionSceneRelative),R:d(l.positions.right,cap.rails.right.positionSceneRelative),hv:l.command?.reason?.startsWith('hors-vue')});}
const w=res.filter(r=>r.stage!=='first-pass');
for(const r of res.filter(r=>r.cut>=+process.argv[3]&&r.cut<=+process.argv[4]))console.log(r.cut,r.stage,'L',r.L.toFixed(0),'R',r.R.toFixed(0),r.hv?'HORS-VUE':'');
const m=w.map(r=>Math.max(r.L,r.R)).sort((a,b)=>a-b);console.log('voie/choix',w.length,'écart pose départ max par cut: médiane',m[m.length>>1].toFixed(0),'p90',m[Math.floor(m.length*0.9)].toFixed(0),'max',m.at(-1).toFixed(0),'hors-vue',w.filter(r=>r.hv).map(r=>Math.max(r.L,r.R).toFixed(0)).join(','));
const nh=w.filter(r=>!r.hv).map(r=>Math.max(r.L,r.R));console.log('max appliqué sans hors-vue',Math.max(...nh).toFixed(0));
