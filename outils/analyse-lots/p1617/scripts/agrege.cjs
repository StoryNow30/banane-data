const fs=require('fs');const R=process.env.S+'/p1617/';
const q=(a,p)=>{a=a.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const at=(a.length-1)*p,lo=Math.floor(at),hi=Math.ceil(at);return a[lo]+(a[hi]-a[lo])*(at-lo);};
const wil=(k,n)=>{if(!n)return null;const z=1.96,p=k/n,d=1+z*z/n,c=p+z*z/(2*n),h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));return +(100*Math.min(1,(c+h)/d)).toFixed(1);};
const f1=x=>x==null?'—':(+x).toFixed(1);
const load=p=>JSON.parse(fs.readFileSync(p==='15'?process.env.S+'/p15/res/juge.json':R+'res/juge'+p+'.json','utf8'));
const NOM={'first-pass':'Chaîne normale',choice:'Choix',crossing:'Passage à niveau',window:'Fenêtre','gcv2-lot':'GCV2 dans le lot'};
function bloc(nom,set){
  const j=set.filter(r=>r.outil3d!=null);const e=j.map(r=>r.outil3d);
  return {nom,posés:set.length,jugés:j.length,validés:j.filter(r=>r.ref==='validation').length,vus:j.filter(r=>r.ref==='visite-sans-action').length,
    med:q(e,.5),p90:q(e,.9),max:e.length?Math.max(...e):null,gt5:e.filter(x=>x>5).length,gt10:e.filter(x=>x>10).length,gt20:e.filter(x=>x>20).length,gt50:e.filter(x=>x>50).length,mv:j.filter(r=>r.lat>100).length,
    nonJugés:set.length-j.length};
}
const pr=b=>`${b.nom.padEnd(18)} posés ${String(b.posés).padStart(3)} | jugés ${String(b.jugés).padStart(3)} (${b.validés} val + ${b.vus} vus) | méd ${f1(b.med)} p90 ${f1(b.p90)} max ${f1(b.max)} | >5 ${b.gt5} >10 ${b.gt10} >20 ${b.gt20} >50 ${b.gt50} MV ${b.mv} | non jugés ${b.nonJugés}`;
const res={};
for(const p of ['15','16','17']){
  const rows=load(p);const lot=rows.filter(r=>r.lot&&r.etape!=='deferred'&&r.pose!==false);
  console.log('\n===== PARTIE',p,'posés du lot',lot.length);
  const out={};
  for(const s of Object.keys(NOM)){const set=lot.filter(r=>r.etape===s);if(set.length||s!=='gcv2-lot') {out[s]=bloc(NOM[s],set);console.log(pr(out[s]));}}
  out.total=bloc('TOTAL',lot);console.log(pr(out.total));
  const lv=lot.filter(r=>r.ref==='validation');out.strict=bloc('STRICT (validations)',lv);console.log(pr(out.strict));
  console.log('validations: ',lv.map(r=>r.cut+':'+r.etape+':'+f1(r.outil3d)).join('  '));
  console.log('>50 mm:',lot.filter(r=>r.outil3d>50).map(r=>r.cut+':'+r.etape+':'+f1(r.outil3d)).join(', ')||'aucun');
  console.log('>20 mm:',lot.filter(r=>r.outil3d>20).map(r=>r.cut+':'+r.etape+':'+f1(r.outil3d)).join(', ')||'aucun');
  console.log('>10 mm:',lot.filter(r=>r.outil3d>10).map(r=>r.cut+':'+r.etape+':'+f1(r.outil3d)+':lat'+f1(r.lat)).join(', ')||'aucun');
  console.log('refs:',JSON.stringify(lot.reduce((a,r)=>{a[r.ref]=(a[r.ref]||0)+1;return a;},{})));
  const nj=lot.filter(r=>r.outil3d==null);console.log('non jugés',nj.length,'par étape',JSON.stringify(nj.reduce((a,r)=>{a[r.etape]=(a[r.etape]||0)+1;return a;},{})),'dwell',nj.map(r=>r.dwellMaxS).join(','),'visites',JSON.stringify(nj.reduce((a,r)=>{a[r.visites]=(a[r.visites]||0)+1;return a;},{})));
  const dv=lot.filter(r=>r.ref==='visite-sans-action').map(r=>r.dwellMaxS);console.log('dwell VSA méd',q(dv,.5),'min',Math.min(...dv),'max',Math.max(...dv),'n',dv.length);
  console.log('déplacement Ariane (posés) méd/p90/max',f1(q(lot.map(r=>r.deplAriane),.5)),f1(q(lot.map(r=>r.deplAriane),.9)),f1(Math.max(...lot.map(r=>r.deplAriane))),'| jugés',f1(q(lot.filter(r=>r.outil3d!=null).map(r=>r.deplAriane),.5)));
  console.log('wilson 0/jugés',wil(out.total.gt50,out.total.jugés),' 0/strict',wil(out.strict.gt50,out.strict.jugés),' 0/posés',wil(0,lot.length),'   >20 : ',wil(out.total.gt20,out.total.jugés));
  // relecture
  const rl=rows.filter(r=>!r.lot);
  console.log('--- relecture corrigés',rl.length,'jugés',rl.filter(r=>r.ecartOrig!=null).length,'validés',rl.filter(r=>r.ref==='validation').length);
  for(const r of rl) console.log(r.cut,r.ref,'dwell',r.dwellMaxS,'orig->op',f1(r.ecartOrig),'corr->op',f1(r.ecartCorr??r.outil3d),'déplacement',f1(r.deplAriane??r.ecritMm),r.ecartOrig!=null?(r.ecartOrig>(r.ecartCorr??r.outil3d)?'plus proche':(r.ecartOrig===(r.ecartCorr??r.outil3d)?'égal':'PAS plus proche')):'non jugé');
  res[p]={lot,rl,out};
}
// cumul
console.log('\n===== CUMUL 15+16+17');
const all=['15','16','17'].flatMap(p=>res[p].lot);
for(const s of Object.keys(NOM)){const set=all.filter(r=>r.etape===s);if(set.length)console.log(pr(bloc(NOM[s],set)));}
const T=bloc('TOTAL',all);console.log(pr(T));
const sv=all.filter(r=>r.ref==='validation');console.log(pr(bloc('STRICT',sv)));
console.log('wilson >50 : 0/'+T.jugés+' =',wil(T.gt50,T.jugés),'% ; >20 :',T.gt20+'/'+T.jugés,wil(T.gt20,T.jugés),'; strict 0/'+sv.length,wil(0,sv.length));
console.log('cumul >10 mm:',all.filter(r=>r.outil3d>10).map(r=>r.cut+':'+r.etape+':'+f1(r.outil3d)).join(', '));
const needed=(pmax)=>Math.ceil(Math.log(0.05)/Math.log(1-pmax));console.log('n sans erreur (95% unilatéral, règle des 3) pour 3 %:',needed(.03),'pour 1 %:',needed(.01));
// n tel que Wilson haut 2 faces ≤ 3% à 0 erreur
const nW=(pm)=>{for(let n=1;n<5000;n++){if(wil(0,n)<=pm*100)return n;}};console.log('n Wilson bilatéral 0 erreur ≤3 %',nW(.03),' ≤1 %',nW(.01));
console.log('\n===== CUMUL 16+17');
const a2=['16','17'].flatMap(p=>res[p].lot);
for(const s of Object.keys(NOM)){const set=a2.filter(r=>r.etape===s);if(set.length)console.log(pr(bloc(NOM[s],set)));}
const T2=bloc('TOTAL',a2);console.log(pr(T2));
const sv2=a2.filter(r=>r.ref==='validation');console.log(pr(bloc('STRICT',sv2)));
console.log('wilson 0/'+T2.jugés,wil(0,T2.jugés),' strict 0/'+sv2.length,wil(0,sv2.length),' 0/'+a2.length+' posés',wil(0,a2.length));
const ex=(n,pm)=>{const z2=3.841459;return Math.ceil(z2*(1/pm-1));};console.log('n sans erreur Wilson ≤3 %',ex(0,.03),' ≤1 %',ex(0,.01));
// relecture cumul
const rl=['15','16','17'].flatMap(p=>res[p].rl);const jg=rl.filter(r=>r.ecartOrig!=null);
console.log('relecture corrigés',rl.length,'jugés',jg.length,'validés',jg.filter(r=>r.ref==='validation').length,'plus proches',jg.filter(r=>r.ecartOrig>(r.ecartCorr??r.outil3d)).length);
const sval=jg.filter(r=>r.ref==='validation');console.log('validés:',sval.map(r=>r.cut+': '+f1(r.ecartOrig)+' -> '+f1(r.ecartCorr??r.outil3d)).join(' ; '));
console.log('corr->op max (validés)',Math.max(...sval.map(r=>r.ecartCorr??r.outil3d)).toFixed(1));
