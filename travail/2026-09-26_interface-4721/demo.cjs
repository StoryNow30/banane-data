#!/usr/bin/env node
'use strict';
/*
 * demo.cjs — le panneau 4.7.21 en mouvement, rejoué sur le vrai lot 4.7.20 de
 * la partie 12 (journal du 26/09) : le lot avance d'un cut toutes les 1,4 s,
 * l'étape du cut courant passe capture → pose → validation. Chromium sans
 * écran, API Chrome simulée ; vidéo WebM et captures fixes.
 *
 *   node demo.cjs JOURNAL.json SORTIE/   (BANANE=/chemin/vers/banane)
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path');
const [journal,out]=process.argv.slice(2),ROOT=path.resolve(process.env.BANANE||'/home/user/banane');
const b0=JSON.parse(fs.readFileSync(journal)).state.batch;fs.mkdirSync(out,{recursive:true});
const seq=b0.sequence,num=x=>Number(x?.cut??x?.identity?.cut);
const proc=new Map(b0.processed.map(p=>[num(p),p])),def=new Map(b0.deferred.map(d=>[num(d),d]));
const DEBUT=40;
(async()=>{const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [nom,theme,video] of [['pilote-sombre','dark',true],['pilote-clair','light',false]]){
  const ctx=await browser.newContext({viewport:{width:420,height:860},deviceScaleFactor:video?1:2,colorScheme:theme,...(video?{recordVideo:{dir:out,size:{width:420,height:860}}}:{})});
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.addInitScript(({b0,seq,proc,def,DEBUT})=>{const t0=Date.now(),P=new Map(proc),D=new Map(def);
    const etat=()=>{const tick=Math.floor((Date.now()-t0)/467),k=Math.min(DEBUT+Math.floor(tick/3),seq.length-1),step=['capture','apply','validate'][tick%3];
      const faits=seq.slice(0,k).map(s=>s.identity.cut);
      const batch={...b0,state:'RUNNING',step,sequence:seq.slice(0,k+1),activeIdentity:seq[k].identity,
        processed:faits.filter(c=>P.has(c)).map(c=>P.get(c)),deferred:faits.filter(c=>D.has(c)).map(c=>D.get(c)),stoppedAtEnd:null};
      return {batch,current:{identity:seq[k].identity},connection:{status:'ready'},lastActionEvidence:{commandSent:true,navigationObserved:true,operatorDecision:'VALIDATE',identity:seq[Math.max(0,k-1)].identity}};};
    window.chrome={runtime:{connect:()=>({onMessage:{addListener(){}},onDisconnect:{addListener(){}}}),
      sendMessage:async m=>{const a=m.action;return {result:a==='view'?etat():a==='list-tabs'?[{id:1,title:'ESV'}]:a==='bandeau-etat'?{on:false}:{}};}}};},
    {b0,seq,proc:[...proc],def:[...def],DEBUT});
  await page.goto('file://'+ROOT+'/panel.html#automatic');
  await page.waitForTimeout(3000);await page.screenshot({path:`${out}/${nom}.png`});
  if(video){await page.waitForTimeout(9000);await page.screenshot({path:`${out}/${nom}-apres.png`});}
  console.log(nom,'erreurs :',errs.length?errs.join(' | '):'aucune');await ctx.close();}
 /* Accueil et Natif : vues fixes (état simulé), pour contrôler la mise en page sans l'Assisté. */
 const now=Date.now(),iso=ms=>new Date(ms).toISOString();let t=now-40*1000*11;const visits=[];
 for(let i=0;i<42;i++){const d=(6+((i*37)%13)+(i%9===0?9:0))*1000;visits.push({visitId:'v'+i,visitIndex:i,identity:{part:34,cut:8414+i},startedAt:iso(t),endedAt:i<41?iso(t+d-300):null,label:i<41?['VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_BOTH','VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_LEFT_ONLY'][i%4]:null});t+=d;}
 for(const [nom,hash,state] of [['accueil-sombre','home',{}],['natif-sombre','native',{native:{status:'RUNNING',visits,incomplete:[]},current:{identity:{part:34,cut:8455}},connection:{status:'ready'}}]]){
  const ctx=await browser.newContext({viewport:{width:420,height:860},deviceScaleFactor:2,colorScheme:'dark'});const page=await ctx.newPage();const errs=[];
  page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.addInitScript(state=>{window.chrome={runtime:{connect:()=>({onMessage:{addListener(){}},onDisconnect:{addListener(){}}}),
    sendMessage:async m=>({result:m.action==='view'?state:m.action==='list-tabs'?[{id:1,title:'ESV'}]:{}})}};},state);
  await page.goto('file://'+ROOT+'/panel.html#'+hash);await page.waitForTimeout(3000);await page.screenshot({path:`${out}/${nom}.png`});
  console.log(nom,'erreurs :',errs.length?errs.join(' | '):'aucune');await ctx.close();}
 /* « Nouveau lot » après un lot arrêté (terrain du 26/09, partie 11) : bornes remplies par Banane. */
 {const ident=cut=>({pageId:'p',part:11,cut,shape:'U50',frameId:'f'});
  const state={current:{identity:ident(715)},connection:{status:'ready'},batch:{state:'STOPPED',scope:{part:11,start:556,end:8146,unresolvedPolicy:'defer',lotDecision:'apply',geometryEngine:'geometry-candidate-v1'},
    processed:[],skipped:[],paused:[],interrupted:[],manuallyCompleted:[],deferred:[],sequence:[],activeIdentity:ident(712)}};
  const ctx=await browser.newContext({viewport:{width:420,height:860},deviceScaleFactor:2,colorScheme:'dark'});const page=await ctx.newPage();const errs=[];
  page.on('pageerror',e=>errs.push(e.message));
  await page.addInitScript(state=>{window.chrome={runtime:{connect:()=>({onMessage:{addListener(){}},onDisconnect:{addListener(){}}}),
    sendMessage:async m=>({result:m.action==='view'?state:m.action==='list-tabs'?[{id:1,title:'ESV'}]:m.action==='bornes-partie'?{part:11,last:8146,source:'saisie'}:{}})}};},state);
  await page.goto('file://'+ROOT+'/panel.html#automatic');await page.waitForTimeout(1500);await page.click('#new-batch');await page.waitForTimeout(1200);
  await page.evaluate(()=>document.getElementById('lot-bornes').scrollIntoView({block:'center'}));await page.waitForTimeout(300);
  await page.screenshot({path:`${out}/pilote-nouveau-lot.png`});
  console.log('pilote-nouveau-lot',await page.evaluate(()=>[document.getElementById('start').value,document.getElementById('end').value,document.getElementById('bornes-note').textContent].join(' | ')),'erreurs :',errs.length?errs.join(' | '):'aucune');await ctx.close();}
 await browser.close();
 for(const f of fs.readdirSync(out))if(f.endsWith('.webm')&&f!=='pilote-mouvement.webm')fs.renameSync(path.join(out,f),path.join(out,'pilote-mouvement.webm'));
})();
