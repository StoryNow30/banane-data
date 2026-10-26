// Partie A : le lot. Usage: node lotA.cjs <partie> <journal.json>
const fs=require('fs');const R=process.env.S+'/p01/';
const P=require(process.env.S+'/wt/T23/tools/perf-lot.cjs');
const part=+process.argv[2];
const j=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const ms=e=>Date.parse(e.timestamp);
const paris=t=>{const d=new Date(t+3600e3);return d.toISOString().slice(11,23).replace(/^(\d\d):(\d\d):/,'$1 h $2 min ')+' s';};
const bsA=ev.filter(e=>e.type==='batch-started'&&e.identity&&e.identity.part===part);const bs=bsA[bsA.length-1];const B=bs.batch.id;
const stop=ev.find(e=>e.type==='batch-stopped-at-end'&&ms(e)>ms(bs));
const rd=ev.find(e=>e.type==='relecture-debut'&&e.batchId===B),rf=ev.find(e=>e.type==='relecture-fin'&&e.batchId===B);
const t0=ms(bs),t1=ms(stop),tr0=rd?ms(rd):t1+36e6,tr1=rf?ms(rf):tr0;if(!rd)console.log('PAS DE RELECTURE dans ce journal');
console.log('lot',B.slice(0,8),'début',paris(t0),'fin',paris(t1),'durée s',((t1-t0)/1e3).toFixed(1),'| relecture',rd?paris(tr0)+' → '+paris(tr1)+' '+((tr1-tr0)/1e3).toFixed(1)+' s':'aucune');
console.log('stop reason',stop.reason,'lastCut',stop.lastCut);
// cibles
const dec={};for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B) dec[e.identity.cut]=e;
for(const e of ev) if(e.type==='capture-abandoned'&&e.reason==='depart-sur-vert'&&e.identity&&ms(e)>=ms(bs)&&ms(e)<=ms(bs)+30000){delete dec[e.identity.cut];console.log('cut de départ déjà vert, non compté comme cible :',e.identity.cut);}
const cuts=Object.keys(dec).map(Number).sort((a,b)=>a-b);
console.log('cibles (décisions)',cuts.length,'invalidesAuDepart',j.state&&j.state.batch&&0);
const stageOf=c=>{const lo=dec[c].lotObservation||{};const cmd=lo.command||{};
  if(lo.stage==='deferred'&&cmd.action==='lot'&&cmd.l1s==='gcv2') return 'gcv2-lot';
  if(lo.stage==='deferred'&&cmd.action==='lot'&&cmd.l1s==='chaine') return cmd.reason+'-repris';
  return lo.stage;};
// écritures
const W=ev.filter(e=>e.type==='esv-observation'&&e.kind==='write');
const ok2=s=>s>=200&&s<300;
const val=e=>e.body&&e.body.ExtractionStatus==='valid'&&e.body.TreatedByOperator===true;
function ecr(w){const m=new Map();for(const e of w) if(ok2(e.status)&&val(e)&&Number.isInteger(e.rowIndex)){m.set(e.rowIndex,(m.get(e.rowIndex)||0)+1);}return m;}
const wl=W.filter(e=>ms(e)>=t0&&ms(e)<tr0), wr=W.filter(e=>ms(e)>=tr0&&ms(e)<=tr1+2000);
const el=ecr(wl),er=ecr(wr);
const poses=cuts.filter(c=>el.has(c));const differes=cuts.filter(c=>!el.has(c));
console.log('écritures validation 2xx (lot) lignes distinctes',el.size,'doublons',[...el].filter(x=>x[1]>1).length,'| posés (cible avec écriture)',poses.length,'| sans écriture (différés)',differes.join(','));
console.log('écritures hors cibles pendant le lot',[...el.keys()].filter(c=>!dec[c]));
const lastW=wl.filter(e=>ok2(e.status)&&val(e)).map(ms).sort((a,b)=>a-b);console.log('dernière écriture valid 2xx à',paris(lastW.at(-1)),'(après arrêt',((lastW.at(-1)-t1)/1e3).toFixed(2),'s)');
const nv=ev.filter(e=>e.type==='validation-accepted'&&e.batchId===B).map(e=>e.cutId.split('|')[2]|0);
console.log('validation-accepted',nv.length,'validation-en-place',ev.filter(e=>e.type==='validation-en-place').map(e=>[paris(ms(e)),e.identity&&e.identity.cut]));
const w4=W.filter(e=>ms(e)>=t0&&ms(e)<tr0);
console.log('statuts écritures lot',JSON.stringify(w4.reduce((a,e)=>{const k=e.status+(val(e)?' valid':' vu');a[k]=(a[k]||0)+1;return a;},{})));
console.log('statuts écritures relecture',JSON.stringify(wr.reduce((a,e)=>{const k=e.status+(val(e)?' valid':' vu');a[k]=(a[k]||0)+1;return a;},{})));
console.log('écritures non 2xx (lot+relecture)',W.filter(e=>ms(e)>=t0&&ms(e)<=tr1+2000&&!ok2(e.status)).map(e=>[paris(ms(e)),e.rowIndex,e.status]));
// étapes
const par={};for(const c of cuts){const s=stageOf(c)+(el.has(c)?'':'|NON-POSÉ');par[s]=(par[s]||0)+1;}
console.log('étapes (cibles)',JSON.stringify(par));
// perf
const dataLot={...j,events:j.events.filter(e=>!(Date.parse(e.timestamp)>=Math.min(tr0,t1+20))),state:{batch:{id:B}}};
const m=P.measure(dataLot);
console.log('cycle',JSON.stringify(m.cycleMs),'silences',JSON.stringify(m.silences),'dureeMin',m.dureeMin);
{const v1=m.v1&&m.v1.lots&&m.v1.lots.find(x=>x.batchId===B);console.log('V1 cycle',JSON.stringify(v1&&v1.cycleMs));}
console.log('erreurs',JSON.stringify(m.erreurs));
console.log('cmds',Object.entries(m.commandesMs).map(([k,v])=>k+':'+v.n+' med '+v.median+' p90 '+v.p90).join(' | '));
console.log('analyse',JSON.stringify(m.analyseMs),'decision',JSON.stringify(m.decisionMs));
console.log('phases',JSON.stringify(m.phases.etapes.map(e=>[e.id,e.ms.n,e.ms.median,e.ms.p90])));
// cycles par étape
const lot=ev.filter(e=>ms(e)>=t0&&ms(e)<tr0);
const cib=lot.filter(e=>e.type==='cut-target-changed');
const pc={};
for(let i=1;i<cib.length;i++){const c=cib[i].identity&&cib[i].identity.cut; // cut quitté (identity du cut-target-changed)
  const d=ms(cib[i])-ms(cib[i-1]); if(!dec[c]) continue; const s=stageOf(c); (pc[s]=pc[s]||[]).push(d);}
const st=a=>{a=a.slice().sort((x,y)=>x-y);const q=p=>a[Math.min(a.length-1,Math.floor(p*(a.length-1)+0.5))];return {n:a.length,med:q(.5),p90:q(.9),max:a.at(-1)};};
for(const k of Object.keys(pc)) console.log('cycle par étape',k,JSON.stringify(st(pc[k])));
console.log('tous cycles (cut-target-changed, cibles du lot)',JSON.stringify(st(Object.values(pc).flat())));
const first=ev.find(e=>e.type==='before-captured'&&ms(e)>=t0);console.log('1re capture après',(ms(first)-t0)/1e3,'s');
// incidents
console.log('clic-hors-vue',ev.filter(e=>e.type==='clic-hors-vue'&&ms(e)>=t0&&ms(e)<=tr1).length,'bilan',JSON.stringify(ev.filter(e=>e.type==='clic-hors-vue-bilan').map(e=>[paris(ms(e)),e.total,e.etat])));
console.log('diag-compteur-bloque lot',ev.filter(e=>e.type==='esv-observation'&&e.kind==='diag-compteur-bloque'&&ms(e)<tr0&&ms(e)>=t0).length,'relecture',ev.filter(e=>e.type==='esv-observation'&&e.kind==='diag-compteur-bloque'&&ms(e)>=tr0&&ms(e)<=tr1).length);
console.log('adapter-result erreurs lot',lot.filter(e=>e.type==='adapter-result'&&e.error).length,'relecture',ev.filter(e=>ms(e)>=tr0&&ms(e)<=tr1&&e.type==='adapter-result'&&e.error).length,'adapter-result total lot',lot.filter(e=>e.type==='adapter-result').length);
console.log('types erreur/refus',JSON.stringify(ev.filter(e=>/erreur|error|refus|abandon|reconnex|restored|perdu|lost/.test(e.type)).map(e=>[e.type,paris(ms(e))])));
console.log('esv-observation kinds',JSON.stringify(ev.reduce((a,e)=>{if(e.type==='esv-observation'){a[e.kind]=(a[e.kind]||0)+1;}return a;},{})));
console.log('batch-state',JSON.stringify(ev.filter(e=>e.type==='batch-state').map(e=>[paris(ms(e)),e.state,e.step])));
console.log('transitions',JSON.stringify((j.transitionsLot||[]).filter(t=>t.nom!=='cut-suivant').map(t=>t.nom+' '+t.etat+' '+paris(Date.parse(t.at)))),'cut-suivant n=',(j.transitionsLot||[]).filter(t=>t.nom==='cut-suivant').length);
// silences (>60 s), pauses
const gaps=[];for(let i=1;i<lot.length;i++){const d=ms(lot[i])-ms(lot[i-1]);if(d>60e3)gaps.push([paris(ms(lot[i-1])),d/1e3]);}console.log('silences >60 s dans le lot',JSON.stringify(gaps));
console.log('pause/reprise events',ev.filter(e=>/pause|resume|reprise/.test(e.type)).length);
// SW restart: horloge
const rest=ev.filter(e=>e.restored||/restored|sw-restart|service-worker/.test(e.type));console.log('restored/sw events',rest.length);
console.log('record/clock keys', Object.keys(j.machine||{}).join(','));
{const pt=ev.filter(e=>e.type==='phase-timing');console.log('clockId distincts',[...new Set(pt.map(e=>e.clockId))].map(x=>x.slice(0,8)),'timeOrigin',[...new Set(pt.map(e=>e.timeOrigin))].map(x=>new Date(x).toISOString()),'lost',pt.map(e=>e.lost).filter(x=>x!=null).join(','));}
const clocks={};for(const e of ev){const k=e.sessionId||e.swSession||e.clock;if(k)clocks[k]=(clocks[k]||0)+1;}console.log('sessionId distincts',Object.keys(clocks).length,JSON.stringify(Object.entries(clocks).map(([k,v])=>[k.slice(0,8),v])));
// poses
fs.writeFileSync(R+'res/lot'+part+'-cuts.json',JSON.stringify({B,t0,t1,tr0,tr1,cuts:cuts.map(c=>({cut:c,etape:stageOf(c),pose:el.has(c)}))}));
