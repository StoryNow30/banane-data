# Données du banc C5 : mêmes jeux que le banc « passage à niveau » (D-053), sans la partie 9.
import py7zr,zipfile,os,glob,shutil,sys
C='/home/user/banane-data/collections';D=sys.argv[1]
def ex(arch,dest,skip=()):
    os.makedirs(dest,exist_ok=True);tmp=dest+'.tmp';os.makedirs(tmp,exist_ok=True)
    for a in arch:
        a=C+'/'+a
        if a.endswith('.7z'):
            with py7zr.SevenZipFile(a) as z: z.extractall(tmp)
        else:
            with zipfile.ZipFile(a) as z: z.extractall(tmp)
    for f in glob.glob(tmp+'/**/*.json',recursive=True):
        if any(s in os.path.basename(f) for s in skip): os.remove(f); continue
        shutil.move(f,os.path.join(dest,os.path.basename(f)))
    shutil.rmtree(tmp)
ex(['2026-09-23_v4.7.7_/session nativ/banane-native-v4-2026-09-23T12-15-34-auto-seg03.7z','2026-09-23_v4.7.7_/session nativ/banane-native-v4-2026-09-23T12-21-02-seg01.7z'],D+'/natif-p24')
ex(['2026-09-24_v4.7.7_/session nativ/banane-native-v4-2026-09-24T07-23-05-p30.7z'],D+'/natif-p30')
ex(['2026-09-25_v4.7.18_/natif p2 passage a niveau 7801/natif-p2-7798-7809.zip'],D+'/natif-p2-7801')
ex(['2026-09-24_v4.7.8_/pilote p31/banane-pilote-p31-2026-09-24T07-45.7z'],D+'/p31/lot',skip=('banane-native',))
ex(['2026-09-24_v4.7.8_/relecture p31/banane-native-v4-2026-09-24T08-11-38-relecture-p31.7z'],D+'/p31/rel')
ex(['2026-09-24_v4.7.9_/pilote p31 fin/banane-pilote-p31-fin-2026-09-24T08-25.7z','2026-09-24_v4.7.9_/pilote p31 fin/banane-journal-v4-1790239609979.7z'],D+'/p31fin/lot')
ex(['2026-09-24_v4.7.9_/relecture p31 fin/banane-native-v4-2026-09-24T08-57-32-auto-seg02.7z','2026-09-24_v4.7.9_/relecture p31 fin/banane-native-v4-2026-09-24T09-06-28-auto-seg05.7z'],D+'/p31fin/rel')
ex(['2026-09-24_v4.7.11_/pilote p34/banane-pilote-p34-2026-09-24T11-37.7z'],D+'/p34/lot')
ex([f'2026-09-24_v4.7.11_/relecture p34/{n}' for n in ['banane-native-v4-2026-09-24T12-02-38-auto-seg04.7z','banane-native-v4-2026-09-24T12-02-38-auto-seg08.7z','banane-native-v4-2026-09-24T12-02-38-auto-seg12.7z','banane-native-v4-2026-09-24T12-05-48-seg04.7z','banane-native-v4-2026-09-24T12-05-48-seg05.7z']],D+'/p34/rel')
ex(['2026-09-25_v4.7.18_/pilote p2 reliquat/lot-p2-4.7.18.zip'],D+'/p2/lot')
ex(['2026-09-25_v4.7.18_/relecture p2 reliquat/relecture-p2-4.7.18.7z'],D+'/p2/rel')
ex(['2026-09-25_v4.7.18_/pilote p3 long/lot-p3-4.7.18.7z'],D+'/p3/lot')
ex(['2026-09-25_v4.7.18_/relecture p3 long/relecture-p3-4.7.18.7z'],D+'/p3/rel')
print('ok')
