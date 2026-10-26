const fs=require('fs');const S=process.env.S;const p=+process.argv[2];const R=S+'/p01/';
const ef=fs.readdirSync(R+'data/echo'+p).filter(x=>/echo-2026/.test(x)).map(x=>R+'data/echo'+p+'/'+x);
const paris=t=>{const d=new Date(Date.parse(t)+3600e3);return d.toISOString().slice(11,19).replace(/^(\d\d):(\d\d):(\d\d)/,'$1 h $2 min $3 s');};
for(const f of ef){const j=JSON.parse(fs.readFileSync(f,'utf8'));
 console.log(f.split('/').pop(),'segment',JSON.stringify(j.segment&&{i:j.segment.index,obj:j.segment.objects}));
 console.log(' session',paris(j.session.startedAt),'→',paris(j.session.finishedAt),'statut',j.session.status,'visites',j.records.length);
 const cuts=new Set(j.records.map(r=>r.identity&&r.identity.part+'|'+r.identity.cut));console.log(' cuts distincts',cuts.size,'parties',JSON.stringify([...new Set(j.records.map(r=>r.identity&&r.identity.part))]));
 const ev=j.events;const t={};for(const e of ev)t[e.type]=(t[e.type]||0)+1;
 console.log(' échecs capture',t['native-capture-failed']||0,'page perdue',t['native-page-lost']||0,'interruptions',j.session.interruptions);
 const c=j.closureSummary;console.log(' captureHealth',JSON.stringify(c.captureHealth.terminations),'qualifiedInitialRate',JSON.stringify(c.captureHealth.qualifiedInitialSnapshotRateByRail));
 console.log(' quality: snapshotsQualified',j.session.quality.snapshotsQualified,'/',j.session.quality.snapshotsTotal,'exclusions',JSON.stringify(j.session.quality.exclusionReasons),'railsObserved',j.session.quality.railsObserved,'railsQualified',j.session.quality.railsQualified);
 console.log(' usableByRail',JSON.stringify(c.usableByRail),'usablePairs',c.usablePairs,'geometryLossCauses',JSON.stringify(c.geometryLossCauses));
 const pl=ev.filter(e=>e.type==='native-page-lost').map(e=>paris(e.timestamp)+' '+e.reason);console.log(' pages perdues',pl.join(' ; '));
 const empt=ev.filter(e=>e.type==='native-capture-ready'&&/empty|vide/.test(JSON.stringify(e).slice(0,3000))).length;console.log(' capture-ready avec marque vide',empt);
}
