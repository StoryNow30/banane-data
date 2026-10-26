const fs=require('fs');
const f=process.argv.slice(2);
for(const x of f){const j=JSON.parse(fs.readFileSync(x,'utf8'));console.log('==',x.split('/').slice(-2).join('/'),'keys',Object.keys(j).join(','));
 for(const k of Object.keys(j)){const v=j[k];if(Array.isArray(v))console.log(' ',k,'array',v.length,v.length&&typeof v[0]==='object'?Object.keys(v[0]).slice(0,25).join(','):'');else if(v&&typeof v==='object')console.log(' ',k,'obj',Object.keys(v).slice(0,25).join(','));else console.log(' ',k,JSON.stringify(v).slice(0,100));}
 const evs=j.events||j.evenements;if(evs){const c={};for(const e of evs){c[e.type]=(c[e.type]||0)+1;}console.log('  event types',JSON.stringify(c));}
}
