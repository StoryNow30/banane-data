#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const args=process.argv.slice(2),i=args.indexOf('--data');
if(i<0||!args[i+1])throw Error('usage: --data <dataset>');
const DATA=path.resolve(args[i+1]);
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
function loadNode(node){
  if(node.kind==='single-json')return load(path.join(DATA,node.file.path));
  if(node.kind==='array-shards'){
    const out=[];
    for(const s of node.shards||[])s?.oversizeItem?out.push(loadNode(s.node)):out.push(...load(path.join(DATA,s.path)));
    return out;
  }
  if(node.kind==='object-shards'){
    const out={};
    for(const s of node.shards||[])Object.assign(out,load(path.join(DATA,s.path)));
    for(const[k,v]of Object.entries(node.largeEntries||{}))out[k]=loadNode(v);
    return out;
  }
  if(node.kind==='scalar-text-parts')return JSON.parse((node.parts||[]).map(p=>fs.readFileSync(path.join(DATA,p.path),'utf8')).join(''));
  throw Error('unsupported node '+node.kind);
}
const outDir=path.join(DATA,'.runner-expanded');fs.mkdirSync(outDir,{recursive:true});
let oversizeExpanded=0,embeddedCloudArraysExposed=0,embeddedClouds=0,counter=0;
for(const archive of ['historical','final']){
  const root=path.join(DATA,archive);if(!fs.existsSync(root))continue;
  for(const e of fs.readdirSync(root,{withFileTypes:true})){
    if(!e.isDirectory())continue;
    const ip=path.join(root,e.name,'_index.json');if(!fs.existsSync(ip))continue;
    const idx=load(ip),rep=idx.semanticRepresentation;
    if(rep?.kind!=='object-shards')continue;
    let clouds=rep.largeEntries?.clouds??null;
    const embedded=[];
    for(const s of rep.shards||[]){
      const obj=load(path.join(DATA,s.path));
      if(Array.isArray(obj.clouds)&&obj.clouds.length)embedded.push(...obj.clouds);
    }
    if(embedded.length){
      const rel=`.runner-expanded/${archive}-embedded-${counter++}.json`,fp=path.join(DATA,rel);
      fs.writeFileSync(fp,JSON.stringify(embedded));
      if(!rep.largeEntries)rep.largeEntries={};
      if(!clouds){clouds={kind:'array-shards',length:0,shards:[]};rep.largeEntries.clouds=clouds;}
      if(clouds.kind!=='array-shards')throw Error(`unexpected clouds kind ${clouds.kind}`);
      clouds.shards.push({path:rel,bytes:fs.statSync(fp).size,runnerExposedFromRootObject:true});
      clouds.length=(clouds.length||0)+embedded.length;
      embeddedCloudArraysExposed++;embeddedClouds+=embedded.length;
    }
    if(clouds?.kind==='array-shards'){
      clouds.shards=(clouds.shards||[]).map((s,n)=>{
        if(!s?.oversizeItem)return s;
        const value=loadNode(s.node),rel=`.runner-expanded/${archive}-oversize-${counter++}-${n}.json`,fp=path.join(DATA,rel);
        fs.writeFileSync(fp,JSON.stringify([value]));oversizeExpanded++;
        return{path:rel,bytes:fs.statSync(fp).size,runnerExpandedFromOversizeItem:true};
      });
    }
    fs.writeFileSync(ip,JSON.stringify(idx));
  }
}
console.log(JSON.stringify({oversizeExpanded,embeddedCloudArraysExposed,embeddedClouds}));
