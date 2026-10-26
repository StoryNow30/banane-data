const fs=require('fs');const R=process.env.S+'/p15/';
const P=require(R+'tree/tools/perf-lot.cjs');
const j=JSON.parse(fs.readFileSync(R+'data/lot/ariane-journal-v4-1793001080845.json','utf8'));
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const ms=e=>Date.parse(e.timestamp);
const B='a1f5269b-424b-4262-a172-da6e1e6574bf';
const t0=Date.parse('2026-10-26T07:43:17.676Z'),t1=Date.parse('2026-10-26T07:45:25.267Z'),tr0=Date.parse('2026-10-26T07:45:25.621Z'),tr1=Date.parse('2026-10-26T07:49:43.414Z');
const inLot=e=>ms(e)>=t0&&ms(e)<=t1+400; // fin du lot
const lot=ev.filter(e=>ms(e)>=t0&&ms(e)<tr0);
const rel=ev.filter(e=>ms(e)>=tr0&&ms(e)<=tr1+50);
// écritures
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write');
const ok2=s=>s>=200&&s<300;
const val=e=>e.body&&e.body.ExtractionStatus==='valid'&&e.body.TreatedByOperator===true;
function ecr(w){const m=new Map();for(const e of w) if(ok2(e.status)&&val(e)&&Number.isInteger(e.rowIndex)){m.set(e.rowIndex,(m.get(e.rowIndex)||0)+1);}return m;}
const wl=W.filter(e=>ms(e)>=t0&&ms(e)<tr0), wr=W.filter(e=>ms(e)>=tr0&&ms(e)<=tr1+2000);
const el=ecr(wl),er=ecr(wr);
console.log('lot: écritures valid 2xx lignes distinctes',el.size,'doublons',[...el].filter(x=>x[1]>1));
const cutsLot=[1,935,936,938,940,2611,2612,2613,2614,2615,3882,3883,3884,3885,3886,3887,4656,4658,4659,4660,4661,7193,7194,7195,7196,7197,7198,7199,7200,7218,7219,7610,7611,7612,7613,7614,7615,7616,7617,7618,7619,7620,7621,7622,7623];
console.log('cuts lot posés',cutsLot.length,'écrits manquants',cutsLot.filter(c=>!el.has(c)),'écrits hors lot',[...el.keys()].filter(c=>!cutsLot.includes(c)));
console.log('4655 écrit pendant lot?',wl.some(e=>e.rowIndex===4655&&e.body&&e.body.ExtractionStatus));
console.log('statuts lot',JSON.stringify(wl.reduce((a,e)=>{const k=e.status+(val(e)?' valid':' vu');a[k]=(a[k]||0)+1;return a;},{})));
console.log('relecture: valid 2xx',[...er.keys()].sort((a,b)=>a-b).join(','),'; statuts',JSON.stringify(wr.reduce((a,e)=>{const k=e.status+(val(e)?' valid':' vu');a[k]=(a[k]||0)+1;return a;},{})));
// 7623 write ?
console.log('7623 writes',W.filter(e=>e.rowIndex===7623).map(e=>[e.timestamp,e.status,JSON.stringify(e.body).slice(0,60)]));
// passe
const pe=ev.filter(e=>/^passe-differes/.test(e.type));
console.log('passe',pe.map(e=>JSON.stringify({t:e.type,ts:e.timestamp,mode:e.mode,ed:e.ecritureDemandee,dif:e.differes,pos:e.posees,dec:e.decision,motif:e.motif,ecriture:e.ecriture,passe:e.passe,ms:e.ms,zone:e.l1&&e.l1.zone,ecartDepart:e.l1&&e.l1.ecartDepartMm,ch:e.l1&&e.l1.chaine})));
console.log('passe-ecriture events',ev.filter(e=>e.type==='passe-differes-ecriture').length);
console.log('ecriture:false champs', JSON.stringify(pe.map(e=>e.ecriture)));
// perf
const dataLot={...j,events:j.events.filter(e=>!(Date.parse(e.timestamp)>=tr0)),state:{batch:{id:B}}};
const m=P.measure(dataLot);
console.log('cycle',JSON.stringify(m.cycleMs),'silences',JSON.stringify(m.silences),'dureeMin',m.dureeMin);
console.log('erreurs',JSON.stringify(m.erreurs));
console.log('cmds',Object.entries(m.commandesMs).map(([k,v])=>k+':'+v.n+' med '+v.median+' p90 '+v.p90).join(' | '));
console.log('analyse',JSON.stringify(m.analyseMs),'decision',JSON.stringify(m.decisionMs));
console.log('phases',JSON.stringify(m.phases.etapes.map(e=>[e.id,e.ms.n,e.ms.median,e.ms.p90])));
// cycles par étape
const etape={};for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B) etape[e.identity.cut]=e.lotObservation.stage;
const cib=lot.filter(e=>e.type==='cut-target-changed');
const par={};
for(let i=1;i<cib.length;i++){const c=cib[i].identity&&cib[i].identity.cut; // cut quitté
  const d=ms(cib[i])-ms(cib[i-1]); const s=etape[c]; if(s===undefined) continue; (par[s]=par[s]||[]).push(d);}
const st=a=>{a=a.slice().sort((x,y)=>x-y);const q=p=>a[Math.min(a.length-1,Math.floor(p*(a.length-1)+0.5))];return {n:a.length,med:q(.5),p90:q(.9),max:a.at(-1)};};
for(const k of Object.keys(par)) console.log('cycle par étape',k,JSON.stringify(st(par[k])));
// clic hors vue
const ch=ev.filter(e=>e.type==='clic-hors-vue-bilan');console.log('clic-hors-vue-bilan',JSON.stringify(ch.map(e=>[e.timestamp,e.total,e.etat])));
console.log('diag-compteur-bloque',ev.filter(e=>e.type==='esv-observation'&&e.kind==='diag-compteur-bloque').map(e=>[e.timestamp,e.cut]));
console.log('adapter-result erreurs lot',lot.filter(e=>e.type==='adapter-result'&&e.error).length,'relecture',rel.filter(e=>e.type==='adapter-result'&&e.error).length);
console.log('types erreurs',ev.filter(e=>/erreur|error|refus|abandon/.test(e.type)).map(e=>[e.type,e.timestamp]));
// pauses / états
console.log('batch-state', ev.filter(e=>e.type==='batch-state').map(e=>[e.timestamp,e.state,e.step]));
console.log('transitions',j.transitionsLot.filter(t=>t.nom!=='cut-suivant').map(t=>t.nom+' '+t.at),'cut-suivant n=',j.transitionsLot.filter(t=>t.nom==='cut-suivant').length);
// durée de relecture et corrections
console.log('relecture durees',tr1-tr0);
