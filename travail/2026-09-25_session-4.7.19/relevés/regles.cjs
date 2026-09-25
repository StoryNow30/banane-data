const path='/home/user/banane/';const A=require(path+'tools/acceptance-report.cjs');
const fs=require('fs');const dir=__dirname;
const diag=JSON.parse(fs.readFileSync(dir+'/banane-gcv1-diagnostic-1790320226315.json'));
const clouds=[];for(const f of ['seg01','seg02']){const c=JSON.parse(fs.readFileSync(dir+`/banane-gcv1-corpus-2026-09-25T07-10-29-${f}.json`));clouds.push(...c.clouds);}
const NE=require(path+'src/native-export.js');
const obs=diag.observations.filter(o=>o.identity.part===Number(process.argv[2]||3));
const tally=(out)=>{const t={};for(const r of out){const d=r.decision;const k=d?(d.stage+(d.reason?':'+d.reason:'')):'none';t[k]=(t[k]||0)+1;}return t;};
for(const v of ['4.7.12','4.7.14','4.7.18']){const rules=A.rulesFor(v);
  const out=A.replayLot(obs,{clouds},{options:rules,anchorRule:rules.anchorRule,mode:'apply'});
  const t=tally(out);const placed=out.filter(r=>r.decision&&r.decision.stage!=='deferred'&&r.decision.stage!=='no-capture'&&r.decision.positions).length;
  console.log(v,JSON.stringify(rules),'\n  décidés',placed,'/',out.length,JSON.stringify(t));}
