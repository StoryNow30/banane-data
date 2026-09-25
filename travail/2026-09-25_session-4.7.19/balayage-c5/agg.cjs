// Bilan des curseurs : pour chaque configuration, cuts appliqués, jugés, faux (Natif et Pilote), écarts à la base.
const fs=require('fs'),S=process.argv[2];
const cfgs=['base','guardMm20','guardMm40','chooseMm10','chooseMm20','chainMm5','chainMm15','gap2','gap4','anchors3'];
const load=n=>['a','b','c','d'].flatMap(p=>{const f=`${S}/${n}-${p}.json`;return fs.existsSync(f)?JSON.parse(fs.readFileSync(f)).rows:null;});
const out={};let base=null;
for(const n of cfgs){if(!fs.existsSync(`${S}/${n}-done`))continue;const rows=load(n);if(rows.includes(null))continue;
  const k=x=>x.source+':'+x.cut,sum=r=>{const j=r.filter(x=>x.judged);return {applied:r.length,judged:j.length,wrong:j.filter(x=>x.wrong).length,wrongCuts:j.filter(x=>x.wrong).map(x=>k(x)+' '+x.worstMm)};};
  const res={natif:sum(rows.filter(x=>x.kind==='natif')),pilote:sum(rows.filter(x=>x.kind==='pilote')),stages:{}};
  for(const x of rows)res.stages[x.stage]=(res.stages[x.stage]||0)+1;
  if(n==='base')base=new Map(rows.map(x=>[k(x),x]));
  else{const cur=new Map(rows.map(x=>[k(x),x]));
    res.gained=[...cur.values()].filter(x=>!base.has(k(x))).map(x=>k(x)+(x.judged?(x.wrong?' FAUX':' juste'):' non jugé'));
    res.lost=[...base.values()].filter(x=>!cur.has(k(x))).map(x=>k(x)+(x.judged?(x.wrong?' FAUX':' juste'):' non jugé'));
    res.changed=[...cur.values()].filter(x=>base.has(k(x))).map(x=>[x,base.get(k(x))]).filter(([x,b])=>x.stage!==b.stage||(x.judged&&b.judged&&(x.wrong!==b.wrong||Math.abs(x.worstMm-b.worstMm)>1)))
      .map(([x,b])=>k(x)+' '+b.stage+'→'+x.stage+(x.judged&&b.judged?' '+b.worstMm+'→'+x.worstMm+' mm'+(x.wrong!==b.wrong?(x.wrong?' DEVIENT FAUX':' DEVIENT JUSTE'):''):''));}
  out[n]=res;}
console.log(JSON.stringify(out,null,1).slice(0,4000));
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
