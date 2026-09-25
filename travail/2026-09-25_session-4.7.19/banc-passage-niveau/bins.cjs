const fs=require('fs'),X=require('/home/user/banane/src/level-crossing.js');
const cut=+process.argv[3],side=process.argv[4];let c;
for(const f of fs.readdirSync(process.argv[2]).filter(f=>f.includes('corpus'))){const k=JSON.parse(fs.readFileSync(process.argv[2]+'/'+f)).clouds.find(c=>c.cut===cut);if(k)c=k;}
const pts=c.pointsSceneRelative.filter((_,i)=>c.visibleByClipBoxes[i]===true),cap={rails:c.rails,pointsSceneRelative:pts};
console.log(JSON.stringify(X.edgeOf(cap,side)));
const f=X.frameOf(cap,side),bins=new Map();for(const p of pts){const {along,lat,z}=f.local(p);if(Math.abs(along)>0.5)continue;const b=Math.floor(lat*1000/2);(bins.get(b)||bins.set(b,[]).get(b)).push(z*1000);}
const med=v=>{const s=v.slice().sort((a,b)=>a-b);return s[s.length>>1];};
const o=[];for(let b=0;b<=50;b++){const v=bins.get(b)||[];o.push(`${b*2}:${v.length?Math.round(med(v)):'-'}`);}console.log(o.join(' '));
