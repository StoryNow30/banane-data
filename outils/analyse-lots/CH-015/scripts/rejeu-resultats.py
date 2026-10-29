"""CH-015 tâche 7 : lit les rapports du banc (tools/banc-esv.cjs --json) et les compare à l'issue réelle du lot (cuts-p20.json de detail-lot.cjs).
Usage : python3 -I rejeu-resultats.py <cuts-p20.json> <cuts-vue-p20.json> <sortie.json> nom=rapport.json [nom=rapport.json ...]
Issue d'un cut dans le rejeu : « posé » (validation-accepted), « différé » (defer-finalized), « autre » sinon. Les 4 premiers cuts de chaque fenêtre sont écartés (appuis d'amont absents)."""
import json, sys, collections
cutsf, vuef, sortie, *runs = sys.argv[1:]
orig = {c["cut"]: c for c in json.load(open(cutsf))}; V = json.load(open(vuef)); cibles_vue = set(V["union"])
def issues(path):
    J = json.load(open(path))["journal"]["events"]; o = {}
    for e in J:
        i = e.get("identity") or {}; c = i.get("cut")
        if c is None: continue
        if e["type"] == "validation-accepted": o[c] = "posé"
        elif e["type"] == "defer-finalized": o.setdefault(c, "différé")
    gest = collections.defaultdict(lambda: collections.Counter())
    for e in J:
        c = (e.get("identity") or {}).get("cut")
        if c is not None and e["type"] in ("glisser", "molette", "deplacer-vue", "clic-hors-vue", "garde-apres-differe"): gest[c][e["type"]] += 1
    return o, gest, J
def fenetres(cuts):
    s = sorted(cuts); w = []; 
    for c in s:
        if w and c - w[-1][-1] <= 12: w[-1].append(c)
        else: w.append([c])
    return w
out = {}
for nr in runs:
    nom, path = nr.split("=", 1); o, g, J = issues(path); cs = sorted(o)
    chauffe = {c for w in fenetres(cs) for c in w[:4]}
    ev = [c for c in cs if c not in chauffe and c in orig]
    tab = collections.Counter((("posé" if orig[c]["pose"] else "différé"), o[c]) for c in ev)
    cibles = [c for c in ev if c in cibles_vue]; tabv = collections.Counter((("posé" if orig[c]["pose"] else "différé"), o[c]) for c in cibles)
    out[nom] = {"cutsRejoues": len(cs), "cutsComparables": len(ev), "croisementOrigineRejeu": {f"{a}→{b}": n for (a, b), n in sorted(tab.items())},
        "accord": sum(n for (a, b), n in tab.items() if a == b), "cutsVueComparables": len(cibles), "croisementVue": {f"{a}→{b}": n for (a, b), n in sorted(tabv.items())},
        "gestes": {t: sum(v[t] for v in g.values()) for t in ("glisser", "deplacer-vue", "clic-hors-vue", "garde-apres-differe")}}
json.dump(out, open(sortie, "w"), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False, indent=1))
