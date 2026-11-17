'use strict';
// Résumé des jointures Écho ↔ lot par partie : posés et différés jugés, écarts ; deuxième passe ; ancre ; aj5.
const fs=require('fs');
const j=JSON.parse(fs.readFileSync(fs.readdirSync('.').find(f=>f.startsWith('ariane-journal')),'utf8'));
const ev=j.events;
const passe=new Set(ev.filter(e=>e.type==='validation-accepted'&&e.passeDifferes).map(e=>e.identity.part+'/'+e.identity.cut));
const T={pose:0,le10:0,gt10:[],gt50:[],dif:0,difBons:0,difFaux:[],p2:[],ajRails:[]};
const parts=fs.readdirSync('.').filter(f=>/^joint-p\d+\.json$/.test(f));
const aj={};for(const e of ev.filter(e=>e.type==='gcv1-shadow-observed'&&e.lotObservation?.ajustementFin)){const af=e.lotObservation.ajustementFin;for(const r of ['left','right']){const a=af.avant?.[r],b=af.apres?.[r];if(a&&b&&Math.abs(b[2]-a[2])>=0.05)aj[e.identity.part+'/'+e.identity.cut+'/'+(r==='left'?'gauche':'droite')]=b[2]-a[2];}}
for(const f of parts){for(const l of JSON.parse(fs.readFileSync(f,'utf8')).table){if(!l.dansJournal||!l.referenceHumaine||!l.ecartHumain)continue;const k=l.partie+'/'+l.cut,m=l.ecartHumain.maxDist3dMm;
 if(l.classe==='posee'){T.pose++;if(m<=10)T.le10++;else T.gt10.push(k+' '+m.toFixed(1)+(passe.has(k)?' (passe)':'')+' '+l.etiquetteEcho);if(m>50)T.gt50.push(k);if(passe.has(k))T.p2.push(k+' '+m.toFixed(1));
  if(l.base==='ariane')for(const s of ['gauche','droite']){const d=aj[k+'/'+s],eh=l.ecartHumain[s];if(d!=null&&eh?.repere==='profil')T.ajRails.push({k,s,dz:+d.toFixed(1),apres:eh.verticalMm,avant:+(eh.verticalMm+d).toFixed(1),et:l.etiquetteEcho});}}
 if(l.classe==='differee'){T.dif++;if(m>10)T.difBons++;else T.difFaux.push(k+' '+m.toFixed(1));}}}
const anc=ev.filter(e=>e.type==='gcv1-shadow-observed'&&e.lotObservation);const ref=anc.filter(e=>e.lotObservation.ancre?.refus).map(e=>e.identity.part+'/'+e.identity.cut);
console.log('posés jugés',T.pose,'≤10 mm',T.le10,(100*T.le10/T.pose).toFixed(1)+' %');console.log('>10 mm',T.gt10.length,T.gt10.join(' | '));console.log('>50 mm',T.gt50.join(' '));
console.log('différés jugés',T.dif,'corrigés >10 mm (bons)',T.difBons,'faux',T.difFaux.join(' '));console.log('passe écrits jugés',T.p2.join(' | '),'sur',passe.size,'écrits');
console.log('ancre : décisions',anc.length,'jugées',anc.filter(e=>e.lotObservation.ancre).length,'refus',ref.length,ref.join(' '));
console.log('aj5 : rails changés',Object.keys(aj).length,'jugés',T.ajRails.length);let mi=0,pi=0,eg=0;for(const x of T.ajRails){const A=Math.abs(x.avant),B=Math.abs(x.apres);if(B+0.5<A)mi++;else if(A+0.5<B)pi++;else eg++;}console.log('aj5 plus près',mi,'plus loin',pi,'égal',eg);for(const x of T.ajRails.filter(x=>Math.abs(x.apres)>Math.abs(x.avant)+0.5))console.log(' plus loin',JSON.stringify(x));
const aje=ev.filter(e=>e.type==='ajustement-hauteur-choix').map(e=>e.timestamp.slice(11,19)+' '+e.actif);console.log('aj5 choix',aje.join(', '));
