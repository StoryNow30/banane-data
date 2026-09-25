// Bilan C5 : chaque réglage déplacé seul contre la base (règles 4.7.20), jeux a–d.
const fs=require('fs'),O=process.argv[2];
const cfgs=['base','gaugeGap5','gaugeGap15','gaugeCount2','gaugeCount5','crossingVoieMm5','crossingVoieMm15'];
const load=n=>{const rows=[];for(const p of ['a','b','c','d']){const f=`${O}/${n}-${p}.json`;if(!fs.existsSync(f))return null;rows.push(...(JSON.parse(fs.readFileSync(f)).rows||[]));}return rows;};
const k=x=>x.source+':'+x.cut,out={};let base=null;
const sum=r=>{const j=r.filter(x=>x.judged);return {decided:r.length,judged:j.length,wrong:j.filter(x=>x.wrong).length,wrongCuts:j.filter(x=>x.wrong).map(x=>k(x)+' '+x.worstMm)};};
for(const n of cfgs){const rows=load(n);if(!rows){out[n]='incomplet';continue;}
  const res={natif:sum(rows.filter(x=>x.kind==='natif')),pilote:sum(rows.filter(x=>x.kind==='pilote'))};
  if(n==='base')base=new Map(rows.map(x=>[k(x),x]));
  else{const cur=new Map(rows.map(x=>[k(x),x]));const lab=x=>k(x)+(x.judged?(x.wrong?' FAUX':' juste'):' non jugé');
    res.gained=[...cur.values()].filter(x=>!base.has(k(x))).map(lab);res.lost=[...base.values()].filter(x=>!cur.has(k(x))).map(lab);
    res.changed=[...cur.values()].filter(x=>base.has(k(x))).map(x=>[x,base.get(k(x))]).filter(([x,b])=>x.stage!==b.stage||(x.judged&&b.judged&&(x.wrong!==b.wrong||Math.abs((x.worstMm??0)-(b.worstMm??0))>1)))
      .map(([x,b])=>k(x)+' '+b.stage+'→'+x.stage+(x.judged&&b.judged?` ${b.worstMm}→${x.worstMm} mm`+(x.wrong!==b.wrong?(x.wrong?' DEVIENT FAUX':' DEVIENT JUSTE'):''):''));}
  out[n]=res;}
console.log(JSON.stringify(out,null,1));if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
