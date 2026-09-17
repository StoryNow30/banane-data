#!/usr/bin/env python3
import argparse, hashlib, json, shutil
from pathlib import Path

MAX_JSON_BYTES = 4 * 1024 * 1024
DIRECT_COPY_BYTES = 4 * 1024 * 1024
FORMAT = "banane-data-materialized-dataset-v1"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def compact_bytes(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf-8')


def safe_component(text: str) -> str:
    out = []
    for ch in text:
        if ch.isalnum() or ch in ('-', '_', '.'):
            out.append(ch)
        else:
            out.append('_')
    s = ''.join(out).strip('._')
    return s or 'root'


def write_json(path: Path, value) -> dict:
    path.parent.mkdir(parents=True, exist_ok=True)
    data = compact_bytes(value) + b'\n'
    path.write_bytes(data)
    return {"path": path.as_posix(), "bytes": len(data), "sha256": sha256_bytes(data)}


def rel_entry(out_root: Path, entry: dict) -> dict:
    e = dict(entry)
    e['path'] = Path(e['path']).relative_to(out_root).as_posix()
    return e


def materialize_value(value, node_dir: Path, out_root: Path, label: str = 'root') -> dict:
    encoded = compact_bytes(value)
    if len(encoded) <= MAX_JSON_BYTES:
        entry = write_json(node_dir / f"{safe_component(label)}.json", value)
        return {"kind": "single-json", "file": rel_entry(out_root, entry)}

    node_dir.mkdir(parents=True, exist_ok=True)
    if isinstance(value, list):
        shards = []
        current = []
        current_size = 2
        index = 0
        for item in value:
            item_bytes = compact_bytes(item)
            projected = current_size + len(item_bytes) + (1 if current else 0)
            if current and projected > MAX_JSON_BYTES:
                entry = write_json(node_dir / f"{safe_component(label)}-part-{index:04d}.json", current)
                shards.append(rel_entry(out_root, entry))
                index += 1
                current, current_size = [], 2
            if len(item_bytes) + 2 > MAX_JSON_BYTES:
                if current:
                    entry = write_json(node_dir / f"{safe_component(label)}-part-{index:04d}.json", current)
                    shards.append(rel_entry(out_root, entry))
                    index += 1
                    current, current_size = [], 2
                child = materialize_value(item, node_dir / f"{safe_component(label)}-item-{index:04d}", out_root, 'value')
                shards.append({"oversizeItem": True, "index": index, "node": child})
                index += 1
                continue
            current.append(item)
            current_size += len(item_bytes) + (1 if len(current) > 1 else 0)
        if current:
            entry = write_json(node_dir / f"{safe_component(label)}-part-{index:04d}.json", current)
            shards.append(rel_entry(out_root, entry))
        return {"kind": "array-shards", "length": len(value), "shards": shards}

    if isinstance(value, dict):
        shards = []
        large_entries = {}
        current = {}
        current_size = 2
        shard_index = 0
        for key, item in value.items():
            pair_bytes = compact_bytes({key: item})
            projected = current_size + max(0, len(pair_bytes) - 2) + (1 if current else 0)
            if len(pair_bytes) <= MAX_JSON_BYTES and projected <= MAX_JSON_BYTES:
                current[key] = item
                current_size = projected
                continue
            if current:
                entry = write_json(node_dir / f"{safe_component(label)}-object-{shard_index:04d}.json", current)
                shards.append(rel_entry(out_root, entry))
                shard_index += 1
                current, current_size = {}, 2
            if len(pair_bytes) <= MAX_JSON_BYTES:
                current[key] = item
                current_size = len(pair_bytes)
            else:
                child = materialize_value(item, node_dir / f"{safe_component(label)}-key-{safe_component(str(key))}", out_root, 'value')
                large_entries[str(key)] = child
        if current:
            entry = write_json(node_dir / f"{safe_component(label)}-object-{shard_index:04d}.json", current)
            shards.append(rel_entry(out_root, entry))
        return {"kind": "object-shards", "keys": len(value), "shards": shards, "largeEntries": large_entries}

    text = json.dumps(value, ensure_ascii=False)
    parts = []
    chunk_chars = 2 * 1024 * 1024
    for i in range(0, len(text), chunk_chars):
        p = node_dir / f"{safe_component(label)}-scalar-{len(parts):04d}.txt"
        p.parent.mkdir(parents=True, exist_ok=True)
        data = text[i:i + chunk_chars].encode('utf-8')
        p.write_bytes(data)
        parts.append(rel_entry(out_root, {"path": p.as_posix(), "bytes": len(data), "sha256": sha256_bytes(data)}))
    return {"kind": "scalar-text-parts", "parts": parts}


def materialize_file(src: Path, cohort: str, cohort_root: Path, out_root: Path) -> dict:
    raw = src.read_bytes()
    record = {
        "cohort": cohort,
        "sourceRelPath": src.name,
        "sourceBytes": len(raw),
        "sourceSha256": sha256_bytes(raw),
    }
    if src.suffix.lower() not in ('.json', '.jsonl'):
        record['representation'] = 'not-materialized-non-json'
        return record

    target_base = cohort_root / safe_component(src.name)
    if len(raw) <= DIRECT_COPY_BYTES:
        target = cohort_root / src.name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        record['representation'] = 'exact-json-copy'
        record['outputs'] = [rel_entry(out_root, {"path": target.as_posix(), "bytes": len(raw), "sha256": sha256_bytes(raw)})]
        return record

    try:
        value = json.loads(raw.decode('utf-8'))
    except Exception as exc:
        raise RuntimeError(f"Cannot parse large JSON {src}: {exc}") from exc

    descriptor = materialize_value(value, target_base, out_root)
    descriptor_path = target_base / '_index.json'
    descriptor_entry = write_json(descriptor_path, {
        "format": "banane-data-json-shard-index-v1",
        "sourceName": src.name,
        "sourceBytes": len(raw),
        "sourceSha256": sha256_bytes(raw),
        "semanticRepresentation": descriptor,
    })
    record['representation'] = descriptor['kind']
    record['index'] = rel_entry(out_root, descriptor_entry)
    return record


def iter_files(root: Path):
    for p in sorted(root.rglob('*')):
        if p.is_file():
            yield p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--historical-dir', required=True)
    ap.add_argument('--final-dir', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    hist = Path(args.historical_dir)
    final = Path(args.final_dir)
    out = Path(args.out)
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    manifest = {
        "format": FORMAT,
        "datasetId": "native-v4.6-2026-09-16",
        "releaseTag": "native-v4.6-2026-09-16",
        "sourceArchives": [
            {"cohort": "historical", "name": "banane-native-v4.6-2026-09-16.7z", "bytes": 34509008, "sha256": "32e48aa79de988ab8bb6efc65d7038d4e27535e2a5f2486768438616f518bfc0"},
            {"cohort": "final", "name": "banane-native-v4.6-2026-09-16-final.7z", "bytes": 56657500, "sha256": "7cac220bd6e097f14ff1d39cbc431e7c6e918b819bdf521883bc33847ec12c66"},
        ],
        "policy": {
            "releaseAssetsRemainRawAuthority": True,
            "materializedFilesAreDevelopmentView": True,
            "maxJsonShardBytes": MAX_JSON_BYTES,
            "directCopyLimitBytes": DIRECT_COPY_BYTES,
        },
        "files": [],
    }

    for cohort, root in [('historical', hist), ('final', final)]:
        cohort_root = out / cohort
        source_files = list(iter_files(root))
        for src in source_files:
            rec = materialize_file(src, cohort, cohort_root, out)
            rec['sourceRelPath'] = src.relative_to(root).as_posix()
            manifest['files'].append(rec)

    manifest['counts'] = {
        "historicalFiles": sum(1 for x in manifest['files'] if x['cohort'] == 'historical'),
        "finalFiles": sum(1 for x in manifest['files'] if x['cohort'] == 'final'),
        "totalFiles": len(manifest['files']),
        "jsonFiles": sum(1 for x in manifest['files'] if x.get('representation') != 'not-materialized-non-json'),
    }
    write_json(out / 'manifest.json', manifest)
    print(json.dumps(manifest['counts']))


if __name__ == '__main__':
    main()
