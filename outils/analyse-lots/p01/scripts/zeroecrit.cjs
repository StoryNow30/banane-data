// Vérifie que la passe n'a écrit aucune ligne différée : écritures (tout statut) sur les lignes différées, de l'arrêt du lot à la fin de la relecture.
const fs=require('fs');const R=process.env.S+'/p01/';
const p=+process.argv[2];const diff=process.argv[3].split(',').map(Number);
const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));const ms=e=>Date.parse(e.timestamp);
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);const bs=bsA[bsA.length-1];const B=bs.batch.id;
const t0=ms(bs),stop=ms(ev.find(e=>e.type==='batch-stopped-at-end'&&ms(e)>t0));
const rd=ev.find(e=>e.type==='relecture-debut'&&e.batchId===B),rf=ev.find(e=>e.type==='relecture-fin'&&e.batchId===B);
const fin=ev.find(e=>e.type==='passe-differes-ombre-fin'&&e.batchId===B);
console.log('partie',p,'passe-fin',fin&&fin.timestamp.slice(11,23),'mode',fin&&fin.mode,'ecritureDemandee',fin&&fin.ecritureDemandee,'ms',fin&&fin.ms,'| apres arrêt',fin&&((ms(fin)-stop)/1e3).toFixed(3),'s');
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write'&&ms(e)>=t0&&ms(e)<=ms(rf)+3000);
for(const c of diff){const w=W.filter(e=>e.rowIndex===c);console.log(' ligne',c,'écritures observées (lot→fin relecture):',w.length,JSON.stringify(w.map(e=>[e.timestamp.slice(11,23),e.status,Object.keys(e.body||{}).join('+')])));
 const r=ev.filter(e=>e.type==='relecture-ombre'&&e.batchId===B&&e.identity.cut===c).map(e=>[e.action,e.verdict,e.erreurCapture&&String(e.erreurCapture).slice(0,60),e.arrivee]);console.log('   relecture:',JSON.stringify(r));}
const wp=W.filter(e=>ms(e)>stop-1000&&ms(e)<ms(rd));console.log(' écritures entre arrêt-1 s et début de relecture (toutes lignes):',JSON.stringify(wp.map(e=>[e.timestamp.slice(11,23),e.rowIndex,e.status,e.body&&e.body.ExtractionStatus])));
console.log(' types passe-differes-* dans le lot:',JSON.stringify(ev.filter(e=>/^passe-differes/.test(e.type)&&e.batchId===B).reduce((a,e)=>{a[e.type]=(a[e.type]||0)+1;return a},{})),'événement passe-differes-ecriture:',ev.filter(e=>e.type==='passe-differes-ecriture').length);
console.log(' finsLot ecritsPasse pour ce lot:',JSON.stringify((j.finsLot||[]).filter(f=>f.batchId===B).map(f=>({ecritsPasse:f.ecritsPasse,differes:f.differes,poses:f.poses,dureeMs:f.dureeMs}))));
