const A=require('/home/user/banane/tools/acceptance-report.cjs'),L=require('/home/user/banane/src/lot-decision.js'),G=require('/home/user/banane/src/gauge.js');
const S='/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad';
const lots=[['p19',S+'/p19','pilote-p19-4.7.6'],['p31a',S+'/lot0924/lot','pilote-p31-4.7.8'],['p31b',S+'/lot0924b/lot','pilote-p31-fin-4.7.9'],['p34',S+'/lot0924e','pilote-p34-4.7.11'],['p2',S+'/lotq/lot','pilote-p2-4.7.14'],['p35',S+'/b418/p35','pilote-p35-4.7.12']];
const rows=n=>['c','d','e','f'].flatMap(p=>{try{return require(`${S}/sweep/${n}-${p}.json`).rows}catch{return []}});
const R={decided:new Map(rows('appui-decide').map(x=>[x.source+':'+x.cut,x])),placed:new Map(rows('appui-pose').map(x=>[x.source+':'+x.cut,x]))};
const only=process.argv[2];
function commandable(d,cap){if(!d?.positions)return false;const g=G.classifyMm(L.gaugeOf(d.positions));if(!G.admissible(g))return false;
  if(d.stage==='first-pass')return true;const cams=L.viewCameras(cap);if(!['left','right'].some(s=>cams[s]))return true;
  return ['left','right'].every(s=>cams[s]&&L.inView(cams[s],d.positions[s]).inView);}
const tot={};
for(const [k,dir,src] of lots){if(only&&k!==only)continue;
  const lot=A.loadLot(dir,k),ctx=A.lotCuts(lot.diagnostic,lot.journal),obs=ctx.cuts.flatMap(c=>c.observations),caps=new Map(lot.corpus.clouds.map(c=>[c.captureId,c]));
  const {source,...r}=A.lotRules([],null,true);
  for(const rule of ['decided','placed']){
    const out=A.replayLot(obs,lot.corpus,{options:{...r,anchorRule:rule},mode:'apply',validatedKeys:ctx.processed});
    const last=new Map();out.forEach((x,i)=>{const o=obs.find(y=>y.observationEventId===x.observationEventId);if(x.decision)last.set(o.identity.cut,{d:x.decision,cap:caps.get(o.lidar?.captureId)});});
    const t=tot[rule]||(tot[rule]={decides:0,commandables:0,justes:0,faux:0,nonJuges:0,cuts:[]});
    for(const [cut,{d,cap}] of last){if(!['first-pass','window','choice'].includes(d.stage))continue;t.decides++;
      if(!commandable(d,cap))continue;t.commandables++;const row=R[rule].get(src+':'+cut);
      if(row?.judged){row.wrong?t.faux++:t.justes++;}else t.nonJuges++;t.cuts.push(src+':'+cut);}
  }
  console.error(k,'fait');
}
const a=new Set(tot.decided.cuts),b=new Set(tot.placed.cuts);
console.log(JSON.stringify({decided:{...tot.decided,cuts:undefined},placed:{...tot.placed,cuts:undefined},perdus:[...a].filter(x=>!b.has(x)),gagnes:[...b].filter(x=>!a.has(x))},null,1));
