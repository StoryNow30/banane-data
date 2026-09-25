const fs=require('fs');const files=process.argv.slice(2);const rows=[];
for(const f of files){let c;try{c=JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){continue;}
 for(const k of c.clouds||[]){if(!k.nodes)continue;const s=JSON.stringify(k).length;rows.push({f:f.split('/').slice(-2).join('/'),cut:k.cut,nodes:k.nodes.length,pts:(k.pointsSceneRelative||[]).length,mb:+(s/1048576).toFixed(2),perNodeKB:+(JSON.stringify(k.nodes).length/k.nodes.length/1024).toFixed(1)});}}
rows.sort((a,b)=>b.mb-a.mb);console.log(rows.length);console.log(rows.slice(0,8));
const n=rows.map(r=>r.nodes).sort((a,b)=>a-b);console.log('nodes median',n[n.length>>1],'max',n.at(-1),'p99',n[Math.floor(n.length*.99)]);
const p=rows.map(r=>r.pts).sort((a,b)=>a-b);console.log('pts median',p[p.length>>1],'max',p.at(-1));
