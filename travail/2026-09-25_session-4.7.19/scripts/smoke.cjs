const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [ext,profile]=process.argv.slice(2);
 const ctx=await chromium.launchPersistentContext(profile,{headless:false,args:['--headless=new',`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 let [sw]=ctx.serviceWorkers();if(!sw)sw=await ctx.waitForEvent('serviceworker',{timeout:20000});
 console.log(JSON.stringify(await sw.evaluate(()=>({version:globalThis.BananeCore3.VERSION,pairGuard:globalThis.BananeLotDecision.DEFAULTS.pairGuard,chainMm:globalThis.BananeLotDecision.DEFAULTS.chainMm,gaugeGuardMm:globalThis.BananeLotDecision.DEFAULTS.gaugeGuardMm,minTop:globalThis.BananeLotDecision.DEFAULTS.minTop,v:globalThis.BananeLotDecision.DEFAULTS.version,anchorRule:globalThis.BananeLotDecision.DEFAULTS.anchorRule,promote:typeof globalThis.BananeLotDecision.promoteAnchors,crossing:globalThis.BananeLotDecision.DEFAULTS.crossing,framed:globalThis.BananeLotDecision.DEFAULTS.framed,reader:typeof globalThis.BananeLevelCrossing?.read,offsets:[globalThis.BananeLevelCrossing?.DEFAULTS.lateralOffsetMm,globalThis.BananeLevelCrossing?.DEFAULTS.verticalOffsetMm]}))));
 const id=sw.url().split('/')[2];
 for(const [vue,scheme] of [['automatic','light'],['automatic','dark'],['native','light']]){const page=await ctx.newPage();await page.emulateMedia({colorScheme:scheme});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:560,height:820});await page.goto(`chrome-extension://${id}/panel.html#${vue}`);await page.waitForTimeout(1500);
  const r=await page.evaluate(async()=>{await document.fonts.ready;return {brand:document.querySelector('.brand').textContent,inter:document.fonts.check('13px Inter'),
    font:getComputedStyle(document.body).fontFamily.split(',')[0],bg:getComputedStyle(document.body).backgroundColor,
    primary:[...document.querySelectorAll('.actions .primary')].filter(b=>!b.hidden).map(b=>b.textContent),etat:document.getElementById('lot-etat')?.textContent,reprise:!!document.getElementById('lot-reprise'),gcv1Export:typeof globalThis.BananeGCV1Export?.buildDiagnostic};});
  await page.screenshot({path:`${vue}-${scheme}.png`});console.log(vue,scheme,JSON.stringify(r),errors.length?errors:'sans erreur');await page.close();}
 await ctx.close();})().catch(e=>{console.error(e);process.exit(1);});
