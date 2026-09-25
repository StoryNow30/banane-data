const fs=require('fs'),X=require('/home/user/banane/src/level-crossing.js'),G=require('/home/user/banane/src/gauge.js'),C=require('/home/user/banane/vendor/capture-core.js');
const want=new Set(process.argv.slice(3).map(Number));const clouds=[];
for(const f of fs.readdirSync(process.argv[2]).filter(f=>f.includes('corpus')))clouds.push(...JSON.parse(fs.readFileSync(process.argv[2]+'/'+f)).clouds);
for(const c of clouds.filter(c=>want.has(c.cut)).sort((a,b)=>a.cut-b.cut)){
 const vis=c.visibleByClipBoxes,pts=c.pointsSceneRelative.filter((_,i)=>vis?vis[i]===true:true);
 const all=X.read({rails:c.rails,pointsSceneRelative:c.pointsSceneRelative}),r=X.read({rails:c.rails,pointsSceneRelative:pts});
 const g=r.positions?C.distance(r.positions.left,r.positions.right)*1000:null;
 console.log(c.part,c.cut,'pts',c.pointsSceneRelative.length,'vis',pts.length,'flush',r.flushPct,'(tous',all.flushPct+')','ok',r.ok,r.reason||'',JSON.stringify(Object.fromEntries(['left','right'].map(s=>[s,r.edges[s].ok?[r.edges[s].edgeMm,r.edges[s].widthMm,r.edges[s].grooves]:r.edges[s].reason]))),'écart',g&&g.toFixed(1),'| tous:',all.ok,all.reason||'');}
