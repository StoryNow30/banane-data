const fs=require('fs');const R=process.env.S+'/p1617/';
const LM=require(R+'tree/src/liste-memoire.js');
console.log('timeOrigin',new Date(1792999894775.7).toISOString());
for(const p of [16,17]){
 const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
 const j=JSON.parse(fs.readFileSync(jf,'utf8'));const ev=j.events.filter(e=>e.timestamp);
 const ms=e=>Date.parse(e.timestamp);
 const B=ev.find(e=>e.type==='batch-started').batch.id;
 const cibles=new Set(ev.filter(e=>e.type==='gcv1-shadow-observed'&&e.batchId===B).map(e=>e.identity.cut));
 const rd=ev.find(e=>e.type==='relecture-debut'),rf=ev.find(e=>e.type==='relecture-fin');
 const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write'&&e.status>=200&&e.status<300);
 const val=e=>e.body&&e.body.ExtractionStatus==='valid'&&e.body.TreatedByOperator===true;
 const wr=new Set(W.filter(e=>ms(e)>=ms(rd)&&ms(e)<=ms(rf)+2000&&val(e)).map(e=>e.rowIndex));
 const corr=new Set(ev.filter(e=>e.type==='relecture-ombre'&&e.action==='corrige').map(e=>e.identity.cut));
 console.log(p,'écritures valid relecture =',wr.size,'corrigés',corr.size,'égaux',[...wr].every(c=>corr.has(c))&&wr.size===corr.size);
 // vu writes relecture
 const wv=new Set(W.filter(e=>ms(e)>=ms(rd)&&ms(e)<=ms(rf)+2000&&e.body&&e.body.SeenByOperator&&!val(e)).map(e=>e.rowIndex));
 const relus=new Set(ev.filter(e=>e.type==='relecture-ombre').map(e=>e.identity.cut));
 console.log('  relus',relus.size,'lignes "vu" 2xx',wv.size,'relus sans écriture',[...relus].filter(c=>!wv.has(c)&&!wr.has(c)));
 // relus : chevauchement avec les cibles
 console.log('  relus ∩ cibles',[...relus].filter(c=>cibles.has(c)));
 // rôles / étage des corrigés
 const rl=ev.filter(e=>e.type==='relecture-ombre'&&e.action==='corrige');
 console.log('  corrigés: étage',JSON.stringify(rl.reduce((a,e)=>{a[e.etage]=(a[e.etage]||0)+1;return a;},{})),'zone',JSON.stringify(rl.reduce((a,e)=>{a[e.zone]=(a[e.zone]||0)+1;return a;},{})),'plages',JSON.stringify(rl.reduce((a,e)=>{a[e.plage]=(a[e.plage]||0)+1;return a;},{})));
 console.log('  corrigés cuts',[...corr].sort((a,b)=>a-b).join(','));
 console.log('  verdicts relecture',JSON.stringify(ev.filter(e=>e.type==='relecture-ombre').reduce((a,e)=>{const k=e.action+'/'+e.verdict;a[k]=(a[k]||0)+1;return a;},{})));
 console.log('  écritMm pire rail (corrigés) méd/min/max',(()=>{const a=rl.map(e=>Math.max(...['left','right'].map(s=>Math.hypot(e.ecritMm[s].long,e.ecritMm[s].lat,e.ecritMm[s].vert)))).sort((x,y)=>x-y);return [a[(a.length-1)>>1].toFixed(1),a[0].toFixed(1),a.at(-1).toFixed(1),a.filter(x=>x>20).length,a.filter(x=>x>50).length].join(' / ');})());
 console.log('  relecture-fin',JSON.stringify(rf).slice(150,700));
 // liste: invalides
 const dl=d=>fs.readdirSync(R+'data/'+d).filter(x=>/liste/.test(x)).map(x=>R+'data/'+d+'/'+x)[0];
 const A=LM.decompacter(JSON.parse(fs.readFileSync(dl('lot'+p),'utf8')));
 const E=LM.decompacter(JSON.parse(fs.readFileSync(dl('echo'+p),'utf8')));
 const inv=L=>L.st.map((s,i)=>s===1?i:-1).filter(i=>i>=0);
 console.log('  invalides liste du lot',inv(A).length,'(cibles =',cibles.size+')','égal aux cibles',p===17?(inv(A).length===cibles.size&&inv(A).every(c=>cibles.has(c))):'n/a',' invalides liste Écho',JSON.stringify(inv(E)));
}
