const fs=require('fs');
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
console.log('keys',Object.keys(j).join(','), 'n events',j.events.length, 'first',ev[0].timestamp,'last',ev.at(-1).timestamp);
const cnt={};for(const e of ev){cnt[e.type]=(cnt[e.type]||0)+1;}
console.log(Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(x=>x.join(':')).join(' | '));
const show=/^(batch-|passe-differes|lot-|relecture-(debut|fin|started|done))/;
for(const e of ev) if(show.test(e.type)||/batch-(started|stopped|state)/.test(e.type)) console.log(e.timestamp,e.type,JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>!['timestamp','type'].includes(k)))).slice(0,300));
console.log('transitionsLot',JSON.stringify((j.transitionsLot||[]).filter(t=>t.nom!=='cut-suivant')).slice(0,3000));
console.log('state.batch',JSON.stringify(j.state&&j.state.batch).slice(0,800));
