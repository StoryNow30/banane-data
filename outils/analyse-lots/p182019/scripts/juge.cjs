// Juge les poses d'Ariane (lot + relecture) contre la pose finale de l'opérateur (Écho). Usage: node juge.cjs <partie>
const fs=require('fs');const R=process.env.S+'/p182019/';
const part=+process.argv[2];
const LM=require(R+'tree/src/liste-memoire.js');
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const dl=d=>fs.readdirSync(R+'data/'+d).filter(x=>new RegExp('liste-partie'+(typeof part!=='undefined'?part:p)+'-').test(x)).map(x=>R+'data/'+d+'/'+x)[0];
const jf=fs.readdirSync(R+'data/lot'+part).filter(x=>/journal/.test(x)).map(x=>R+'data/lot'+part+'/'+x)[0];
const LA=LM.decompacter(rd(dl('lot'+part)));   // liste du lot (16 : après le lot ; 17 : avant le lot)
const LE=LM.decompacter(rd(dl('echo'+part)));  // liste au départ de l'Écho
const jo=rd(R+'res/jo'+part+'-regle.json'), js=rd(R+'res/jo'+part+'-strict.json');
const T={},TS={};for(const r of jo.table)T[r.cut]=r;for(const r of js.table)TS[r.cut]=r;
const j=rd(jf);const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===part);const bsx=bsA[bsA.length-1];const B=bsx.batch.id;const t0=Date.parse(bsx.timestamp);
const etape={},posedLot={};
for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B){const lo=e.lotObservation||{},cmd=lo.command||{};etape[e.identity.cut]=(lo.stage==='deferred'&&cmd.action==='lot'&&cmd.l1s==='gcv2')?'gcv2-lot':lo.stage;}
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write'&&e.status>=200&&e.status<300&&e.body&&e.body.ExtractionStatus==='valid'&&e.body.TreatedByOperator===true);
const tr0=Date.parse(ev.find(e=>e.type==='relecture-debut'&&e.batchId===B).timestamp);
for(const e of W) if(Date.parse(e.timestamp)<tr0 && Date.parse(e.timestamp)>=t0 && etape[e.rowIndex]!==undefined) posedLot[e.rowIndex]=1;
const rel={};for(const e of ev) if(e.type==='relecture-ombre'&&e.batchId===B) rel[e.identity.cut]=e;
const corriges=Object.values(rel).filter(e=>e.action==='corrige').map(e=>e.identity.cut).sort((a,b)=>a-b);
const pose=(L,c)=>{const o=6*c;const v=L.ed.slice(o,o+6);return v.some(x=>x==null)?null:v;};
const d3=(a,b,o)=>Math.hypot(a[o]-b[o],a[o+1]-b[o+1],a[o+2]-b[o+2])/10;
const worst=(a,b)=>a&&b?Math.max(d3(a,b,0),d3(a,b,3)):null;
const toArr=p=>p?[p.gauche.x*1e4,p.gauche.y*1e4,p.gauche.z*1e4,p.droite.x*1e4,p.droite.y*1e4,p.droite.z*1e4]:null;
const arr=pe=>pe?[pe.left[0]*1e4,pe.left[1]*1e4,pe.left[2]*1e4,pe.right[0]*1e4,pe.right[1]*1e4,pe.right[2]*1e4]:null;
const out=[];
const cuts=[...Object.keys(etape).map(Number),...corriges].sort((a,b)=>a-b);
for(const c of cuts){
  const t=T[c]||null,ts=TS[c]||null;const lot=c in etape;
  const ref0=t&&t.referenceHumaine==='observee';
  let ref;
  if(!t) ref='non-visite'; else if(ref0) ref=(t.visiteSansAction&&t.visiteSansAction.appliquee)?'visite-sans-action':'validation'; else ref='sans-reference';
  // pose finale de l'humain (monde, 0,1 mm)
  let h=null; if(ref==='validation') h=toArr(t.poseHumaineFinale); else if(ref==='visite-sans-action') h=pose(LE,c);
  const eo=lot?null:arr(rel[c]&&rel[c].poseEsv);           // origine d'un corrigé (poseEsv avant correction)
  const origListe=lot?null:pose(LA,c);                      // 16: liste du lot (avant correction) ; 17: liste avant le lot
  const corr=pose(LE,c);                                    // pose corrigée (liste au départ de l'Écho)
  const posL=pose(LE,c);
  const ad=t&&t.arianeDeplacement?Math.max(t.arianeDeplacement.gauche.dist3dMm,t.arianeDeplacement.droite.dist3dMm):null;
  out.push({cut:c,lot,etape:lot?etape[c]:'relecture',pose:lot?!!posedLot[c]:true,ref,strictRef:ts?ts.referenceHumaine:null,
    dwellMaxS:t&&t.visiteSansAction?t.visiteSansAction.dwellMaxS:(t?t.dureeVisiteS:null),visites:t?t.visitesEcho:0,etiquette:t?t.etiquetteEcho:null,statutEcho:t?t.statutEcho:null,
    outil3d:t&&t.ecartHumain?t.ecartHumain.maxDist3dMm:null,
    lat:t&&t.ecartHumain?Math.max(Math.abs(t.ecartHumain.gauche.lateralMm),Math.abs(t.ecartHumain.droite.lateralMm)):null,
    deplAriane:lot?ad:(origListe&&corr?worst(origListe,corr):null),
    ecritMm:rel[c]&&rel[c].ecritMm?Math.max(...['left','right'].map(s=>Math.hypot(rel[c].ecritMm[s].long,rel[c].ecritMm[s].lat,rel[c].ecritMm[s].vert))):null,
    ecartOrig:(!lot&&ref!=='sans-reference'&&ref!=='non-visite'&&h&&origListe)?worst(origListe,h):null,
    ecartCorr:(!lot&&ref!=='sans-reference'&&ref!=='non-visite'&&h&&corr)?worst(corr,h):null,
    ecartOrigEsv:(!lot&&h&&eo)?worst(eo,h):null,
    verifOrigListe_vs_poseEsv:(!lot&&eo&&origListe)?worst(eo,origListe):null});
}
fs.writeFileSync(R+'res/juge'+part+'.json',JSON.stringify(out,null,1));
for(const r of out) console.log([r.cut,r.lot?'lot':'rel',r.etape,r.pose?'posé':'NON-posé',r.ref,r.strictRef,r.visites,r.dwellMaxS,r.etiquette,r.deplAriane!=null?r.deplAriane.toFixed(1):null,r.outil3d,r.lat!=null?r.lat.toFixed(1):null,r.ecartOrig!=null?r.ecartOrig.toFixed(1):null,r.ecartCorr!=null?r.ecartCorr.toFixed(1):null,r.ecritMm!=null?r.ecritMm.toFixed(1):null].join('\t'));
