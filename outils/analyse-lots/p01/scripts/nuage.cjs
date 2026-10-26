// Qualité du nuage mesurable au journal : points par capture (adapter-result capture, lastDetail), selon posé/différé/étape. Usage: node nuage.cjs <partie> <diff.txt>
const fs=require('fs');const S=process.env.S;const p=+process.argv[2];
const jf=fs.readdirSync(S+'/p01/data/lot'+p).filter(x=>/journal/.test(x)).map(x=>S+'/p01/data/lot'+p+'/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);const B=bsA.at(-1).batch.id;const t0=Date.parse(bsA.at(-1).timestamp);const t1=Date.parse(ev.find(e=>e.type==='batch-stopped-at-end'&&Date.parse(e.timestamp)>t0).timestamp);
const q=(a,pp)=>{a=a.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const at=(a.length-1)*pp,lo=Math.floor(at),hi=Math.ceil(at);return Math.round(a[lo]+(a[hi]-a[lo])*(at-lo));};
const D=new Set(fs.readFileSync(S+'/p01/res/'+process.argv[3],'utf8').trim().split(',').map(Number));
const cap={};const att={};
for(const e of ev) if(e.type==='adapter-result'&&e.action==='capture'&&e.batchId===B&&e.identity&&Date.parse(e.timestamp)>=t0&&Date.parse(e.timestamp)<=t1+2000){const c=e.identity.cut;const d=e.lastDetail||{};(cap[c]=cap[c]||[]).push({pts:d.points,nodes:d.nodes,att:d.attempts,bytes:d.bytes,err:e.error,stage:e.lastStage,ms:e.elapsedMs});}
for(const e of ev) if(e.type==='capture-abandoned'&&e.reason==='depart-sur-vert'&&e.identity&&Date.parse(e.timestamp)<=t0+30000)delete cap[e.identity.cut];
const cuts=Object.keys(cap).map(Number);
const last=c=>cap[c].at(-1);
const grp={posés:cuts.filter(c=>!D.has(c)),différés:cuts.filter(c=>D.has(c))};
for(const [k,a] of Object.entries(grp)){const pts=a.map(c=>last(c).pts);const nd=a.map(c=>last(c).nodes);
  console.log(k,'cuts',a.length,'points méd/p10/p25/p90/min',q(pts,.5),q(pts,.1),q(pts,.25),q(pts,.9),Math.min(...pts.filter(Number.isFinite)),'| nœuds méd/p10',q(nd,.5),q(nd,.1),'| <1000 pts',pts.filter(x=>x<1000).length,'<3000',pts.filter(x=>x<3000).length,'<5000',pts.filter(x=>x<5000).length,'| captures multiples',a.filter(c=>cap[c].length>1).length,'| tentatives>1',a.filter(c=>(last(c).att||1)>1).length,'| erreurs',a.filter(c=>cap[c].some(x=>x.err)).length,'| points absents',pts.filter(x=>!Number.isFinite(x)).length);}
// par différé
console.log('différés (cut:points:nœuds:tentatives):',[...D].filter(c=>cap[c]).map(c=>c+':'+last(c).pts+':'+last(c).nodes+':'+last(c).att+(cap[c].length>1?'x'+cap[c].length:'')).join(' '));
// Écho / passe : sans-nuage
console.log('passe motif sans-nuage:',ev.filter(e=>e.type==='passe-differes-ombre'&&/nuage/.test(e.motif||'')).length);
// lecture rapide/échantillon
console.log('lecture/regleLecture',JSON.stringify(cuts.reduce((a,c)=>{const e=ev.find(x=>0);return a;},{})));
const lec={};for(const e of ev) if(e.type==='adapter-result'&&e.action==='capture'&&e.batchId===B){const d=e.lastDetail||{};const k=d.lecture+'/'+d.regleLecture;lec[k]=(lec[k]||0)+1;}console.log('lecture',JSON.stringify(lec));
// motifs de différé liés au nuage : diag-differes? compter types d'événements liés à capture vide
const t={};for(const e of ev){if(/vide|empty|sparse|rare|insuffis/i.test(e.type+JSON.stringify(e.reason||'')+JSON.stringify(e.motif||'')))t[e.type+'|'+(e.reason||e.motif||'')]=(t[e.type+'|'+(e.reason||e.motif||'')]||0)+1;}
console.log('événements vide/rare',JSON.stringify(t));
