#!/usr/bin/env python3
"""extraire.py — sort des archives de banane-data les lots représentatifs de
l'audit qualité 4.8 (kit du 28/09/2026), dans un dossier de travail.

    python3 extraire.py DESTINATION [NOM ...]

Sans NOM, tout est extrait (environ 2,5 Go une fois décompressé). Les noms :
voir LOTS ci-dessous ou `python3 extraire.py --liste`. Nécessite py7zr
(`pip install py7zr`) ou la commande `7z`. Les archives découpées en
`.zip.partNNN` sont recollées puis décompressées. Rien n'est modifié dans le
dépôt.
"""
import os, shutil, subprocess, sys, tempfile, zipfile
ICI = os.path.dirname(os.path.abspath(__file__))
C = os.path.normpath(os.path.join(ICI, '..', '..', 'collections'))
LOTS = {
  'p12-lot-4720':      ['2026-09-26_v4.7.20_/pilote p12/lot-p12-4.7.20.7z'],
  'p12-relecture':     ['2026-09-26_v4.7.20_/relecture p12/relecture-p12-4.7.21.7z'],
  'p11-lot-4720':      ['2026-09-26_v4.7.20_/pilote p11/lot-p11-4.7.20.7z'],
  'p9-lot-4718':       ['2026-09-25_v4.7.18_/pilote p9 long/lot-p9-4.7.18-%d.7z' % i for i in (1, 2, 3)],
  'p9-lot-4719':       ['2026-09-25_v4.7.19_/pilote p9 differes/lot-p9-4.7.19-bilan.7z',
                        '2026-09-25_v4.7.19_/pilote p9 differes/lot-p9-4.7.19-corpus.7z'],
  'p9-relecture':      ['2026-09-25_v4.7.19_/relecture p9/relecture-p9-4.7.19-%d.7z' % i for i in range(1, 6)],
  'p6-lot-4719':       ['2026-09-25_v4.7.19_/pilote p6 reliquat/lot-p6-4.7.19-%d.7z' % i for i in (1, 2, 3)],
  'p13-4721':          ['2026-09-26_v4.7.21_/interruptions p13-p14/INTERRUPTION_A_VOIR.7z'],
  'p14-4721':          ['2026-09-26_v4.7.21_/interruptions p13-p14/LOT_14_INTERRUPTION.zip.part%03d' % i for i in range(1, 6)],
}
def sept(archive, dest):
    try:
        import py7zr
        with py7zr.SevenZipFile(archive) as z: z.extractall(dest)
    except ImportError:
        if not shutil.which('7z'): sys.exit('Ni py7zr ni 7z : pip install py7zr')
        subprocess.run(['7z', 'x', '-y', '-o' + dest, archive], check=True, stdout=subprocess.DEVNULL)
def aplatir(dest):
    """Les archives de l'opérateur ont parfois un dossier : tout revient à la racine du lot."""
    for racine, _, fichiers in os.walk(dest):
        if racine == dest: continue
        for f in fichiers: shutil.move(os.path.join(racine, f), os.path.join(dest, f))
    for racine, dossiers, _ in os.walk(dest, topdown=False):
        for d in dossiers: os.rmdir(os.path.join(racine, d))
def extraire(nom, destination):
    dest = os.path.join(destination, nom); os.makedirs(dest, exist_ok=True)
    parts = [os.path.join(C, a) for a in LOTS[nom]]
    for p in parts:
        if not os.path.exists(p): sys.exit('Archive absente : ' + p)
    if parts[0].endswith('.part001'):
        with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as t:
            for p in parts:
                with open(p, 'rb') as f: shutil.copyfileobj(f, t)
        try:
            with zipfile.ZipFile(t.name) as z: z.extractall(dest)
        finally: os.unlink(t.name)
    else:
        for p in parts: sept(p, dest)
    aplatir(dest)
    fichiers = sorted(os.listdir(dest))
    print('%-15s %3d fichiers, %6.0f Mo' % (nom, len(fichiers), sum(os.path.getsize(os.path.join(dest, f)) for f in fichiers) / 1048576))
if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or args[0] == '--liste':
        print('\n'.join('%-15s %s' % (k, ' + '.join(v)) for k, v in LOTS.items())); sys.exit(0)
    noms = args[1:] or list(LOTS)
    for n in noms:
        if n not in LOTS: sys.exit('Nom inconnu : %s (voir --liste)' % n)
        extraire(n, args[0])
