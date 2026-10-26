const fs=require('fs');const R=process.env.S+'/p182019/';
const jf=fs.readdirSync(R+'data/lot20').filter(x=>/journal/.test(x)).map(x=>R+'data/lot20/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));const ms=e=>Date.parse(e.timestamp);
for(const p of [18,19,20]){
 const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity.part===p);const bs=bsA.at(-1);const B=bs.batch.id;const t0=ms(bs);
 const rd=ev.find(e=>e.type==='relecture-debut'&&e.batchId===B),rf=ev.find(e=>e.type==='relecture-fin'&&e.batchId===B);const stop=ev.find(e=>e.type==='batch-stopped-at-end'&&ms(e)>t0);
 const win=(a,b)=>ev.filter(e=>ms(e)>=a&&ms(e)<=b);
 for(const [nom,a,b] of [['lot',t0,ms(stop)+3000],['relecture',ms(rd),ms(rf)+3000]]){
  const w=win(a,b);
  const bad=w.filter(e=>e.type==='esv-observation'&&e.status!=null&&!(e.status>=200&&e.status<300));
  console.log('partie',p,nom,'réponses non 2xx:',JSON.stringify(bad.map(e=>[e.timestamp.slice(11,23),e.kind,e.method||'',e.status,(e.url||e.path||'').toString().replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>').slice(0,60)])));
  const ar=w.filter(e=>e.type==='adapter-result');console.log('   adapter-result',ar.length,'avec erreur',ar.filter(e=>e.error||e.ok===false).length,'| diag-compteur-bloque',w.filter(e=>e.kind==='diag-compteur-bloque').length,'| capture-abandoned',w.filter(e=>e.type==='capture-abandoned').length,'| clic-hors-vue',w.filter(e=>e.type==='clic-hors-vue').length);
  const kinds=w.filter(e=>e.type==='adapter-result').reduce((a,e)=>{const k=e.command||e.action||e.name||'?';a[k]=(a[k]||0)+1;return a},{});
 }
 const cb=ev.find(e=>e.type==='clic-hors-vue-bilan'&&ms(e)>t0&&ms(e)<ms(rd)+60000);console.log('   bilan clics hors canevas',cb&&cb.total,cb&&JSON.stringify(cb).slice(0,300));
 const rfv=rf;console.log('   relecture-fin: faits',rfv.faits,'corriges',rfv.corriges,'refusees',rfv.refusees,'vus',rfv.vus,'dureeMs',rfv.dureeMs,'ms événements',ms(rf)-ms(rd));
}
