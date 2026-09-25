const fs=require('fs'),S=__dirname;
const load=n=>['a','b','c','d','e','f'].flatMap(p=>{const f=`${S}/${n}-${p}.json`;return fs.existsSync(f)?require(f).rows:[];});
const A=load('appui-decide'),B=load('appui-pose');
const key=x=>x.source+':'+x.cut,v=x=>x?x.judged?(x.wrong?'faux':'juste'):'non jugé':'—';
const sum=(rows,f=()=>true)=>{const r=rows.filter(f),j=r.filter(x=>x.judged),w=j.filter(x=>x.wrong);return {decides:r.length,juges:j.length,justes:j.length-w.length,faux:w.length,fauxCuts:w.map(x=>key(x)+' ('+x.worstMm+')')};};
const groups={natif:x=>x.kind==='natif',pilote:x=>x.kind==='pilote'&&x.source!=='pilote-p35-4.7.12',p35:x=>x.source==='pilote-p35-4.7.12',relu:x=>x.source!=='pilote-p35-4.7.12'};
const out={};for(const [g,f] of Object.entries(groups))out[g]={decide:sum(A,f),pose:sum(B,f)};
const mA=new Map(A.map(x=>[key(x),x])),mB=new Map(B.map(x=>[key(x),x]));
const keys=[...new Set([...mA.keys(),...mB.keys()])];
const changed=keys.map(k=>({k,a:mA.get(k),b:mB.get(k)})).filter(({a,b})=>!a||!b||a.stage!==b.stage||JSON.stringify(a.anchorsUsed)!==JSON.stringify(b.anchorsUsed)||Math.abs((a.worstMm??0)-(b.worstMm??0))>0.05)
 .map(({k,a,b})=>({cut:k,avant:a?`${a.stage} ${JSON.stringify(a.anchorsUsed)} ${v(a)}${a.worstMm!=null?' '+a.worstMm:''}`:'non décidé',apres:b?`${b.stage} ${JSON.stringify(b.anchorsUsed)} ${v(b)}${b.worstMm!=null?' '+b.worstMm:''}`:'non décidé'}));
out.changed=changed;
console.log(JSON.stringify(out,null,1));
fs.writeFileSync(S+'/compare8.json',JSON.stringify(out,null,1));
