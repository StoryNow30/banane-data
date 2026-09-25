const j=require(process.argv[2]);const rows=j.rows.filter(r=>r.levelCrossing);
const LAT=+process.argv[3],Z=+process.argv[4];
const errs=[];let cuts=0,both=0,faux=0,fauxList=[];
for(const r of rows){const e=["left","right"].map(s=>r.edges[s]);if(!e.every(x=>x.reader&&x.reader.edgeMm!=null))continue;both++;
 if(!e.every(x=>Number.isFinite(x.humanMinusReaderMm)))continue;cuts++;
 const w=e.map(x=>({lat:x.humanMinusReaderMm-LAT,z:Math.round((x.humanMinusReaderZMm-Z)*10)/10}));errs.push(...w);
 if(w.some(x=>Math.abs(x.lat)>10||Math.abs(x.z)>10)){faux++;fauxList.push(r.source+":"+r.cut+" "+JSON.stringify(w)+" w/g "+e.map(x=>x.reader.widthMm+"/"+x.reader.grooves).join(","));}}
const q=(v,p)=>{const s=v.slice().sort((a,b)=>a-b);return s[Math.floor(p*(s.length-1))];};
const al=errs.map(x=>Math.abs(x.lat)),az=errs.map(x=>Math.abs(x.z));
console.log("PN cuts",rows.length,"lisibles 2 rails",both,"jugés",cuts,"faux",faux);
console.log("lat |med|",q(al,.5),"p90",q(al,.9),"max",Math.max(...al)," z |med|",q(az,.5),"p90",q(az,.9),"max",Math.max(...az));
console.log(fauxList.join("\n"));
