const A=require(require('path').resolve(process.env.BANANE||'.')+'/tools/acceptance-report.cjs'),L=require(require('path').resolve(process.env.BANANE||'.')+'/src/lot-decision.js');
const lot=A.loadLot(process.argv[2],'x');const caps=new Map(lot.corpus.clouds.map(c=>[c.captureId,c]));
const obs=lot.diagnostic.observations.filter(o=>o.identity.part===9).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
let hv=[];for(const o of obs){const c=o.lotObservation?.command;if(c?.reason?.startsWith('hors-vue'))hv.push(o.identity.cut+':'+c.reason.slice(9)+'@'+c.ndc.join('/'));}
console.log('hors-vue',hv.length,hv.join(' '));
const f=v=>v==null?'-':v.toFixed(2);
for(const o of obs){const cut=o.identity.cut;if(cut<+process.argv[3]||cut>+process.argv[4])continue;const cap=caps.get(o.lidar?.captureId);if(!cap)continue;const cams=L.viewCameras(cap);
 const s=['left','right'].map(side=>{const p=cap.rails[side]?.positionSceneRelative;if(!cams[side]||!p)return side[0]+':?';const r=L.inView(cams[side],p);return side[0]+':'+(r.ndc?r.ndc.map(f).join('/'):JSON.stringify(r).slice(0,40));});
 console.log(cut,s.join(' '),'pts',cap.pointsSceneRelative.length);}
