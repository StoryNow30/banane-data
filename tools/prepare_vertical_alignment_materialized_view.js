#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const arg = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const DATA = path.resolve(arg('--data') || 'datasets/native-v4.6-2026-09-16');

function loadJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, v) { fs.writeFileSync(p, JSON.stringify(v) + '\n'); }

function loadNode(node) {
  if (!node) return null;
  if (node.kind === 'single-json') return loadJson(path.join(DATA, node.file.path));
  if (node.kind === 'array-shards') {
    const out = [];
    for (const s of node.shards || []) {
      if (s && s.oversizeItem) out.push(loadNode(s.node));
      else out.push(...loadJson(path.join(DATA, s.path)));
    }
    if (out.length !== node.length) throw new Error(`array length mismatch ${out.length} != ${node.length}`);
    return out;
  }
  if (node.kind === 'object-shards') {
    const out = {};
    for (const s of node.shards || []) Object.assign(out, loadJson(path.join(DATA, s.path)));
    for (const [k, child] of Object.entries(node.largeEntries || {})) out[k] = loadNode(child);
    if (Object.keys(out).length !== node.keys) throw new Error(`object key mismatch ${Object.keys(out).length} != ${node.keys}`);
    return out;
  }
  if (node.kind === 'scalar-text-parts') {
    const text = (node.parts || []).map(p => fs.readFileSync(path.join(DATA, p.path), 'utf8')).join('');
    return JSON.parse(text);
  }
  throw new Error(`unsupported node ${node.kind}`);
}

function flattenOversizeArray(node, indexDir, relPrefix) {
  if (!node || node.kind !== 'array-shards') return 0;
  const simple = [];
  let expanded = 0;
  for (const s of node.shards || []) {
    if (!s || !s.oversizeItem) {
      simple.push(s);
      continue;
    }
    const item = loadNode(s.node);
    const name = `__lab-oversize-${String(expanded).padStart(4, '0')}.json`;
    const abs = path.join(indexDir, name);
    writeJson(abs, [item]);
    simple.push({ path: path.posix.join(relPrefix, name) });
    expanded++;
  }
  node.shards = simple;
  return expanded;
}

let indexes = 0;
let expanded = 0;
for (const cohort of ['historical', 'final']) {
  const root = path.join(DATA, cohort);
  if (!fs.existsSync(root)) continue;
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const indexPath = path.join(root, ent.name, '_index.json');
    if (!fs.existsSync(indexPath)) continue;
    const idx = loadJson(indexPath);
    const clouds = idx.semanticRepresentation?.largeEntries?.clouds;
    if (!clouds) continue;
    const relPrefix = path.relative(DATA, path.dirname(indexPath)).split(path.sep).join('/');
    const n = flattenOversizeArray(clouds, path.dirname(indexPath), relPrefix);
    if (n) {
      writeJson(indexPath, idx);
      expanded += n;
    }
    indexes++;
  }
}

console.log(JSON.stringify({ indexesWithClouds: indexes, oversizeCloudItemsExpanded: expanded, data: DATA }));
