const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path');
const S=process.argv[2],ROOT=require('path').resolve(process.env.BANANE||'.');
const pilote=JSON.parse(fs.readFileSync(S+'/shots/pilote.json'));
const now=Date.now(),iso=ms=>new Date(ms).toISOString();
let t=now-40*1000*11;const visits=[];const labels=['VALIDATE_NO_MOVEMENT','VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_BOTH','VALIDATE_NO_MOVEMENT','VALIDATE_CORRECTED_LEFT_ONLY'];
for(let i=0;i<42;i++){const d=(6+((i*37)%13)+(i%9===0?9:0))*1000;visits.push({visitId:'v'+i,visitIndex:i,identity:{part:34,cut:8414+i},startedAt:iso(t),endedAt:i<41?iso(t+d-300):null,label:i<41?labels[i%5]:null});t+=d;}
const natif={native:{status:'RUNNING',visits,incomplete:[]},current:{identity:{part:34,cut:8455}},connection:{status:'ready'}};
const ident={pageId:'p',part:34,cut:8455,shape:'U50',frameId:'f'};
const assiste={mode:'assisted',current:{identity:ident},before:{identity:ident,rails:{}},connection:{status:'ready'},
  proposal:{id:'x',identity:ident,rails:{left:{delta:[0,.0034,-.0012],confidence:82,reasons:['Flanc interne net.']},right:{delta:[0,.0021,-.0008],confidence:77,reasons:['Flanc interne net.']}}},
  assistGauge:{proposalId:'x',mm:1438.2,gaugeClass:'NOMINAL',admissible:true,contract:{lowMm:1405,maximumMm:1470}}};
const health={cloudsStored:184,visits:187,bytesStored:44.7*1048576,bytesPending:0,watermark:36*1048576,segments:0,cloudsExported:0,captureCompleted:184,captureFailed:0,queueDepth:0,dropped:0,degradationLevel:'FULL',degradationPeak:'FULL',setAside:0,refused:0,setAsideItems:[],
  quality:{railsObserved:368,railsQualified:362,railQualifiedRate:98,snapshotsTotal:368,snapshotsQualified:362,qualifiedRate:98,clipDropRate:12,faceKept:300,faceDropped:20,faceDropRate:6,exclusionReasons:{}}};
(async()=>{const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [nom,hash,state,theme] of [['pilote-sombre','automatic',pilote,'dark'],['pilote-clair','automatic',pilote,'light'],['natif-sombre','native',natif,'dark'],['assiste-sombre','assisted',assiste,'dark'],['accueil-sombre','home',{},'dark']]){
  const ctx=await browser.newContext({viewport:{width:420,height:880},deviceScaleFactor:2,colorScheme:theme});const page=await ctx.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.addInitScript(({state,health})=>{window.chrome={runtime:{connect:()=>({onMessage:{addListener(){}},onDisconnect:{addListener(){}}}),
    sendMessage:async m=>{const a=m.action;return {result:a==='view'?state:a==='list-tabs'?[{id:1,title:'ESV'}]:a==='native-health'?health:a==='brain-state'?{actif:false}:a==='bandeau-etat'?{on:true}:{}};}}};},{state,health});
  await page.goto('file://'+ROOT+'/panel.html#'+hash);await page.waitForTimeout(3200);
  await page.screenshot({path:`${S}/shots/${nom}.png`,fullPage:false});
  const h=await page.evaluate(()=>document.documentElement.scrollHeight);
  console.log(nom,'hauteur',h,'erreurs',errs.length?errs.join(' | '):'aucune');await ctx.close();}
 await browser.close();})();
