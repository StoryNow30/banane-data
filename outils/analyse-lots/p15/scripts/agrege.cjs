const fs=require('fs');const R=process.env.S+'/p15/';
const rows=JSON.parse(fs.readFileSync(R+'res/juge.json','utf8'));
const jo=JSON.parse(fs.readFileSync(R+'res/jointure-regle-full.json','utf8'));
const T={};for(const r of jo.table)T[r.cut]=r;
const q=(a,p)=>{a=a.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return null;const at=(a.length-1)*p,lo=Math.floor(at),hi=Math.ceil(at);return a[lo]+(a[hi]-a[lo])*(at-lo);};
const wil=(k,n)=>{if(!n)return null;const z=1.96,p=k/n,d=1+z*z/n,c=p+z*z/(2*n),h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));return +(100*Math.min(1,(c+h)/d)).toFixed(1);};
const lot=rows.filter(r=>r.lot&&r.etape!=='deferred');
function bloc(nom,set){
  const j=set.filter(r=>r.outil3d!=null);
  const e=j.map(r=>r.outil3d);
  return {nom,posés:set.length,jugés:j.length,med:q(e,.5),p90:q(e,.9),max:Math.max(...e,0),gt10:e.filter(x=>x>10).length,gt20:e.filter(x=>x>20).length,gt50:e.filter(x=>x>50).length,mauvaiseVoie:j.filter(r=>r.lat>100).length,maxLat:Math.max(...j.map(r=>r.lat||0),0)};
}
const etapes=['first-pass','choice','crossing','window'];
console.log('--- AVEC règle (validation + visité ≥0,8 s sans action)');
for(const s of etapes) console.log(JSON.stringify(bloc(s,lot.filter(r=>r.etape===s))));
console.log(JSON.stringify(bloc('TOUS',lot)));
console.log('--- STRICT (validation observée seulement)');
const lv=lot.filter(r=>r.ref==='validation');
for(const s of etapes) console.log(JSON.stringify(bloc(s,lv.filter(r=>r.etape===s))));
console.log(JSON.stringify(bloc('TOUS',lv)));
console.log('par réf:',JSON.stringify(lot.reduce((a,r)=>{a[r.ref]=(a[r.ref]||0)+1;return a;},{})));
console.log('wilson 0/31',wil(0,31),'0/3',wil(0,3),'0/45',wil(0,45), '0/14', wil(0,14));
const dw=lot.filter(r=>r.ref==='visite-sans-action').map(r=>r.dwellMaxS);console.log('dwell vsa med',q(dw,.5),'min',Math.min(...dw),'max',Math.max(...dw));
const dn=lot.filter(r=>r.ref==='sans-reference').map(r=>r.dwellMaxS);console.log('non jugés dwell',dn.join(','),'n',dn.length);
console.log('non jugés par étape',JSON.stringify(lot.filter(r=>r.ref==='sans-reference').reduce((a,r)=>{a[r.etape]=(a[r.etape]||0)+1;return a;},{})), lot.filter(r=>r.ref==='sans-reference').map(r=>r.cut).join(','));
console.log('déplacement Ariane (lot, 45) méd/p90/max', q(lot.map(r=>r.deplAriane),.5),q(lot.map(r=>r.deplAriane),.9),Math.max(...lot.map(r=>r.deplAriane)), 'jugés 31 méd/p90', q(lot.filter(r=>r.outil3d!=null).map(r=>r.deplAriane),.5), q(lot.filter(r=>r.outil3d!=null).map(r=>r.deplAriane),.9));
// différé 4655
console.log('4655',JSON.stringify(rows.find(r=>r.cut===4655)));
// corrigés par relecture
console.log('--- 11 corrigés relecture');
const rl=rows.filter(r=>!r.lot);
for(const r of rl) console.log(r.cut,r.ref,'dwell',r.dwellMaxS,'orig->humain',r.ecartOrig&&r.ecartOrig.toFixed(1),'corrigé->humain',r.outil3d,'(monde',r.ecartPoseAriane&&r.ecartPoseAriane.toFixed(1)+')','déplacement relecture',r.deplAriane.toFixed(1), r.ecartOrig>r.ecartPoseAriane?'plus proche':'PAS plus proche');
const n=rl.length,pl=rl.filter(r=>r.ecartOrig>r.ecartPoseAriane).length;
console.log('11: plus proches',pl,'/',n,'; validés',rl.filter(r=>r.ref==='validation').length,'; origine méd',q(rl.map(r=>r.ecartOrig),.5),'corrigé méd',q(rl.map(r=>r.outil3d),.5),'max corrigé',Math.max(...rl.map(r=>r.outil3d)),'max orig',Math.max(...rl.map(r=>r.ecartOrig)),'min orig',Math.min(...rl.map(r=>r.ecartOrig)));
console.log('déplacement relecture méd/min/max',q(rl.map(r=>r.deplAriane),.5),Math.min(...rl.map(r=>r.deplAriane)),Math.max(...rl.map(r=>r.deplAriane)));
// lien règle pn-chaque-cut
const j=JSON.parse(fs.readFileSync(R+'data/lot/ariane-journal-v4-1793001080845.json','utf8'));
const aur={};for(const e of j.events) if(e.type==='regles-metier-ombre'&&e.portee==='cut'&&e.aurait==='differer') aur[e.identity.cut]=1;
const au=lot.filter(r=>aur[r.cut]);console.log('aurait différé (ombre pn-chaque-cut) parmi 45:',au.length,'jugés',au.filter(r=>r.outil3d!=null).length,'dont >5 mm',au.filter(r=>r.outil3d>5).length,'max',Math.max(...au.filter(r=>r.outil3d!=null).map(r=>r.outil3d)), 'cuts corrigés par opérateur parmi eux', au.filter(r=>r.ref==='validation').map(r=>r.cut).join(','));
const non=lot.filter(r=>!aur[r.cut]);console.log('non différés par la règle',non.length,'validations',non.filter(r=>r.ref==='validation').map(r=>r.cut).join(','));
// vérif cohérence outil vs monde
const dif=rows.filter(r=>r.outil3d!=null&&r.ecartPoseAriane!=null).map(r=>Math.abs(r.outil3d-r.ecartPoseAriane));console.log('écart max outil vs monde (mm)',Math.max(...dif).toFixed(2));
// lat des validés
console.log('lat des validés',rows.filter(r=>r.ref==='validation').map(r=>[r.cut,r.lat]));
