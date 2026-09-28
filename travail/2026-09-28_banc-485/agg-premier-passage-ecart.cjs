// Garde d'écartement des premiers passages sans appui : chaque règle contre la base, tous jeux.
const fs=require('fs'),dir=process.env.PP_DIR||__dirname;
const jeux=fs.readdirSync(dir).filter(f=>new RegExp('^'+(process.env.PP_PREFIX||'pp')+'-[a-h]\\.json$').test(f)).sort();
const regles=process.argv.slice(2).length?process.argv.slice(2):['sans-appui-ecart-1420-1460','sans-appui-ecart-1425-1455','sans-appui-esv-100','esv-100'];
const cut=x=>x?.cut??x,out={jeux:[],regles:{}};
let base={applied:0,judged:0,wrong:[],fpSansAppui:0,fpSansAppuiJug:0};
for(const f of jeux){const j=JSON.parse(fs.readFileSync(dir+'/'+f,'utf8'));
  for(const s of j.sessions){out.jeux.push(f.slice(3,4)+':'+s.label);base.applied+=s.base.applied;base.judged+=s.base.judged||0;base.wrong.push(...(s.base.wrong||[]).map(w=>s.label+':'+cut(w)));
    const fp=(s.base.firstPass||[]).filter(x=>x.feature?.anchors===0);base.fpSansAppui+=fp.length;
    for(const r of regles){const v=s.variants?.[r];if(!v)continue;const a=out.regles[r]??={applied:0,wrong:0,stoppedWrong:[],lostRight:[],removedUnjudged:[],gained:[],newWrong:[]};
      a.applied+=v.applied;a.wrong+=typeof v.wrong==='number'?v.wrong:(v.wrong||[]).length;
      for(const k of ['stoppedWrong','lostRight','removedUnjudged','gained','newWrong'])a[k].push(...(v[k]||[]).map(x=>s.label+':'+cut(x)));}}}
console.log('jeux',out.jeux.join(' '));
console.log('base appliqués',base.applied,'jugés',base.judged,'faux',base.wrong.length,base.wrong.join(' '),'| premiers passages sans appui',base.fpSansAppui);
for(const [r,a] of Object.entries(out.regles))console.log(r.padEnd(28),'appliqués',a.applied,'faux',a.wrong,'| arrêtés',a.stoppedWrong.join(' ')||'—','| justes perdus',a.lostRight.length,a.lostRight.slice(0,12).join(' '),'| non jugés perdus',a.removedUnjudged.length,'| gagnés',a.gained.length,'| nouveaux faux',a.newWrong.join(' ')||'—');
out.base=base;fs.writeFileSync(__dirname+'/bilan-premier-passage-'+(process.env.PP_PREFIX==='pb'?'bas':'ecart')+'.json',JSON.stringify(out,null,1));
