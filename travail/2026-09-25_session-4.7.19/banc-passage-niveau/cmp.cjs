const S=process.argv[2];const load=n=>['a','b','c','d'].flatMap(p=>{try{return require(`${S}/pnb/${n}-${p}.json`).rows.map(r=>({...r,set:p}));}catch{return [];}});
const off=load('off'),on=load('on'),key=r=>r.source+':'+r.cut;
const tot=rows=>({decided:rows.length,judged:rows.filter(r=>r.judged).length,wrong:rows.filter(r=>r.wrong).length,wrongCuts:rows.filter(r=>r.wrong).map(r=>key(r)+' '+r.stage+' '+r.worstMm)});
console.log('off',JSON.stringify(tot(off)));console.log('on ',JSON.stringify(tot(on)));
const mo=new Map(off.map(r=>[key(r),r])),mn=new Map(on.map(r=>[key(r),r]));
const gained=on.filter(r=>!mo.has(key(r))),lost=off.filter(r=>!mn.has(key(r)));
const changed=on.filter(r=>mo.has(key(r))&&(mo.get(key(r)).stage!==r.stage||Math.abs((mo.get(key(r)).worstMm??0)-(r.worstMm??0))>0.5));
const st=rows=>rows.reduce((m,r)=>(m[r.stage]=(m[r.stage]||0)+1,m),{});
console.log('gagnés',gained.length,JSON.stringify(st(gained)),'jugés',gained.filter(r=>r.judged).length,'faux',gained.filter(r=>r.wrong).map(r=>key(r)+' '+r.worstMm));
console.log(' ',gained.map(r=>key(r)+'/'+r.stage+(r.judged?'/'+r.worstMm:'')).join(' '));
console.log('perdus',lost.length,JSON.stringify(st(lost)),'dont justes',lost.filter(r=>r.judged&&!r.wrong).map(key),'faux',lost.filter(r=>r.wrong).map(r=>key(r)+' '+r.worstMm),'non jugés',lost.filter(r=>!r.judged).map(key).join(' '));
console.log('changés',changed.length);for(const r of changed){const o=mo.get(key(r));console.log('  ',key(r),o.stage,o.worstMm,'->',r.stage,r.worstMm);}
