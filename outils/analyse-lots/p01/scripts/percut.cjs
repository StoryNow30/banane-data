const fs=require('fs');
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const B=process.argv[3];
const ev=j.events.filter(e=>e.timestamp).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
const by={};
for(const e of ev){ const c=e.identity&&e.identity.cut; if(c==null) continue; const b=e.batchId||(e.batch&&e.batch.id); if(b&&b!==B) continue;
  (by[c]=by[c]||[]).push(e);}
const want=process.argv.slice(4).map(Number);
for(const c of want){ console.log('=== cut',c); for(const e of by[c]||[]){ if(['adapter-progress','esv-observation','esv-releve','cut-target-changed','adapter-result'].includes(e.type)) continue; const o={...e}; delete o.eventId; delete o.identity; delete o.sessionId; delete o.schema; console.log(e.timestamp.slice(11),e.type,JSON.stringify(o).slice(0,700)); } }
