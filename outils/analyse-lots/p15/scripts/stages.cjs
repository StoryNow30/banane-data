const fs=require('fs');
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const ev=j.events.slice().sort((a,b)=>(a.timestamp||'').localeCompare(b.timestamp||''));
const B='a1f5269b-424b-4262-a172-da6e1e6574bf';
const dec={};
for(const e of ev) if(e.type==='gcv1-shadow-observed'&&e.batchId===B) dec[e.identity.cut]=e;
const rows=[];
for(const [c,e] of Object.entries(dec)){const lo=e.lotObservation||{};const cmd=lo.command||{};const l1=lo.l1||{};
 rows.push([+c,lo.stage,lo.reason,cmd.action,cmd.reason,cmd.l1s,l1.etat,l1.zone,l1.ecartDepartMm,(l1.commande||{}).vue]);}
rows.sort((a,b)=>a[0]-b[0]);
for(const r of rows) console.log(JSON.stringify(r));
const cnt={};for(const r of rows){const k=[r[1],r[3],r[4],r[5]].join('|');cnt[k]=(cnt[k]||0)+1;}
console.log(cnt);
const e0=Object.values(dec)[0];console.log(JSON.stringify(e0.lotObservation).slice(0,1500));
const rm={};for(const e of ev) if(e.type==='regles-metier-ombre'&&e.batchId===B){const k=[e.portee,e.reel&&e.reel.stage,e.reel&&e.reel.action,e.aurait,(e.regles||[]).join(',')].join('|');rm[k]=(rm[k]||0)+1;}
console.log(rm);
const b1={};for(const e of ev) if(e.type==='b1-ombre'&&e.batchId===B){const k=[e.reel&&e.reel.stage,e.reel&&e.reel.reason,e.etat].join('|');b1[k]=(b1[k]||0)+1;}
console.log(b1);
