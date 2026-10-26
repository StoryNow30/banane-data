const fs=require('fs');const T=process.env.S+'/wt/T23/tools/';
const D=require(T+'diag-differes.cjs');
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const lots=D.lotsDuJournal(j);
for(const L of lots){
  console.log('LOT',L.id.slice(0,8),'partie',L.partie,'debut',L.debut,'dureeMin',L.dureeMin,'version',L.version);
  console.log(Object.keys(L).join(','));
  console.log(JSON.stringify({reglages:L.reglages,invalidesAuDepart:L.invalidesAuDepart,totalPartie:L.totalPartie,traites:L.traites}));
  console.log(JSON.stringify(L.cuts.map(c=>[c.cut,c.stage,c.reason&&c.reason.slice(0,40),c.commande&&c.commande.action,c.pose?1:0])));
  console.log(JSON.stringify(L.relecture));
}
