const fs=require('fs'),X=require('/home/user/banane/src/level-crossing.js');
const cut=+process.argv[3],side=process.argv[4];const clouds=[];
for(const f of fs.readdirSync(process.argv[2]).filter(f=>f.includes('corpus')))clouds.push(...JSON.parse(fs.readFileSync(process.argv[2]+'/'+f)).clouds.filter(c=>c.cut===cut));
const c=clouds[0],vis=c.visibleByClipBoxes,pts=c.pointsSceneRelative.filter((_,i)=>vis[i]===true);
const f=X.frameOf(c,side),bins=new Map();
for(const p of pts){const {along,lat,z}=f.local(p);if(Math.abs(along)>0.5)continue;const b=Math.floor(lat*1000/5);(bins.get(b)||bins.set(b,[]).get(b)).push(z*1000);}
const med=v=>{const s=v.slice().sort((a,b)=>a-b);return s[s.length>>1];};
const out=[];for(let b=-30;b<=30;b++){const v=bins.get(b)||[];out.push(`${b*5}:${v.length?Math.round(med(v)):'-'}(${v.length})`);}
console.log(out.join(' '));
const allb=new Map();for(const p of c.pointsSceneRelative){const {along,lat,z}=f.local(p);if(Math.abs(along)>0.5)continue;const b=Math.floor(lat*1000/5);(allb.get(b)||allb.set(b,[]).get(b)).push(z*1000);}
const o2=[];for(let b=-30;b<=30;b++){const v=allb.get(b)||[];o2.push(`${b*5}:${v.length?Math.round(med(v)):'-'}(${v.length})`);}console.log('TOUS',o2.join(' '));
