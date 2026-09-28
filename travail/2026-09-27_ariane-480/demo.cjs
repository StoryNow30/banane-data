#!/usr/bin/env node
'use strict';
/*
 * demo.cjs — le menu d'Ariane 4.8.0, pour la confirmation de la direction :
 * accueil, Écho en collecte, Orbite en cours sur le vrai lot 4.7.20 de la
 * partie 12 (journal du 26/09), nouveau lot aux bornes remplies. Captures
 * fixes (clair et sombre) et une vidéo de parcours du menu. Contrôle aussi,
 * dans Chromium, que « Tout télécharger pour l'analyse » produit quatre
 * fichiers.
 *
 *   node demo.cjs JOURNAL.json SORTIE/   (ARIANE=/chemin/vers/banane)
 */
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path');
const [journal,out]=process.argv.slice(2),ROOT=path.resolve(process.env.ARIANE||'/home/user/banane');
const b0=JSON.parse(fs.readFileSync(journal)).state.batch;fs.mkdirSync(out,{recursive:true});
const seq=b0.sequence,num=x=>Number(x?.cut??x?.identity?.cut);
const proc=[...new Map(b0.processed.map(p=>[num(p),p]))],def=[...new Map(b0.deferred.map(d=>[num(d),d]))];
/* Écho : 42 visites simulées, temps par cut variés. */
const now=Date.now(),iso=ms=>new Date(ms).toISOString();let t=now-40*1000*11;const visits=[];
const LABELS=['VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_BOTH','VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_LEFT_ONLY','VALIDATE_NO_MOVEMENT'];
for(let i=0;i<42;i++){const d=(6+((i*37)%13)+(i%9===0?9:0))*1000;visits.push({visitId:'v'+i,visitIndex:i,identity:{part:34,cut:8414+i},startedAt:iso(t),endedAt:i<41?iso(t+d-300):null,label:i<41?LABELS[i%5]:null});t+=d;}
const echo={native:{status:'RUNNING',visits,incomplete:[]},current:{identity:{part:34,cut:8455}},connection:{status:'ready'}};
function init({b0,seq,proc,def,echo,debut,fige,fin}){const t0=Date.now(),P=new Map(proc),D=new Map(def);
  const orbite=()=>{const tick=fige?debut*3:Math.floor((Date.now()-t0)/467),k=Math.min(debut+Math.floor(tick/3),seq.length-1),step=['capture','apply','validate'][tick%3];
    /* `fin` (audit qualité) : le lot arrêté à sa borne, tel qu'exporté. */
    const faits=fin?seq.map(s=>s.identity.cut):seq.slice(0,k).map(s=>s.identity.cut);
    const batch={...b0,state:fin?b0.state:'RUNNING',step,sequence:fin?seq:seq.slice(0,k+1),activeIdentity:fin?b0.activeIdentity:seq[k].identity,
      processed:faits.filter(c=>P.has(c)).map(c=>P.get(c)),deferred:faits.filter(c=>D.has(c)).map(c=>D.get(c)),stoppedAtEnd:fin?b0.stoppedAtEnd:null};
    return {batch,current:{identity:seq[k].identity},connection:{status:'ready'},lastActionEvidence:{commandSent:true,navigationObserved:true,operatorDecision:'VALIDATE',beforeNavigationIdentity:seq[Math.max(0,k-1)].identity}};};
  const vue=()=>location.hash==='#native'?echo:location.hash==='#home'||!location.hash?{connection:{status:'ready'}}:orbite();
  window.chrome={runtime:{connect:()=>({onMessage:{addListener(){}},onDisconnect:{addListener(){}}}),
    sendMessage:async m=>{const a=m.action;return {result:a==='view'?vue():a==='list-tabs'?[{id:1,title:'ESV'}]:a==='bandeau-etat'?{on:false}:
      a==='journal-meta'?{format:'banane-test-journal-v4',version:'4.8.0',state:{batch:b0},stateOmits:['records','incomplete'],closureSummary:{}}:
      a==='dataset-meta'?{format:'banane-test-dataset-v4',version:'4.8.0',exportedAt:new Date().toISOString(),state:{batch:b0},stateOmits:['records','incomplete'],closureSummary:{},cloudIds:[]}:
      a==='gcv1-export-meta'?{version:'4.8.0',sessionId:'demo',state:{batch:b0}}:
      a==='journal'?{format:'banane-test-journal-v4',events:[],records:[]}:a==='dataset'?{format:'banane-test-dataset-v4',state:{batch:b0},events:[],records:[]}:
      a==='gcv1-diagnostic-export'?{format:'banane-gcv1-diagnostic-v1',observationCount:0,observations:[]}:
      a==='gcv1-corpus-export-plan'?{cloudIds:[],missingCaptureIds:[]}:{}};}}};}
(async()=>{const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const bilan=[];
 const page=async(theme,{video=false,debut=40,fige=false,fin=false,scale=2}={})=>{const ctx=await browser.newContext({viewport:{width:420,height:860},deviceScaleFactor:video?1:scale,colorScheme:theme,acceptDownloads:true,
   ...(video?{recordVideo:{dir:out,size:{width:420,height:860}}}:{})});const p=await ctx.newPage();p.errs=[];
   p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>{if(m.type()==='error')p.errs.push(m.text());});
   await p.addInitScript(init,{b0,seq,proc,def,echo,debut,fige,fin});return {ctx,p};};
 /* Captures fixes. */
 for(const theme of ['dark','light']){const n=theme==='dark'?'sombre':'clair';
   let {ctx,p}=await page(theme);await p.goto('file://'+ROOT+'/panel.html#home');await p.waitForTimeout(1500);await p.screenshot({path:`${out}/1-accueil-${n}.png`});
   await p.click('#tab-native');await p.waitForTimeout(2200);await p.screenshot({path:`${out}/2-echo-${n}.png`});
   await p.click('#tab-automatic');await p.waitForTimeout(3200);await p.screenshot({path:`${out}/3-orbite-${n}.png`});
   await p.evaluate(()=>document.getElementById('lot-details').scrollIntoView({block:'start'}));await p.waitForTimeout(500);await p.screenshot({path:`${out}/4-orbite-details-${n}.png`});
   await ctx.close();({ctx,p}=await page(theme,{fin:true}));await p.goto('file://'+ROOT+'/panel.html#automatic');await p.waitForTimeout(2500);
   await p.evaluate(()=>document.getElementById('lot-compteurs').scrollIntoView({block:'start'}));await p.waitForTimeout(500);await p.screenshot({path:`${out}/4b-orbite-fin-${n}.png`});
   bilan.push(`${n} : erreurs ${p.errs.length?p.errs.join(' | '):'aucune'}`);await ctx.close();}
 /* Tout télécharger : quatre fichiers attendus (état simulé, stockage vide). */
 {const {ctx,p}=await page('dark',{fige:true});await p.goto('file://'+ROOT+'/panel.html#automatic');await p.waitForTimeout(1500);
  const noms=[];p.on('download',d=>noms.push(d.suggestedFilename()));await p.click('#export-tout');await p.waitForTimeout(4000);
  bilan.push(`Tout télécharger : ${noms.length} fichier(s) — ${noms.join(', ')} ; message : ${await p.textContent('#export-status')}`);await ctx.close();}
 /* Vidéo : parcours du menu, lot en mouvement. */
 {const {ctx,p}=await page('dark',{video:true,debut:40});await p.goto('file://'+ROOT+'/panel.html#home');await p.waitForTimeout(2500);
  await p.click('#tab-native');await p.waitForTimeout(3500);await p.click('#tab-automatic');await p.waitForTimeout(9000);
  await p.mouse.wheel(0,700);await p.waitForTimeout(2500);await p.mouse.wheel(0,900);await p.waitForTimeout(2500);await p.mouse.wheel(0,-1600);await p.waitForTimeout(2500);
  await p.click('#theme-toggle');await p.waitForTimeout(3500);await p.click('.nom');await p.waitForTimeout(2000);
  bilan.push(`vidéo : erreurs ${p.errs.length?p.errs.join(' | '):'aucune'}`);await ctx.close();}
 await browser.close();
 for(const f of fs.readdirSync(out))if(f.endsWith('.webm')&&f!=='5-parcours-du-menu.webm')fs.renameSync(path.join(out,f),path.join(out,'5-parcours-du-menu.webm'));
 console.log(bilan.join('\n'));
})();
