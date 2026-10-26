const fs=require('fs');
for(const f of process.argv.slice(2)){const j=JSON.parse(fs.readFileSync(f,'utf8'));const c=j.closureSummary,q=j.session.quality;
 const paris=t=>new Date(Date.parse(t)+3600e3).toISOString().slice(11,19);
 console.log(f.split('/').slice(-2).join('/'),'session',paris(j.session.startedAt),'→',paris(j.session.finishedAt),'visites',j.records.length);
 console.log('  snapshots qualifiés',q.snapshotsQualified,'/',q.snapshotsTotal,'=',(100*q.snapshotsQualified/q.snapshotsTotal).toFixed(1)+'%','| exclusions roi-point-count-below-minimum',q.exclusionReasons['roi-point-count-below-minimum'],'('+(100*q.exclusionReasons['roi-point-count-below-minimum']/q.snapshotsTotal).toFixed(1)+'%)','engine-useful-point-count-below-minimum',q.exclusionReasons['engine-useful-point-count-below-minimum'],'('+(100*q.exclusionReasons['engine-useful-point-count-below-minimum']/q.snapshotsTotal).toFixed(1)+'%)');
 console.log('  taux initial qualifié G/D',c.captureHealth.qualifiedInitialSnapshotRateByRail.left.toFixed(2),c.captureHealth.qualifiedInitialSnapshotRateByRail.right.toFixed(2),'| rails observés/qualifiés',q.railsObserved,'/',q.railsQualified,'| usable G/D',c.usableByRail.left,c.usableByRail.right,'paires',c.usablePairs,'| visites',c.visits);
 console.log('  terminaisons',JSON.stringify(c.captureHealth.terminations),'échecs capture',j.events.filter(e=>e.type==='native-capture-failed').length);
}
