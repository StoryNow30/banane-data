// Copie de travail d'un lot sans journal : le diagnostic de session réduit aux observations d'un lot (batchId).
const fs=require('fs'),path=require('path');const [src,dst,batch]=process.argv.slice(2);fs.mkdirSync(dst,{recursive:true});
for(const f of fs.readdirSync(src).filter(f=>f.endsWith('.json'))){const p=path.join(src,f);
  if(/gcv1-diagnostic/.test(f)){const d=JSON.parse(fs.readFileSync(p));d.observations=d.observations.filter(o=>String(o.batchId).startsWith(batch));d.observationCount=d.observations.length;
    d.derivedFrom={file:f,filter:'batchId '+batch,note:'copie de travail : observations d’un seul lot'};fs.writeFileSync(path.join(dst,f),JSON.stringify(d));console.log('diagnostic',d.observations.length);}
  else if(!fs.existsSync(path.join(dst,f)))fs.symlinkSync(p,path.join(dst,f));}
