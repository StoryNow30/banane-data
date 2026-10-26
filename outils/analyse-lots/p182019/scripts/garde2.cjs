// Différés d'une partie : passe en ombre, garde A (module du worktree), pose finale de l'opérateur.
// Usage: PARTS=18 node garde2.cjs   (lit data/lot<p>/journal, res/jo<p>-regle.json si présent, res/lot<p>-cuts.json)
const fs=require('fs');const S=process.env.S;const R=S+'/p182019/';
const G=require(S+'/wt/gardeA/src/garde-passe-appuis.js');
const NORMAL=new Set(['first-pass','window','choice']);
const out={};
for(const p of (process.env.PARTS||'18').split(',').map(Number)){
  const jf=fs.readdirSync(R+'data/lot'+p).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+p+'/'+x)[0];
  const j=JSON.parse(fs.readFileSync(jf,'utf8'));
  const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
  const ms=e=>Date.parse(e.timestamp);
  // lot de la partie p
  const bsAll=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===p);
  const bs=bsAll[bsAll.length-1];const B=bs.batch.id;const t0=ms(bs);
  const stop=ev.find(e=>e.type==='batch-stopped-at-end'&&ms(e)>t0);
  const rd=ev.find(e=>e.type==='relecture-debut'&&e.batchId===B);const tr0=ms(rd);
  const dec={};for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B) dec[e.identity.cut]=e;
  const stageOf=c=>{const lo=dec[c].lotObservation||{},cmd=lo.command||{};return (lo.stage==='deferred'&&cmd.action==='lot'&&cmd.l1s==='gcv2')?'gcv2-lot':lo.stage;};
  const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write'&&e.status>=200&&e.status<300&&e.body&&e.body.ExtractionStatus==='valid'&&e.body.TreatedByOperator===true&&ms(e)>=t0&&ms(e)<tr0);
  const posed=new Set(W.map(e=>e.rowIndex).filter(c=>c in dec));
  const cuts=Object.keys(dec).map(Number);
  const differes=cuts.filter(c=>!posed.has(c)).sort((a,b)=>a-b);
  const normaux=cuts.filter(c=>posed.has(c)&&NORMAL.has(stageOf(c)));
  const gcv2=cuts.filter(c=>posed.has(c)&&stageOf(c)==='gcv2-lot');
  let T={};const jp=R+'res/jo'+p+'-regle.json';
  if(fs.existsSync(jp)){for(const r of JSON.parse(fs.readFileSync(jp,'utf8')).table)T[r.cut]=r;}
  const pe=ev.filter(e=>e.type==='passe-differes-ombre'&&e.batchId===B);
  console.log('##### partie',p,'lot',B.slice(0,8),'cibles',cuts.length,'posés',posed.size,'différés',differes.length,'| appuis normaux (posés chaîne normale/fenêtre/choix)',normaux.length,'| GCV2 dans le lot posés',gcv2.length);
  const res=[];
  for(const c of differes){
    const evs=pe.filter(e=>e.identity.cut===c);const e1=evs[0];
    const pr={cut:c,passes:evs.map(e=>({passe:e.passe,decision:e.decision,motif:e.motif||null}))};
    const l1=e1&&e1.l1;
    pr.motifsDiffere=(()=>{const m=T[c]&&T[c].motifDiffere;return m?[m.gauche&&m.gauche.motif,m.droite&&m.droite.motif]:null;})();
    pr.zone=l1&&l1.zone;pr.ecartDepartMoteur=l1&&l1.ecartDepartMm;pr.p=l1&&l1.p;pr.tau=l1&&l1.tau;pr.hyp=l1&&l1.hypothese;
    const ppos=evs.find(e=>e.decision==='poserait');
    const near=normaux.map(x=>({cut:x,etape:stageOf(x),d:Math.abs(x-c)})).filter(x=>x.d>0).sort((a,b)=>a.d-b.d)[0];
    pr.appuiNormal=near;
    const nearAny=[...posed].map(x=>({cut:x,etape:stageOf(x),d:Math.abs(x-c)})).sort((a,b)=>a.d-b.d)[0];
    pr.appuiTous=nearAny;
    const h=T[c]&&T[c].ecartHumain;
    if(h){pr.operateurDepuisDepart={G:[h.gauche.longitudinalMm,h.gauche.lateralMm,h.gauche.verticalMm],D:[h.droite.longitudinalMm,h.droite.lateralMm,h.droite.verticalMm],pire3d:h.maxDist3dMm,latMax:Math.max(Math.abs(h.gauche.lateralMm),Math.abs(h.droite.lateralMm)),etiquette:T[c].etiquetteEcho,visites:T[c].visitesEcho,reference:T[c].referenceHumaine};}
    if(ppos){
      const g=G.juger({cut:c,decal:ppos.decal,cutsNormaux:normaux});
      pr.poserait={decal:ppos.decal,deplacementMm:g.deplacementMm,garde:g.bloque?'BLOQUE':'laisse passer',motifGarde:g.motif,appuiNormalCuts:g.appuiNormalCuts};
      if(h){const m={left:pr.operateurDepuisDepart.G,right:pr.operateurDepuisDepart.D};
        const er=s=>Math.hypot(...ppos.decal[s].map((v,i)=>v-m[s][i]));
        pr.poserait.ecartOperateurG=er('left');pr.poserait.ecartOperateurD=er('right');pr.poserait.ecartOperateurPire=Math.max(er('left'),er('right'));
        pr.poserait.latMax=Math.max(Math.abs(ppos.decal.left[1]-m.left[1]),Math.abs(ppos.decal.right[1]-m.right[1]));
        pr.poserait.gainVsDepart=pr.operateurDepuisDepart.pire3d-pr.poserait.ecartOperateurPire;}
    }
    if(l1&&l1.test13&&l1.test13.paire&&h){const d=l1.test13.paire;const m={left:pr.operateurDepuisDepart.G,right:pr.operateurDepuisDepart.D};const er=s=>Math.hypot(...d[s].map((v,i)=>v-m[s][i]));pr.test13PaireEcart={G:er('left'),D:er('right')};}
    res.push(pr);
    console.log(JSON.stringify(pr));
  }
  // synthèse
  const pos=res.filter(r=>r.poserait);
  const J=h=>h.poserait.ecartOperateurPire;
  console.log('"poserait" (au moins une passe):',pos.length,'sur',res.length,'différés');
  if(Object.keys(T).length){
    const vrai=pos.filter(r=>J(r)<=10),faux=pos.filter(r=>J(r)>10);
    console.log(' sans garde: juste (<=10 mm) =',vrai.length,'; fausse (>10) =',faux.length,'; >20 =',pos.filter(r=>J(r)>20).length,'; >50 =',pos.filter(r=>J(r)>50).length,'; mauvaise voie (lat>100) =',pos.filter(r=>r.poserait.latMax>100).length);
    const pass=pos.filter(r=>r.poserait.garde==='laisse passer');
    console.log(' avec garde A: poses conservées',pass.length,'(juste',pass.filter(r=>J(r)<=10).length,', fausse',pass.filter(r=>J(r)>10).length,') ; bloquées',pos.length-pass.length,'(justes perdues',pos.filter(r=>r.poserait.garde==='BLOQUE'&&J(r)<=10).length,', fausses évitées',pos.filter(r=>r.poserait.garde==='BLOQUE'&&J(r)>10).length,')');
  }
  out[p]=res;
}
fs.writeFileSync(R+'res/garde-'+(process.env.PARTS||'18').replace(/,/g,'-')+'.json',JSON.stringify(out,null,1));
