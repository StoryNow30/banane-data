const fs=require('fs');const R=process.env.S+'/p182019/';
for(const p of (process.env.PARTS||"18").split(",").map(Number)){
 const jo=JSON.parse(fs.readFileSync(R+'res/jo'+p+'-regle.json','utf8'));
 const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
 const j=JSON.parse(fs.readFileSync(jf,'utf8'));
 const rel={};const bsA=j.events.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);const B=bsA[bsA.length-1].batch.id;
 for(const e of j.events) if(e.type==='relecture-ombre'&&e.batchId===B) rel[e.identity.cut]=e;
 const lotc=new Set(j.events.filter(e=>e.type==='gcv1-shadow-observed'&&e.batchId===B).map(e=>e.identity.cut));
 console.log('##### partie',p);
 const H=jo.table.filter(r=>r.classe==='hors-journal'&&!(r.cut in rel&&rel[r.cut].action==='corrige'));
 const withRef=H.filter(r=>r.referenceHumaine==='observee');
 const big=withRef.filter(r=>r.ecartHumain&&r.ecartHumain.maxDist3dMm>5);
 console.log('hors-journal (cuts non ciblés, hors 27/…corrigés par relecture): visités',H.length,'avec référence',withRef.length,'dont validations observées',withRef.filter(r=>!(r.visiteSansAction&&r.visiteSansAction.appliquee)).length,'; corrigés par l\'opérateur >5 mm:',big.length,' >10:',withRef.filter(r=>r.ecartHumain.maxDist3dMm>10).length,' >20:',withRef.filter(r=>r.ecartHumain.maxDist3dMm>20).length);
 for(const r of big){const e=rel[r.cut];console.log('  ',r.cut,r.ecartHumain.maxDist3dMm.toFixed(1)+' mm',r.etiquetteEcho,'| relu?',!!e,e?(e.action+'/'+e.verdict+' pireMm '+e.pireMm+' zone '+e.zone):'(non relu : hors plages)');}
 const jc=Object.values(rel).filter(e=>e.action!=='corrige'&&e.verdict==='je corrigerais');
 console.log('relus notés « je corrigerais » sans écriture:',jc.length);
 for(const e of jc){const r=jo.table.find(x=>x.cut===e.identity.cut);const eh=r&&r.ecartHumain?r.ecartHumain.maxDist3dMm:null;console.log('  ',e.identity.cut,'zone',e.zone,'role',e.role,'pireMm proposé',e.pireMm,'raison',(e.raisonAction||e.raison||'').slice(0,70),'| opérateur:',r?(r.referenceHumaine==='observee'?(eh!=null?eh.toFixed(1)+' mm ('+r.etiquetteEcho+')':'?'):'sans réf ('+(r.visiteSansAction&&r.visiteSansAction.raison)+')'):'non visité');}
}
