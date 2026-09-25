#!/usr/bin/env python3
"""Extrait tous les exports de la partie 9 dans DOSSIER/lot-4718 et DOSSIER/lot-4719,
en contrôlant l'empreinte de chaque archive et de chaque fichier.
Usage : python3 benchmarks/partie-9-2026-09-25/extraire.py DOSSIER   (pip install py7zr)"""
import hashlib, json, os, sys
import py7zr
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
here = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
m = json.load(open(os.path.join(here, 'manifest.json')))
for a in m['archives']:
    src = os.path.join(root, a['path'])
    if sha(src) != a['sha256']: sys.exit(f'Empreinte différente : {a["path"]}')
    dest = os.path.join(out, a['extractTo']); os.makedirs(dest, exist_ok=True)
    with py7zr.SevenZipFile(src) as z: z.extractall(dest)
    for e in a['entries']:
        if sha(os.path.join(dest, e['name'])) != e['sha256']: sys.exit(f'Empreinte différente : {e["name"]}')
    print('ok', a['path'], '→', a['extractTo'])
