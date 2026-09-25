const A=require(require('path').resolve(process.env.BANANE||'.')+'/tools/acceptance-report.cjs'),L=require(require('path').resolve(process.env.BANANE||'.')+'/src/lot-decision.js');
const lot=A.loadLot(process.argv[2],'x');
const obs=lot.diagnostic.observations.filter(o=>o.identity.part===9).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const R19={pairGuard:true,chainMm:15,gaugeGuardMm:20,minTop:5,anchorRule:'placed',crossing:true,framed:true};
const first=A.replayLot(obs,lot.corpus,{validatedKeys:new Set(),mode:'apply',options:R19});
const byId=new Map(first.map(x=>[x.observationEventId,x.decision]));
const placedStage=d=>d&&['first-pass','window','choice','crossing'].includes(d.stage);
// Posés : premier passage appliqué ou reprise/ornière commandée et posée (anchorPlaced).
const posed=[],def=[];
for(const o of obs){const d=byId.get(o.observationEventId);
  if(d?.anchor&&d.anchorPlaced)posed.push({identity:{part:9,cut:o.identity.cut,frameId:o.identity.frameId},positions:d.positions,stage:d.stage});
  else if(!placedStage(d)||(d.anchor&&d.anchorPlaced===false))def.push(o);}
const gap=L.DEFAULTS.frameGap,seeds=posed.filter(a=>def.some(o=>Math.abs(o.identity.cut-a.identity.cut)<=gap));
const again=def.map((o,i)=>i===0?{...o,lotObservation:{...(o.lotObservation||{}),reprise:{anchors:seeds}}}:o);
const out=A.replayLot(again,lot.corpus,{validatedKeys:new Set(),mode:'apply',options:R19});
const dec=out.filter(x=>placedStage(x.decision)&&!(x.decision.anchor&&x.decision.anchorPlaced===false&&x.decision.stage!=='choice'));
const cut=x=>+x.key.split('|')[1];
console.log('différés du lot rejoué 4.7.19',def.length,'appuis de reprise',seeds.length,'décidés par la reprise',dec.length);
console.log(dec.map(x=>cut(x)+':'+x.decision.stage+(x.decision.framedAnchors?'(encadrée)':'')).join(' '));
const hv=out.filter(x=>placedStage(x.decision)&&x.decision.anchorPlaced===false).map(cut);console.log('décidés mais non posables',hv.join(','));
const caps=new Map(lot.corpus.clouds.map(c=>[c.captureId,c]));
for(const x of dec){const o=again.find(y=>y.observationEventId===x.observationEventId);const c=A.simulatedCommand(x.decision,caps.get(o.lidar?.captureId),L);if(c.action!=='lot')console.log('non commandable',cut(x),JSON.stringify(c).slice(0,80));}
const o8407=obs.find(o=>o.identity.cut===8407);console.log('8407',JSON.stringify(o8407.lotObservation?.command),o8407.lotObservation?.stage,'rt.apply',!!o8407.runtime?.apply,JSON.stringify(o8407.runtime?.interruption||o8407.runtime?.abstention||null).slice(0,160));
console.log('vue:',dec.map(x=>{const o=again.find(y=>y.observationEventId===x.observationEventId),cap=caps.get(o.lidar?.captureId),cams=L.viewCameras(cap);
 const ok=['left','right'].every(s=>cams[s]&&L.inView(cams[s],x.decision.positions[s]).inView);return cut(x)+(ok?'':'(HORS-VUE)');}).join(' '));
