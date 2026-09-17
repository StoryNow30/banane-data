#!/usr/bin/env python3
import argparse, json
from pathlib import Path


def load_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def load_node(root: Path, node):
    kind = node['kind']
    if kind == 'single-json':
        return load_json(root / node['file']['path'])
    if kind == 'array-shards':
        out = []
        for shard in node['shards']:
            if isinstance(shard, dict) and shard.get('oversizeItem'):
                out.append(load_node(root, shard['node']))
            else:
                out.extend(load_json(root / shard['path']))
        if len(out) != node['length']:
            raise RuntimeError(f"Array length mismatch: {len(out)} != {node['length']}")
        return out
    if kind == 'object-shards':
        out = {}
        for shard in node['shards']:
            out.update(load_json(root / shard['path']))
        for key, child in node['largeEntries'].items():
            out[key] = load_node(root, child)
        if len(out) != node['keys']:
            raise RuntimeError(f"Object key-count mismatch: {len(out)} != {node['keys']}")
        return out
    if kind == 'scalar-text-parts':
        text = ''.join((root / p['path']).read_text(encoding='utf-8') for p in node['parts'])
        return json.loads(text)
    raise RuntimeError(f"Unknown node kind: {kind}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('index', help='Path to a materialized _index.json')
    ap.add_argument('--output', '-o', required=True)
    args = ap.parse_args()
    index_path = Path(args.index).resolve()
    root = index_path.parent
    while root != root.parent and not (root / 'manifest.json').exists():
        root = root.parent
    if not (root / 'manifest.json').exists():
        raise SystemExit('manifest.json not found above index path')
    idx = load_json(index_path)
    value = load_node(root, idx['semanticRepresentation'])
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(out)


if __name__ == '__main__':
    main()
