#!/usr/bin/env node
'use strict';
/* Ampleur des corrections de la relecture, par classe de cut (hors lot, appliqué
 * par un lot, différé), dans le repère du rail à l'ouverture (referenceFor).
 *   node --max-old-space-size=13000 corrections.cjs RELECTURE ACC-4718.json ACC-4719.json SORTIE.json
 * ACC-* : rapports de tools/acceptance-report.cjs avec relecture. */
const B=process.env.BANANE||'/home/user/banane';
const M=require(B+'/tools/merge-segments.cjs'),Lab=require(B+'/tools/placement-lab.cjs'),fs=require('fs');
const s=M.loadSession(process.argv[2]);
const r18=new Map(JSON.parse(fs.readFileSync(process.argv[3])).lots[0].rows.map(r=>[r.cut,r.outcome]));
const r19=new Map(JSON.parse(fs.readFileSync(process.argv[4])).lots[0].rows.map(r=>[r.cut,r.outcome]));
const out=[];
for(const r of s.records){const c=r.identity.cut,b=r.beforeEstablished;if(!b?.rails)continue;
  const cls=r18.has(c)||r19.has(c)?(r19.get(c)==='applied'?'L19A':r18.get(c)==='applied'?'L18A':'Ldiff'):'hors';
  const d={};for(const side of ['left','right']){const ref=Lab.referenceFor(r,side,b.rails[side],b.capturedAt);d[side]=ref.status==='candidate'?[ref.deltaLocal[1]*1000,ref.deltaLocal[2]*1000]:ref.reason;}
  out.push({cut:c,cls,label:r.observedLabelCandidate,visit:r.visitIndex,at:b.capturedAt,d});}
fs.writeFileSync(process.argv[5],JSON.stringify(out));
const q=(a,f)=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[Math.floor(f*(a.length-1))]:null};
for(const cls of ['hors','L18A','L19A','Ldiff']){const x=out.filter(o=>o.cls===cls&&/CORRECTED/.test(o.label));
  const m=x.flatMap(o=>['left','right'].filter(s=>Array.isArray(o.d[s])).map(s=>Math.max(Math.abs(o.d[s][0]),Math.abs(o.d[s][1]))));
  console.log(cls,'corrigés',x.length,'rails',m.length,'max|Δ| méd',q(m,.5)?.toFixed(1),'p90',q(m,.9)?.toFixed(1),'>10mm',m.filter(v=>v>10).length,'>30mm',m.filter(v=>v>30).length);}
