#!/usr/bin/env node
'use strict';
/*
 * scenarios.cjs — lot 4.7.18 de la partie 9 rejoué aux règles actuelles, jugé
 * par la relecture Natif du 25/09 (14:49–15:07), sous quatre hypothèses :
 *
 *   S0  règles 4.7.20 (= 4.7.19), « appliquer », appuis = cuts posés ;
 *   S1  S0 + voisins validés avant le lot (D-054, garde telle que livrée) ;
 *   S2  S0 + vue corrigée : une position décidée hors de la vue est commandée
 *       (hypothèse D-043 : recadrage avant le clic) ;
 *   S3  S1 + S2 ;
 *   S1b S0 + voisins validés en DERNIER RECOURS : la décision est d'abord prise
 *       sans eux ; ils ne servent que si le cut serait sinon différé ;
 *   S3b S1b + S2.
 *
 *   node --max-old-space-size=13000 scenarios.cjs LOT-4718 RELECTURE SORTIE.json
 *
 * Aucune pose humaine n'entre dans une décision, sauf, en S1/S3, les poses des
 * VOISINS validés avant le lot (lues à l'ouverture de chaque cut hors lot dans
 * la relecture), sous la garde `consistentValidated`. Le jugement est celui de
 * `tools/acceptance-report.cjs`. Partie 9 = validation : rien n'est réglé ici.
 */
const B=process.env.BANANE||'/home/user/banane';
const A=require(B+'/tools/acceptance-report.cjs'),V=require(B+'/tools/validated-anchors-study.cjs'),L0=require(B+'/src/lot-decision.js');
const fs=require('node:fs');
const [dir,relecture,out]=process.argv.slice(2);
/* Le diagnostic du lot 4.7.18 couvre aussi les lots des parties 2 et 3. */
const lot=Object.assign(A.loadLot(dir,'p9-4718',relecture),{batchFilter:'09d3c4f0-52c4-4245-959f-b180165ce951'});
const opts=deps=>({replay:true,preferReplay:true,currentRules:true,...(deps?{replayDeps:deps}:{})});
const s0=A.report([lot],opts());
const validated=V.validatedNeighbours(lot,s0.lots[0]);
const withValidated={L:{...L0,decideCut:args=>L0.decideCut({...args,validated})}};
const s1=A.report([lot],opts(withValidated));
/* Dernier recours : les voisins validés ne changent aucune décision prise sans eux. */
const lastResort=L=>args=>{const d=L.decideCut(args);return d.stage==='deferred'?L.decideCut({...args,validated}):d;};
const s1b=A.report([lot],opts({L:{...L0,decideCut:lastResort(L0)}}));
/* Vue corrigée : la commande consignée « hors-vue » est oubliée, et le rejeu
 * simule la commande avec une vue supposée bonne. */
let stripped=0;
for(const o of lot.diagnostic?.observations||[])if(/^hors-vue/.test(o.lotObservation?.command?.reason||'')){delete o.lotObservation.command;stripped++;}
const inView=()=>({inView:true});
const s2=A.report([lot],opts({L:{...L0,inView}}));
const s3=A.report([lot],opts({L:{...L0,inView,decideCut:args=>L0.decideCut({...args,validated})}}));
const s3b=A.report([lot],opts({L:{...L0,inView,decideCut:lastResort(L0)}}));
const S={S0:s0,S1:s1,S2:s2,S3:s3,S1b:s1b,S3b:s3b};
const line=r=>{const d=r.total.lotDecision;return {decided:d.wouldApply,coveragePct:d.coveragePct,judged:d.judged,wrong:d.wrong,newWrong:d.newWrong,lost:d.lost};};
const rows=s0.lots[0].rows.map(r=>{const x={cut:r.cut,pilot:r.outcome,start:r.lot?.stage==null||!r.lot?.wouldApply?(r.judgement?.worstMm??null):null,relu:r.judgement?.status==='judged'?r.judgement.basis:(r.judgement?.reason??null)};
  for(const [k,s] of Object.entries(S)){const y=s.lots[0].rows.find(z=>z.cut===r.cut)?.lot;x[k]=y?{stage:y.stage,reason:y.reason,worstMm:y.worstMm??null,wrong:y.wrong??null,errors:y.errors??null}:null;}
  return x;});
fs.writeFileSync(out,JSON.stringify({format:'banane-p9-scenarios-v1',relecture,strippedHorsVue:stripped,validatedNeighbours:validated.length,
  totals:Object.fromEntries(Object.entries(S).map(([k,s])=>[k,line(s)])),rows},null,1)+'\n');
for(const [k,s] of Object.entries(S)){const t=line(s);console.log(k,`${t.decided}/346 (${t.coveragePct} %) · ${t.wrong} faux / ${t.judged} jugés · faux nouveaux ${t.newWrong.join(',')||'—'} · perdus ${t.lost.join(',')||'—'}`);}
console.log('commandes hors-vue oubliées (S2/S3) :',stripped,'· voisins validés :',validated.length);
