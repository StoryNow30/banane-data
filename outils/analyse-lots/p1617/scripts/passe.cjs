const fs=require('fs');const R=process.env.S+'/p1617/';
for(const p of [16,17]){
const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const ms=e=>Date.parse(e.timestamp);
console.log('##### partie',p);
const pe=ev.filter(e=>/^passe-differes/.test(e.type));
console.log('types passe:',JSON.stringify(pe.reduce((a,e)=>{a[e.type]=(a[e.type]||0)+1;return a;},{})));
console.log('fin:',JSON.stringify(pe.filter(e=>e.type==='passe-differes-ombre-fin').map(e=>({mode:e.mode,ecritureDemandee:e.ecritureDemandee,differes:e.differes,posees:e.posees,cuts:e.cuts,ms:e.ms,t:e.timestamp}))));
console.log('champs ecriture/ecritsPasse présents?',pe.some(e=>'ecriture' in e),pe.some(e=>'ecritsPasse' in e),'passe-differes-ecriture:',ev.filter(e=>e.type==='passe-differes-ecriture').length,' ecritureDemandee vrai:',pe.filter(e=>e.ecritureDemandee===true).length);
// aucun événement portant un lot de passe sur une validation
console.log('validations portant "passe":',ev.filter(e=>(e.type==='validation-accepted'||e.type==='validation-intent')&&(e.source==='passe'||e.passe||e.origine==='passe')).length);
const t0=ms(ev.find(e=>e.type==='batch-started'));const tr0=ms(ev.find(e=>e.type==='relecture-debut')),tr1=ms(ev.find(e=>e.type==='relecture-fin'));
const stop=ms(ev.find(e=>e.type==='batch-stopped-at-end'));
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write'&&ms(e)>=stop-1000&&ms(e)<=tr1+5000);
for(const c of (p===17?[5183,5962]:[])){console.log('écritures sur la ligne',c,JSON.stringify(W.filter(e=>e.rowIndex===c).map(e=>[e.timestamp.slice(11,23),e.status,Object.keys(e.body||{}).join('+')])));}
// toutes écritures 'valid' entre fin de lot et début de relecture
const wv=W.filter(e=>e.body&&e.body.ExtractionStatus==='valid'&&ms(e)<tr0);console.log('écritures valid entre arrêt-1 s et relecture:',JSON.stringify(wv.map(e=>[e.timestamp.slice(11,23),e.rowIndex,e.status])));
}
