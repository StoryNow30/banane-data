// Compare les listes d'ESV (avant/après) aux événements: lot (déplacement), relecture (corrigés).
const fs=require('fs');const R=process.env.S+'/p182019/';
const LM=require(R+'tree/src/liste-memoire.js');
const part=+process.argv[2];
const dl=f=>fs.readdirSync(R+'data/'+f).filter(x=>/liste/.test(x)).map(x=>R+'data/'+f+'/'+x)[0];
const A=LM.decompacter(JSON.parse(fs.readFileSync(dl('lot'+part),'utf8')));
const E=LM.decompacter(JSON.parse(fs.readFileSync(dl('echo'+part),'utf8')));
const pose=(L,c)=>{const o=6*c;const v=L.ed.slice(o,o+6);return v.some(x=>x==null)?null:v;};
const d3=(a,b,o)=>Math.hypot(a[o]-b[o],a[o+1]-b[o+1],a[o+2]-b[o+2])/10;
const worst=(a,b)=>a&&b?Math.max(d3(a,b,0),d3(a,b,3)):null;
const stc=L=>{const c={};for(const s of L.st){c[s]=(c[s]||0)+1;}return c;};
console.log('liste lot: lignes',A.st.length,'statuts',JSON.stringify(stc(A)),'| liste écho: lignes',E.st.length,JSON.stringify(stc(E)));
let diff=[];for(let c=0;c<Math.min(A.st.length,E.st.length);c++){const w=worst(pose(A,c),pose(E,c));if(w!=null&&w>0.05||A.st[c]!==E.st[c])diff.push([c,A.st[c],E.st[c],w&&+w.toFixed(1)]);}
console.log('cuts qui diffèrent entre les deux listes',diff.length);
console.log(JSON.stringify(diff.slice(0,200)));
