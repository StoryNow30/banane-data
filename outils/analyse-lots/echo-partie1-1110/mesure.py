import sys,json,statistics as st
from collections import Counter
d=json.load(open(sys.argv[1]))
ev=d['events']; R=d['records']; D=d['dictionaries']
ids=D['identities']
print('identity sample', {k:(v if not isinstance(v,str) or len(v)<12 else 'str') for k,v in ids[0].items()})
def ident(x):
    if isinstance(x,dict) and '__ref' in x: return ids[int(x['__ref'].split(':')[1])]
    return x
cuts=[ident(r['identity']).get('cut') for r in R]
print('visites',len(R),'cuts distincts',len(set(cuts)),'min',min(cuts),'max',max(cuts))
# sens de parcours
steps=Counter(b-a for a,b in zip(cuts,cuts[1:]))
print('pas entre visites', steps.most_common(12))
dur=[]
from datetime import datetime
T=lambda s: datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
for r in R:
    if r.get('endedAt'): dur.append(T(r['endedAt'])-T(r['startedAt']))
q=lambda a,p: sorted(a)[min(len(a)-1,int(p*len(a)))]
print('durée visite s: med %.2f p25 %.2f p75 %.2f p90 %.2f max %.1f'%(q(dur,.5),q(dur,.25),q(dur,.75),q(dur,.9),max(dur)))
print('statuts visites',Counter(r['status'] for r in R))
print('intents',Counter(json.dumps(r.get('operatorIntent'))[:80] for r in R).most_common(8))
print('label',Counter(r.get('observedLabelCandidate') for r in R))
print('leave',Counter(r.get('leaveReason') for r in R))
print('lidar',Counter(r.get('lidarStatus') for r in R))
print('serverConfirmed',Counter(r.get('serverConfirmationStatus') for r in R))
# écritures
W=[e for e in ev if e['type']=='esv-observation' and e.get('kind')=='write']
print('écritures',len(W),Counter((e.get('method'),e.get('status'),e.get('outcome'),(e.get('body') or {}).get('ExtractionStatus')) for e in W))
print('urlClass',Counter(e.get('urlClass') for e in W))
rows=Counter(e.get('rowIndex') for e in W); print('lignes écrites distinctes',len(rows),'max par ligne',max(rows.values()))
print('durée écriture ms med',q([e['durationMs'] for e in W if e.get('durationMs') is not None],.5),'max',max(e.get('durationMs') or 0 for e in W))
# réseau points
P=[e for e in ev if e['type']=='esv-observation' and e.get('kind')=='resource']
stt=Counter(); n=0;b=0;ech=0;ss=0
for e in P:
    for k,v in (e.get('statuts') or {}).items(): stt[k]+=v
    n+=e.get('n',0); b+=e.get('bytes',0); ech+=e.get('echecs',0); ss+=e.get('sansStatut',0)
print('fenêtres réseau',len(P),'requêtes',n,'Mo %.1f'%(b/1e6),'statuts',dict(stt),'échecs',ech,'sansStatut',ss,'echecsCumules fin',P[-1].get('echecsCumules'))
dm=[e['dureeMaxMs'] for e in P if e.get('dureeMaxMs') is not None]
at=[e['attenteServeurMs'] for e in P if e.get('attenteServeurMs') is not None]
print('durée max par fenêtre ms: med %.0f p90 %.0f p99 %.0f max %.0f'%(q(dm,.5),q(dm,.9),q(dm,.99),max(dm)))
print('attente serveur par fenêtre ms: med %.0f p90 %.0f max %.0f'%(q(at,.5),q(at,.9),max(at)))
print('ept',Counter(e.get('ept') for e in P).most_common(6))
# esv-event
E=[e for e in ev if e['type']=='esv-observation' and e.get('kind')=='esv-event']
print('esv-event',Counter(e.get('nom') for e in E))
# touches
K=[e for e in ev if e['type']=='native-operator-event']
print('clés K0',[k for k in K[0].keys()][:30])
def g(e): return e.get('event') or e.get('operatorEvent') or e
print(json.dumps(K[3])[:1200])
