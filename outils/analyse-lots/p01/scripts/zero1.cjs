// Vérifie 0 écriture de la passe (partie sans relecture). Usage: node zero1.cjs <partie> <fichier diff>
const fs=require('fs');const R=process.env.S+'/p01/';const p=+process.argv[2];const diff=fs.readFileSync(R+'res/'+process.argv[3],'utf8').trim().split(',').map(Number);
const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));const ms=e=>Date.parse(e.timestamp);
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);const bs=bsA.at(-1);const B=bs.batch.id;const t0=ms(bs);
const stop=ev.find(e=>e.type==='batch-stopped-at-end'&&ms(e)>t0);const ts=ms(stop);
const pe=ev.filter(e=>/^passe-differes/.test(e.type)&&e.batchId===B);
const fin=pe.find(e=>e.type==='passe-differes-ombre-fin');
console.log('types passe',JSON.stringify(pe.reduce((a,e)=>{a[e.type]=(a[e.type]||0)+1;return a;},{})));
console.log('fin: mode',fin.mode,'ecritureDemandee',fin.ecritureDemandee,'differes',fin.differes,'posees',fin.posees,'cuts',JSON.stringify(fin.cuts),'ms',fin.ms,'à',fin.timestamp.slice(11,23),'(',((ms(fin)-ts)/1e3).toFixed(1),'s après l\'arrêt)');
console.log('passe-differes-ecriture',ev.filter(e=>e.type==='passe-differes-ecriture').length,'ecritureDemandee vrai',pe.filter(e=>e.ecritureDemandee===true).length,'champ ecritsPasse dans finsLot',JSON.stringify((j.finsLot||[]).filter(f=>f.batchId===B).map(f=>({ecritsPasse:f.ecritsPasse,differes:f.differes,poses:f.poses}))));
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write');
const apres=W.filter(e=>ms(e)>ts-1000);
console.log('écritures (tous statuts) depuis arrêt-1 s jusqu\'à la fin du journal:',apres.length,JSON.stringify(apres.map(e=>[e.timestamp.slice(11,23),e.rowIndex,e.status,e.body&&e.body.ExtractionStatus,e.body&&Object.keys(e.body).join('+')])));
for(const c of diff){const w=W.filter(e=>e.rowIndex===c&&ms(e)>=t0);const v=w.filter(e=>e.body&&e.body.ExtractionStatus==='valid');if(v.length)console.log('ALERTE écriture valid sur différé',c,JSON.stringify(v.map(e=>e.timestamp)));}
console.log('écritures de validation (valid) sur les',diff.length,'différés:',diff.reduce((n,c)=>n+W.filter(e=>e.rowIndex===c&&ms(e)>=t0&&e.body&&e.body.ExtractionStatus==='valid').length,0),'| écritures "vu" (SeenByOperator) sur différés:',diff.reduce((n,c)=>n+W.filter(e=>e.rowIndex===c&&ms(e)>=t0&&e.body&&e.body.SeenByOperator&&e.body.ExtractionStatus!=='valid').length,0),'dont après l\'arrêt:',diff.reduce((n,c)=>n+W.filter(e=>e.rowIndex===c&&ms(e)>ts).length,0));
const vp=ev.filter(e=>(e.type==='validation-accepted'||e.type==='validation-intent')&&ms(e)>=t0&&(e.source==='passe'||e.passe||e.origine==='passe')).length;console.log('validations portant "passe"',vp);
console.log('dernier événement du journal',ev.at(-1).timestamp.slice(11,23),ev.at(-1).type);
// poserait avec garde réelle
const pp=pe.filter(e=>e.type==='passe-differes-ombre');
console.log('décisions',JSON.stringify(pp.reduce((a,e)=>{const k='passe'+e.passe+':'+e.decision+(e.motif?'('+e.motif+')':'');a[k]=(a[k]||0)+1;return a;},{})));
console.log('événements avec champ garde',pp.filter(e=>e.garde).length,'bloque',pp.filter(e=>e.garde&&e.garde.bloque).length);
for(const e of pp.filter(e=>e.garde))console.log('  ',e.identity.cut,'passe',e.passe,e.decision,e.motif||'',JSON.stringify(e.garde));
