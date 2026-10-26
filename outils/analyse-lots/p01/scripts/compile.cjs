// Compile, pour une partie : les différés cut par cut (passe, garde, opérateur), stats de passe, stats d'Écho. Usage: node compile.cjs <partie>
const fs=require('fs');const S=process.env.S;const R=S+'/p01/';const p=+process.argv[2];
const G=JSON.parse(fs.readFileSync(R+'res/garde-'+p+'.json','utf8'))[p];
const jo=JSON.parse(fs.readFileSync(R+'res/jo'+p+'-regle.json','utf8'));const T={};for(const r of jo.table)T[r.cut]=r;
const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);const B=bsA.at(-1).batch.id;
const pe=ev.filter(e=>e.type==='passe-differes-ombre'&&e.batchId===B);
const f1=x=>x==null?null:Math.round(x*10)/10;
// 1. passe : décisions
const parPasse={};for(const e of pe){const k='passe'+e.passe+':'+e.decision;parPasse[k]=(parPasse[k]||0)+1;}
const motifs={};for(const e of pe){if(e.decision==='rien'){const k='p'+e.passe+':'+(e.motif||'?');motifs[k]=(motifs[k]||0)+1;}}
console.log('décisions passe',JSON.stringify(parPasse),'\nmotifs rien',JSON.stringify(motifs));
const gardeChamp=pe.filter(e=>e.garde).length;console.log('événements passe portant un champ garde',gardeChamp,'dont bloque',pe.filter(e=>e.garde&&e.garde.bloque).length);
// 2. table des différés
const rows=[];
for(const r of G){const t=T[r.cut]||{};const p1=r.passes.find(x=>x.decision==='poserait');
  const ev1=pe.filter(e=>e.identity.cut===r.cut);
  const gr=ev1.find(e=>e.garde);
  const op=r.operateurDepuisDepart||{};
  const cls=!t.dansEcho?'non visité':(t.referenceHumaine==='observee'?((t.visiteSansAction&&t.visiteSansAction.appliquee)?'vu sans geste':((op.pire3d>=1)?'corrigé':'validé tel quel')):'visité sans référence');
  rows.push({cut:r.cut,motifs:(r.motifsDiffere||[]).join('/'),zone:r.zone,decision:p1?'poserait':'rien',motifPasse:p1?null:r.passes.at(-1).motif,passeNum:p1?p1.passe:null,
    D:p1?f1(r.poserait.deplacementMm):null,ecartMoteur:f1(r.ecartDepartMoteur),appui:r.appuiNormal?r.appuiNormal.d:null,appuiEtape:r.appuiNormal&&r.appuiNormal.etape,
    gardeRecalc:p1?(r.poserait.garde+'/'+r.poserait.motifGarde):null,gardeReelle:gr?{bloque:gr.garde.bloque,motif:gr.garde.motif,D:gr.garde.deplacementMm,appui:gr.garde.appuiNormalCuts}:null,
    ecartPoserait:p1?f1(r.poserait.ecartOperateurPire):null,latPoserait:p1?f1(r.poserait.latMax):null,
    visites:t.visitesEcho||0,etiquette:t.etiquetteEcho||null,classeOp:cls,opDepartFinal:f1(op.pire3d),opLat:f1(op.latMax),dwell:t.dureeVisiteS,valids:t.validationsDeLaVisite});}
fs.writeFileSync(R+'res/diff'+p+'-table.json',JSON.stringify(rows,null,1));
for(const r of rows)console.log([r.cut,r.motifs,r.decision,r.motifPasse||'',r.D??r.ecartMoteur+'(m)',r.appui,r.gardeRecalc||'',r.gardeReelle?JSON.stringify(r.gardeReelle):'',r.ecartPoserait??'',r.classeOp,r.etiquette,'v'+r.visites,r.opDepartFinal].join(' | '));
const po=rows.filter(r=>r.decision==='poserait');
console.log('poserait',po.length,'/',rows.length,'| classe op:',JSON.stringify(rows.reduce((a,r)=>{a[r.classeOp]=(a[r.classeOp]||0)+1;return a;},{})));
console.log('poserait écarts:',po.map(r=>r.cut+':'+r.ecartPoserait).join(' '));
console.log('juste ≤20:',po.filter(r=>r.ecartPoserait<=20).length,'fausse >50:',po.filter(r=>r.ecartPoserait>50).length,'entre 20 et 50:',po.filter(r=>r.ecartPoserait>20&&r.ecartPoserait<=50).length,' ≤10:',po.filter(r=>r.ecartPoserait<=10).length,' ≤5:',po.filter(r=>r.ecartPoserait<=5).length);
console.log('écart départ→op (différés) méd/min/max',(()=>{const a=rows.map(r=>r.opDepartFinal).filter(x=>x!=null).sort((x,y)=>x-y);return [a[(a.length-1)>>1],a[0],a.at(-1),a.filter(x=>x>50).length,a.filter(x=>x>100).length,a.length].join('/');})());
console.log('cuts rien: opDepartFinal méd',(()=>{const a=rows.filter(r=>r.decision==='rien').map(r=>r.opDepartFinal).sort((x,y)=>x-y);return a[(a.length-1)>>1]+' ('+a.length+')';})());
console.log('cuts nuage (motif minTop ou input):',rows.filter(r=>/minTop|input/.test(r.motifs)).map(r=>r.cut+':'+r.motifs+':'+r.decision).join(' '));
