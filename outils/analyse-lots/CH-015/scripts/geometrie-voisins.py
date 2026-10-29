"""CH-015 tâche 2 : géométrie de la voie autour de chaque cut (courbure, pente, pas), lue dans l'instantané de la liste d'ESV du lot.
Usage : python3 -I geometrie-voisins.py <liste-partie.json> <cuts-p20.json> <descripteurs.json> <sortie.json>
L'instantané est pris APRES le lot. Seuls les cuts NON traités par le lot (déjà valides au départ) entrent dans les fenêtres, 25 cuts de chaque côté : ni les poses d'Ariane ni les extractions invalides ne servent à mesurer la voie.
Ordre de grandeur de la courbure seulement (bruit latéral de l'ordre de 0,1 m par cut)."""
import json, math, statistics as st, sys
liste, cutsf, descf, sortie = sys.argv[1:5]
d = json.load(open(liste)); L = json.load(open(cutsf)); D = {r["cut"]: r for r in json.load(open(descf))}
last = [None] * 6; pos = []
for row in d["r"]:
    v = row[1:7]; cur = []
    for k in range(6):
        if v[k] is None: cur.append(None); continue
        last[k] = v[k] if last[k] is None else last[k] + v[k]; cur.append(last[k])
    pos.append(cur)
xy = lambda i: (pos[i][0] / 1e4, pos[i][1] / 1e4) if 0 <= i < len(pos) and pos[i] and pos[i][0] is not None else None
CIBLES = {c['cut'] for c in L}  # cuts que le lot a traités (posés par Ariane ou différés) : exclus des fenêtres, leur bord est celui d'Ariane ou une extraction invalide
def cap(i, a, b):
    pts = [xy(j) for j in range(a, b + 1) if 0 <= j < len(pos) and j not in CIBLES]; pts = [p for p in pts if p]
    if len(pts) < 5: return None
    mx = sum(p[0] for p in pts) / len(pts); my = sum(p[1] for p in pts) / len(pts)
    sxx = sum((p[0] - mx) ** 2 for p in pts); syy = sum((p[1] - my) ** 2 for p in pts); sxy = sum((p[0] - mx) * (p[1] - my) for p in pts)
    return 0.5 * math.atan2(2 * sxy, sxx - syy)
def courbure(i, h=25):
    a, b = cap(i, i - h, i - 1), cap(i, i + 1, i + h)
    if a is None or b is None: return None
    dth = (b - a + math.pi / 2) % math.pi - math.pi / 2
    return abs(dth) / (h + 1)  # la fenêtre de h cuts de chaque côté ne garde que les cuts déjà valides avant le lot
def pas(i):
    a, b = xy(i), xy(i + 1)
    return math.hypot(a[0] - b[0], a[1] - b[1]) if a and b else None
def q(a):
    a = sorted(x for x in a if x is not None)
    return None if not a else {"n": len(a), "q25": a[len(a) // 4], "mediane": a[len(a) // 2], "q75": a[3 * len(a) // 4], "max": a[-1]}
groupes = {"fausses_100mm": [c["cut"] for c in L if c.get("mauvaiseVoie")],
           "autres_jugees": [c["cut"] for c in L if c["pose"] and c.get("etat") in ("corrige", "controle") and not c.get("mauvaiseVoie")],
           "posees_non_jugees": [c["cut"] for c in L if c["pose"] and c.get("etat") in ("sans-echo", "non-juge")],
           "differees": [c["cut"] for c in L if not c["pose"]]}
out = {"serrees_rayon_m": 300}
for g, cs in groupes.items():
    k = [courbure(c) for c in cs]
    out[g] = {"n": len(cs), "courbure_1_sur_m": q(k), "part_rayon_inf_300m": (sum(1 for x in k if x and x > 1 / 300) / max(1, sum(1 for x in k if x is not None))), "pas_m": q([pas(c) for c in cs])}
    out[g]["pn"] = sum(1 for c in cs if D.get(c, {}).get("pn")); out[g]["stage_crossing"] = sum(1 for c in cs if D.get(c, {}).get("stage") == "crossing")
json.dump(out, open(sortie, "w"), indent=1); print(json.dumps(out, indent=1))
