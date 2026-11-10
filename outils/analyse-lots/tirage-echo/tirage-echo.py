#!/usr/bin/env python3
"""Séance Écho tirée au sort (D-285 point 4, D-322) : les plages de coupes posées par Ariane dans un lot, avec un tirage au sort de plages
entières (au moins N coupes) pour une séance courte, plus tous les différés du lot.
Usage : python3 -I tirage-echo.py <volume01.zip du lot> [--n 150] [--graine 20261110] [--sortie liste.txt]
Lecture seule. Sortie : numéros de partie et de coupe, comptes ; aucun identifiant. Tirage reproductible : les plages sont rangées par
SHA-256 de « graine:partie:début » et prises dans cet ordre jusqu'à atteindre N coupes (tirage par grappes : les fautes viennent en séries)."""
import zipfile, sys, json, hashlib
a = sys.argv[1:]
opt = lambda n, d: a[a.index(n) + 1] if n in a else d
N, G, SORTIE = int(opt('--n', '150')), opt('--graine', '20261110'), opt('--sortie', None)
z = zipfile.ZipFile(a[0])
j = json.loads(z.read([i for i in z.namelist() if i.startswith('ariane-journal-v4')][0]))
ev = sorted(j['events'], key=lambda e: e.get('timestamp', ''))
r0 = next((e['timestamp'] for e in ev if e.get('type') == 'relecture-debut'), '9')
poses, differes, passe = set(), set(), set()
for e in ev:
    i = e.get('identity') or {}
    c, p, t = i.get('cut'), i.get('part'), e.get('type')
    if not isinstance(c, int): continue
    if t == 'validation-accepted' and e.get('timestamp', '') < r0: poses.add((p, c))
    elif t == 'defer-intent': differes.add((p, c))
    elif t == 'passe-differes-ecriture' and e.get('resultat') == 'ecrit': passe.add((p, c))
P = []
for p, c in sorted(poses):
    if P and P[-1][0] == p and c == P[-1][2] + 1: P[-1][2] = c
    else: P.append([p, c, c])
tires, cumul = set(), 0
for p, d, f in sorted(P, key=lambda x: hashlib.sha256(f'{G}:{x[0]}:{x[1]}'.encode()).hexdigest()):
    if cumul >= N: break
    tires.add((p, d)); cumul += f - d + 1
L = [f'Séance Écho tirée au sort — paquet {j.get("build")} — graine {G}',
     f'Posés par Ariane dans le lot : {len(poses)} coupes en {len(P)} plages. Tirage court : {len(tires)} plages, {cumul} coupes (marquées *).',
     f'Différés du lot : {len(differes)} (dont posés ensuite par la deuxième passe : {len(passe & differes)}).', '',
     'PLAGES POSÉES (dans l\'ordre ; * = tirée au sort pour la séance courte) :']
for p, d, f in P: L.append(f'  {"*" if (p, d) in tires else " "} partie {p} : {d}' + (f' à {f}' if f != d else '') + f'   ({f - d + 1})')
L += ['', 'DIFFÉRÉS DU LOT (tous) :'] + [f'    partie {p} : {c}' + (' (posé par la deuxième passe)' if (p, c) in passe else '') for p, c in sorted(differes)]
txt = '\n'.join(L) + '\n'
if SORTIE: open(SORTIE, 'w').write(txt)
print(txt)
