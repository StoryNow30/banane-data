import json,sys,math
from collections import Counter
L=[json.loads(l) for l in open(sys.argv[1])]
def n(v): return math.hypot(v[1],v[2])
def cl(v): return 'abstient' if v is None else '<=5' if v<=5 else '<=10' if v<=10 else '<=20' if v<=20 else '<=50' if v<=50 else '>50'
def juge(c,voie):
    a=c['ariane']; src=a.get('chaine') if voie=='chaine' else a
    if not src or not src.get('rails'): return None,None
    err=[];dep=[]
    for s in('left','right'):
        p=(src['rails'].get(s) or {}).get('pose'); m=c['mic']['rails'].get(s) or [0,0,0]
        if p is None: return None,None
        err.append(math.hypot(p[1]-m[1],p[2]-m[2])); dep.append(n(p))
    return max(err),max(dep)
V=[c for c in L if c.get('mic') and c['mic'].get('ref')=='validation']
B=[c for c in L if c.get('mic') and c['mic'].get('ref')=='visite-bon']
def corr(c): return max(n(c['mic']['rails'].get(s) or [0,0,0]) for s in('left','right'))
for nom,grp in (('corrigés >50 mm',[c for c in V if corr(c)>50]),('corrigés 10-50 mm',[c for c in V if 10<corr(c)<=50]),('corrigés <=10 mm',[c for c in V if corr(c)<=10]),('visités sans action (bons)',B)):
    print('==',nom,len(grp),'dont sans nuage',sum(c['ariane']['etat']!='calcule' for c in grp))
    G=[c for c in grp if c['ariane']['etat']=='calcule']
    for voie in('seul','chaine'):
        e=Counter(); d=Counter()
        for c in G:
            er,dp=juge(c,voie); e[cl(er)]+=1; d[cl(dp)]+=1
        print('  ',voie,'écart à la pose finale de l\'opérateur:',dict(e)); print('  ',voie,'déplacement proposé depuis le départ:',dict(d))
    print('   étapes seul',Counter(c['ariane'].get('stage') for c in G).most_common(6),'chaîne',Counter((c['ariane'].get('chaine') or {}).get('stage') for c in G).most_common(6))
print()
for c in sorted(V,key=lambda c:c['cut']):
    if corr(c)>50:
        a=c['ariane']; 
        if a['etat']!='calcule': print(c['cut'],'corr %.0f'%corr(c),a['etat'],c.get('pointsParRail')); continue
        e1,_=juge(c,'seul'); e2,_=juge(c,'chaine')
        print(c['cut'],'corr %.0f mm'%corr(c),'| seul',a.get('stage'),a.get('reason'),'err',None if e1 is None else round(e1,1),'| chaîne',(a.get('chaine') or {}).get('stage'),'err',None if e2 is None else round(e2,1),'| flush',a.get('surface',{}).get('flushPct'),'adv',a.get('surface',{}).get('advRails'),'PN',a.get('surface',{}).get('coeurPN'))
