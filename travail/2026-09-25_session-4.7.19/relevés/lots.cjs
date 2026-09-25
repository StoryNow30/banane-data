const fs=require('fs');
for(const f of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(f));const o=d.observations.slice().sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp)));
 const byPart={};for(const x of o){(byPart[x.identity?.part]||=[]).push(x);}
 for(const [p,arr] of Object.entries(byPart)){const seen=new Set(),u=arr.filter(x=>{const k=x.identity.cut;if(seen.has(k))return false;seen.add(k);return true;});
  const cuts=u.map(x=>x.identity.cut).sort((a,b)=>a-b);let runs=1;for(let i=1;i<cuts.length;i++)if(cuts[i]!==cuts[i-1]+1)runs++;
  const t={};for(const x of u){const l=x.lotObservation;const k=l?(l.stage+(l.reason?':'+l.reason:'')):'(pas de décision lot)';t[k]=(t[k]||0)+1;}
  console.log(f.split('/').slice(-3).join('/'),'partie',p,'version',d.version,'cuts',u.length,'suites',runs,'cuts/suite',(u.length/runs).toFixed(1),JSON.stringify(t));}}
