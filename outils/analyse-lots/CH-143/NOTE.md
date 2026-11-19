# CH-143 — ce qui pèse à l'opérateur, mesuré sur ses exports

**Lot A4 d'Ariane 6 (D-357).** Mesure seule : aucun code livré. Script :
`mesure-ce-qui-pese.cjs` — sorties : `sorties/resume.json`, `sorties/tableau.md`.

## Ce qui est compté

Un **lot** = un `batchId` du journal d'export. Les huit collections de `banane-data` qui portent un
journal de lot sont lues telles quelles (`unzip -p`, aucune extraction) : 14 archives, 72 lots, de la
Vision 15 à la Vision 21. Une session exportée deux fois (19/11 : exports de 10:34 et 10:46) n'est
comptée qu'une fois : tous les événements du premier journal qui porte le `batchId`, aucun du second.

- **Durée du lot** : `finsLot.dureeMs` (départ → fin de la passe de pose).
- **Cuts posés à la main** : `finsLot.main`, c'est-à-dire la longueur de `manuallyCompleted`.
- **Cuts écrits par la seconde passe** : `finsLot.ecritsPasse` (à ne pas confondre avec une pose à la main).
- **Relecture active** : somme des `relecture-ombre.durees.totalMs` du lot — le temps que le moteur
  passe réellement sur chaque cut (navigation, capture, calcul), pauses et absences exclues.
- **Relecture murale** : `relecture-fin.dureeMs` (départ → fin, pauses comprises). Gardée à part.

## Les trois chiffres

| | Mesuré | Qualité |
|---|---:|---|
| Lots | 72 (8 collections) | ÉTABLI |
| Cuts posés | 8 299 ; 490 différés ; **0 posé à la main** ; 83 écrits par la passe | ÉTABLI |
| Durée des lots | **8,2 h** (29 523 499 ms), médiane 2 min, moyenne 6,8 min | ÉTABLI |
| Relecture active | **6,4 h** (23 063 712 ms) pour 21 524 cuts relus, 2 166 corrigés (10,1 %) | ÉTABLI |
| Relecture murale | 7,1 h (25 524 377 ms) — pauses et absences comprises | ÉTABLI |
| Par cut relu | médiane **598 ms**, P90 2 213 ms, maximum 1 075 062 ms (≈ 18 min) | ÉTABLI |
| Décomposition médiane | navigation 22 ms, capture 259 ms, calcul 211 ms | ÉTABLI |

**Le lot ne comprend pas la relecture.** Les deux passes sont séquentielles : le lot 29 du 19/11 finit
à 07:34:21, sa relecture à 07:59:51, le lot 30 démarre à 08:00:02. Le rapport « relecture / lot » vaut
donc **78,1 %** (elle coûte presque autant que la pose), et l'ensemble posé + relu vaut **14,6 h, dont
43,9 % de relecture**. Après la pose elle-même, c'est le plus gros bloc de temps mesuré de la chaîne —
et le seul que le lot D peut entamer.

## Où passe le temps de relecture

| Action d'ombre | Cuts | Temps actif | Médiane par cut |
|---|---:|---:|---:|
| `visite` (cut relu, rien à changer) | 19 447 | 301 min | 552 ms |
| `corrige` (cut corrigé) | 2 174 | 82 min | 2 026 ms |
| `correction-refusee` | 28 | 1 min | 2 071 ms |

Les cuts corrigés sont **10,1 %** des cuts relus mais **21,4 %** du temps de relecture : un cut corrigé
coûte **3,7 fois** un cut seulement visité. Les visites pèsent néanmoins 78,6 % du temps : un tri
qui ne viserait que les corrections ne supprimerait qu'un cinquième de la dépense. Les 8 cuts d'écart
entre `corrige` (2 174) et `relecture-fin.corriges` (2 166) viennent probablement de la maille
(événement par cut contre bilan par lot) — SUPPOSÉ.

La décomposition médiane (22 + 259 + 211 = 492 ms) laisse **106 ms** hors des trois postes : attente,
écriture ou arrondis — SUPPOSÉ ; les postes ne se recouvrent pas au-delà de ce que le journal nomme.

## Ce que ces chiffres ne disent pas

- **Rien de l'opérateur hors Ariane** : le temps passé à regarder ESV, à réfléchir ou à corriger à la
  main n'est pas dans le journal. Les 6,4 h sont ce que la machine voit, pas tout son travail.
- **Le temps mort est exclu de l'actif** : une pause de 3 min entre deux cuts ne compte pas dans les
  6,4 h mais compte dans les 7,1 h de temps mural.
- **« 0 posé à la main »** est un état de fin de lot (`manuallyCompleted` vide), pas la preuve que
  l'opérateur n'est jamais intervenu : ses corrections dans ESV ne sont pas des poses, et les 83 cuts
  écrits par la passe ne sont pas des poses à la main.
- **Les durées par cut sont celles de l'ombre**, capture et calcul compris : elles ne mesurent pas la
  lecture humaine.
- 10 lots n'ont aucune relecture active (sept du 29/10, la partie 25 du 18/11, les parties 6 et 34 du
  19/11) : version antérieure sans relevé, ou relecture non lancée. Ils restent dans les durées de lot,
  pas dans le temps de relecture.
- Les 8 299 cuts posés ne sont pas la totalité du parcours : seuls les lots exportés sont là.

## Conséquence pour le lot D

La relecture est **le premier poste réductible** : 6,4 h, soit 78,1 % du temps de pose et 43,9 % du
total posé + relu. La pose (8,2 h) reste le plus gros bloc, mais c'est le travail lui-même ; la
relecture est le seul gros bloc que le lot D peut entamer. La condition d'ouverture — « la relecture
est ce qui pèse le plus » — est donc remplie au sens où elle pèse le plus **après la pose** ; mais
78,6 % de ce temps part en cuts **visités sans correction**, pas en corrections : le lot D doit
d'abord éviter des visites, pas seulement accélérer les corrections.
