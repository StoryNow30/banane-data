import csv,sys
R=list(csv.DictReader(open(sys.argv[1])))
cuts=sorted(int(r['cut']) for r in R)
# plages visitées
pl=[];a=b=cuts[0]
for c in cuts[1:]:
    if c==b+1: b=c
    else: pl.append((a,b)); a=b=c
pl.append((a,b)); print('plages visitées',pl)
C=[r for r in R if r['maxDist3dMm']]
f=lambda x: float(x) if x not in('',None) else None
def cl(v): return '<=5' if v<=5 else '<=10' if v<=10 else '<=20' if v<=20 else '<=50' if v<=50 else '>50'
from collections import Counter
print('avec référence',len(C), Counter(cl(float(r['maxDist3dMm'])) for r in C))
print('étiquettes',Counter(r['etiquetteEcho'] for r in R))
for r in sorted(C,key=lambda r:int(r['cut'])):
    print(r['cut'],r['etiquetteEcho'][9:], 'G lat %s vert %s 3D %s | D lat %s vert %s 3D %s'%(r['gaucheLateralMm'],r['gaucheVerticalMm'],r['gaucheDist3dMm'],r['droiteLateralMm'],r['droiteVerticalMm'],r['droiteDist3dMm']))
