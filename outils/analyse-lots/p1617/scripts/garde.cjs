const fs=require('fs');const R=process.env.S+'/p1617/';
const J=JSON.parse(fs.readFileSync(R+'res/juge17.json','utf8'));
const jo=JSON.parse(fs.readFileSync(R+'res/jo17-regle.json','utf8'));const T={};for(const r of jo.table)T[r.cut]=r;
const jf=fs.readdirSync(R+'data/lot17').filter(x=>/journal/.test(x)).map(x=>R+'data/lot17/'+x)[0];
const j=JSON.parse(fs.readFileSync(jf,'utf8'));
const pe=j.events.filter(e=>e.type==='passe-differes-ombre');
const NORMAL=new Set(['first-pass','window','choice']);
const stageBy={};for(const r of J) if(r.lot) stageBy[r.cut]=r;
for(const c of [5183,5962]){
  const evs=pe.filter(e=>e.identity.cut===c);
  console.log('=== différé',c,'| passes:',evs.map(e=>`passe ${e.passe}: ${e.decision}${e.motif?' ('+e.motif+')':''}`).join(' ; '));
  const e=evs[0];const l1=e.l1;
  console.log('  zone',l1.zone,'étage chaîne',l1.chaine.stage,'/',l1.chaine.reason,'appuis (utilisés par la passe)',l1.chaine.appuis,'| D (écart départ, pire rail) ',l1.ecartDepartMm,'mm | p',l1.p,'tau',l1.tau,'hyp',l1.hypothese,'motif',l1.motif);
  // appuis normaux : posés du lot en chaîne normale
  const near=Object.values(stageBy).filter(r=>r.pose&&NORMAL.has(r.etape)).map(r=>({cut:r.cut,etape:r.etape,d:Math.abs(r.cut-c)})).sort((a,b)=>a.d-b.d).slice(0,4);
  const near2=Object.values(stageBy).filter(r=>r.pose).map(r=>({cut:r.cut,etape:r.etape,d:Math.abs(r.cut-c)})).sort((a,b)=>a.d-b.d).slice(0,6);
  console.log('  appuis normaux les plus proches',JSON.stringify(near),'| tous posés proches',JSON.stringify(near2));
  const D=l1.ecartDepartMm, dmin=near[0].d;
  console.log('  garde A (D<100 mm ET aucun appui normal à ≤4 cuts => rien) : D<100 =',D<100,'; appui normal ≤4 =',dmin<=4,'=> la garde',(D<100&&!(dmin<=4))?'AURAIT BLOQUÉ (rien)':'ne bloque pas (la pose passerait)');
  const t=T[c];const h=t.ecartHumain;
  console.log('  opérateur (depuis la pose de départ): G',JSON.stringify([h.gauche.longitudinalMm,h.gauche.lateralMm,h.gauche.verticalMm]),'D',JSON.stringify([h.droite.longitudinalMm,h.droite.lateralMm,h.droite.verticalMm]),'pire rail 3D',h.maxDist3dMm,'mm ; étiquette',t.etiquetteEcho,'visites',t.visitesEcho);
  if(e.decal){const d=e.decal;const err=s=>{const m=s==='left'?[h.gauche.longitudinalMm,h.gauche.lateralMm,h.gauche.verticalMm]:[h.droite.longitudinalMm,h.droite.lateralMm,h.droite.verticalMm];return Math.hypot(...d[s].map((v,i)=>v-m[i]));};
    console.log('  « poserait » : décalage G',JSON.stringify(d.left),'D',JSON.stringify(d.right),'; écart à l\'opérateur : G',err('left').toFixed(1),'D',err('right').toFixed(1),'pire',Math.max(err('left'),err('right')).toFixed(1),'mm ; latéral max',Math.max(Math.abs(d.left[1]-h.gauche.lateralMm),Math.abs(d.right[1]-h.droite.lateralMm)).toFixed(1));
    console.log('  pour mémoire, la pose de départ était à',h.maxDist3dMm,'mm de l\'opérateur');
  }
  if(l1.test13&&l1.test13.paire){const d=l1.test13.paire;const m={left:[h.gauche.longitudinalMm,h.gauche.lateralMm,h.gauche.verticalMm],right:[h.droite.longitudinalMm,h.droite.lateralMm,h.droite.verticalMm]};
    const er=s=>Math.hypot(...d[s].map((v,i)=>v-m[s][i]));console.log('  (paire test13 du moteur, non retenue par la décision, écart à l\'opérateur : G',er('left').toFixed(1),'D',er('right').toFixed(1),')');}
}
