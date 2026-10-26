// Juge des poses d'Ariane (lot + relecture) contre la pose finale de l'opérateur (Écho). Lecture seule.
const fs=require('fs');const R=process.env.S+'/p15/';
const LM=require(R+'tree/src/liste-memoire.js');
const jo=JSON.parse(fs.readFileSync(R+'res/jointure-regle-full.json','utf8'));
const avant=LM.decompacter(JSON.parse(fs.readFileSync(R+'data/lot/ariane-liste-partie15-20261026-074318Z.json','utf8')));
const apres=LM.decompacter(JSON.parse(fs.readFileSync(R+'data/echo/ariane-liste-partie15-20261026-075242Z.json','utf8')));
const j=JSON.parse(fs.readFileSync(R+'data/lot/ariane-journal-v4-1793001080845.json','utf8'));
const ev=j.events.slice().sort((a,b)=>(a.timestamp||'').localeCompare(b.timestamp||''));
// étapes
const B=process.env.LOT_ID; if(!B) throw new Error('LOT_ID : identifiant du lot (batchId de la fiche de départ) à passer en variable d’environnement');
const etape={};for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B) etape[e.identity.cut]=e.lotObservation.stage;
const rel={};for(const e of ev) if(e.type==='relecture-ombre') rel[e.identity.cut]=e;
const corriges=Object.values(rel).filter(e=>e.action==='corrige').map(e=>e.identity.cut).sort((a,b)=>a-b);
const pose=(L,c)=>{const o=6*c;const v=L.ed.slice(o,o+6);return v.some(x=>x==null)?null:v;};
const d3=(a,b,o)=>Math.hypot(a[o]-b[o],a[o+1]-b[o+1],a[o+2]-b[o+2])/10; // mm
const worst=(a,b)=>a&&b?Math.max(d3(a,b,0),d3(a,b,3)):null;
const T={};for(const r of jo.table) T[r.cut]=r;
const toArr=p=>p?[p.gauche.x*1e4,p.gauche.y*1e4,p.gauche.z*1e4,p.droite.x*1e4,p.droite.y*1e4,p.droite.z*1e4]:null;
const out=[];
const cuts=[...Object.keys(etape).map(Number),...corriges].sort((a,b)=>a-b);
for(const c of cuts){
  const t=T[c]||null;const lot=c in etape;
  const o=pose(avant,c),a=pose(apres,c);
  let ref=null,source=null,h=null;
  if(t&&t.referenceHumaine==='observee'){
    if(t.visiteSansAction&&t.visiteSansAction.appliquee){ref='visite-sans-action';h=a;}
    else {ref='validation';h=toArr(t.poseHumaineFinale);}
  } else ref=t?('sans-reference'):'non-visite';
  out.push({cut:c,lot,etape:lot?etape[c]:'relecture',ref,
    dwellMaxS:t&&t.visiteSansAction?t.visiteSansAction.dwellMaxS:(t?t.dureeVisiteS:null),visites:t?t.visitesEcho:0,etiquette:t?t.etiquetteEcho:null,
    ecartOrig:(ref&&h&&o)?worst(o,h):null, ecartPoseAriane:(ref&&h&&a)?worst(a,h):null,
    outil3d:t&&t.ecartHumain?t.ecartHumain.maxDist3dMm:null,
    lat:t&&t.ecartHumain?Math.max(Math.abs(t.ecartHumain.gauche.lateralMm),Math.abs(t.ecartHumain.droite.lateralMm)):null,
    deplAriane:worst(o,a)});
}
fs.writeFileSync(R+'res/juge.json',JSON.stringify(out,null,1));
for(const r of out) console.log([r.cut,r.lot?'lot':'rel',r.etape,r.ref,r.visites,r.dwellMaxS,r.etiquette,r.deplAriane&&r.deplAriane.toFixed(1),r.ecartPoseAriane!=null?r.ecartPoseAriane.toFixed(1):null,r.outil3d,r.ecartOrig!=null?r.ecartOrig.toFixed(1):null].join('\t'));
