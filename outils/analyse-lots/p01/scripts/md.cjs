const fs=require('fs');const S=process.env.S;
const ab={ambiguity:'amb','gauge-out-of-contract':'éc',candidate:'cand',minTop:'mT',input:'vide',flank:'fl',slope:'pente',rsf:'rsf'};
const motifPasse={'depart-le-plus-probable':'départ','sans-approche':'s-appr','sans-voie':'s-voie','plus-de-150-mm':'>150','veto-voie':'veto','sous-delta':'s-delta','commande:gauge-HIGH_INVALID':'écart-inv'};
for(const p of [0,1]){
 const rows=JSON.parse(fs.readFileSync(S+'/p01/res/diff'+p+'-table.json','utf8'));
 const nu=fs.readFileSync(S+'/p01/res/'+(p===1?'nuage1.keep.txt':'nuage0.txt'),'utf8').split('\n').find(l=>l.startsWith('différés (cut:'));
 const pts={};for(const m of nu.matchAll(/(\d+):(\d+):(\d+):\d+/g))pts[+m[1]]=+m[2];
 const f1=x=>x==null?'':(+x).toFixed(1).replace('.',',');
 console.log('\n### Partie '+p);
 console.log('| Cut | Motif de différé (G/D) | Points | Passe en ombre | D (mm) | Appui (cuts) | Garde A | Opérateur (départ→final, visites) | Écart « poserait »→final |');
 console.log('|---|---|---|---|---|---|---|---|---|');
 for(const r of rows){const mo=r.motifs.split('/').map(m=>ab[m]||m).join('/');
  const pa=r.decision==='poserait'?'**poserait**':'rien ('+(motifPasse[r.motifPasse]||r.motifPasse)+')';
  const D=r.decision==='poserait'?f1(r.D):f1(r.ecartMoteur)+' (m)';
  let g='—';if(r.decision==='poserait'){const gg=r.gardeReelle?('réelle : '):'';const rs=(r.gardeRecalc||'').split('/')[1]; g=(r.gardeReelle?'**réelle** ':'')+'passe ('+(rs==='loin-du-depart'?'D ≥ 100':'appui ≤ 4')+')';}
  const v=r.decision==='poserait'?(r.ecartPoserait<=20?'juste':(r.ecartPoserait<=50?'intermédiaire':'fausse')):'';
  const ep=r.decision==='poserait'?f1(r.ecartPoserait)+' ('+v+')':'';
  console.log('| '+[r.cut,mo,(pts[r.cut]/1000).toFixed(1).replace('.',','),pa,D,r.appui,g,'corrigé '+f1(r.opDepartFinal)+', '+r.visites+' v.'+(r.etiquette==='VALIDATE_NO_MOVEMENT'?' (étiq. « sans mouvement »)':''),ep].join(' | ')+' |');}
}
