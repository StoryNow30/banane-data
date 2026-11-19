# CH-142 — part des cuts où l'ancre de trajectoire est muette, par lot et par cause

Mesure sur les journaux de lot et les listes d'ESV du **même export de lot** ; règles et seuils de `src/ancre-trajectoire.js` (`minLignesListe: 100`, `minLignes: 30`, fenêtres 200/400/800/1600, `sensRapportMin: 1.10`, `sensFaibleMaxMm: 20`).
Populations : `visités` = cuts lus par Ariane (`before-captured` ou `proposed`) ; `posés` = cuts validés par Ariane (`validation-accepted`), dont la colonne `ecriture_observee` dit ceux dont l'écriture 2xx a été observée. **Le pourcentage principal porte sur les cuts posés** : c'est là que l'ancre doit s'établir pour protéger une pose.

## Par lot

| lot | parties | cuts visités | cuts posés | muets (posés) | % muet (posés) | % muet (visités) | établie (posés) | liste-absente | liste-courte | cut-hors-liste | voie-courante-insuffisante |
|---|---|---|---|---|---|---|---|---|---|---|---|
| V18 | 8 | 1418 | 1361 | 13 | 1 % | 1 % | 1348 | 0 | 0 | 13 | 0 |
| V19.1 | 11 | 836 | 750 | 18 | 2.4 % | 2.5 % | 732 | 0 | 0 | 11 | 7 |
| V19 | 3 | 125 | 123 | 46 | 37.4 % | 36.8 % | 77 | 1 | 0 | 2 | 43 |
| V20 | 10 | 808 | 791 | 9 | 1.1 % | 1.4 % | 782 | 0 | 0 | 9 | 0 |
| V15 | 8 | 831 | 784 | 10 | 1.3 % | 2 % | 774 | 0 | 0 | 10 | 0 |
| **total principal (V18 à V20)** | 32 | 3187 | 3025 | 86 | 2.8 % | 2.9 % | 2939 | 1 | 0 | 35 | 50 |
| total avec V15 (comparaison) | 40 | 4018 | 3809 | 96 | 2.5 % | 2.7 % | 3713 | 1 | 0 | 45 | 50 |

## Par lot-partie

| lot-partie | liste | lignes utilisables | cuts visités | cuts posés | muets (posés) | % muet (posés) | établie | absente | courte | hors-liste | voie-courante |
|---|---|---|---|---|---|---|---|---|---|---|---|
| V18 p25 | oui | 10154 | 63 | 59 | 1 | 1.7 % | 58 | 0 | 0 | 1 | 0 |
| V18 p26 | oui | 9909 | 138 | 137 | 1 | 0.7 % | 136 | 0 | 0 | 1 | 0 |
| V18 p27 | oui | 9971 | 625 | 582 | 0 | 0 % | 582 | 0 | 0 | 0 | 0 |
| V18 p28 | oui | 10141 | 68 | 68 | 0 | 0 % | 68 | 0 | 0 | 0 | 0 |
| V18 p29 | oui | 9926 | 183 | 183 | 1 | 0.5 % | 182 | 0 | 0 | 1 | 0 |
| V18 p30 | oui | 9964 | 217 | 214 | 7 | 3.3 % | 207 | 0 | 0 | 7 | 0 |
| V18 p31 | oui | 6970 | 113 | 107 | 2 | 1.9 % | 105 | 0 | 0 | 2 | 0 |
| V18 p32 | oui | 7011 | 11 | 11 | 1 | 9.1 % | 10 | 0 | 0 | 1 | 0 |
| V19.1 p3 | oui | 9276 | 2 | 1 | 0 | 0 % | 1 | 0 | 0 | 0 | 0 |
| V19.1 p4 | oui | 9324 | 55 | 55 | 8 | 14.5 % | 47 | 0 | 0 | 1 | 7 |
| V19.1 p5 | oui | 9169 | 92 | 91 | 1 | 1.1 % | 90 | 0 | 0 | 1 | 0 |
| V19.1 p6 | oui | 9171 | 123 | 103 | 0 | 0 % | 103 | 0 | 0 | 0 | 0 |
| V19.1 p7 | oui | 9079 | 239 | 211 | 2 | 0.9 % | 209 | 0 | 0 | 2 | 0 |
| V19.1 p8 | oui | 9304 | 11 | 9 | 1 | 11.1 % | 8 | 0 | 0 | 1 | 0 |
| V19.1 p9 | oui | 9292 | 10 | 9 | 1 | 11.1 % | 8 | 0 | 0 | 1 | 0 |
| V19.1 p10 | oui | 9264 | 52 | 50 | 1 | 2 % | 49 | 0 | 0 | 1 | 0 |
| V19.1 p11 | oui | 9255 | 27 | 27 | 1 | 3.7 % | 26 | 0 | 0 | 1 | 0 |
| V19.1 p12 | oui | 9301 | 45 | 45 | 1 | 2.2 % | 44 | 0 | 0 | 1 | 0 |
| V19.1 p13 | oui | 9209 | 180 | 149 | 2 | 1.3 % | 147 | 0 | 0 | 2 | 0 |
| V19 p1 | non | 0 | 1 | 1 | 1 | 100 % | 0 | 1 | 0 | 0 | 0 |
| V19 p2 | oui | 9410 | 16 | 16 | 1 | 6.3 % | 15 | 0 | 0 | 1 | 0 |
| V19 p3 | oui | 9276 | 108 | 106 | 44 | 41.5 % | 62 | 0 | 0 | 1 | 43 |
| V20 p6 | oui | 9695 | 1 | 0 | 0 | null % | 0 | 0 | 0 | 0 | 0 |
| V20 p7 | oui | 9905 | 113 | 108 | 2 | 1.9 % | 106 | 0 | 0 | 2 | 0 |
| V20 p8 | oui | 9910 | 42 | 41 | 1 | 2.4 % | 40 | 0 | 0 | 1 | 0 |
| V20 p9 | oui | 9890 | 159 | 158 | 1 | 0.6 % | 157 | 0 | 0 | 1 | 0 |
| V20 p10 | oui | 9895 | 42 | 42 | 1 | 2.4 % | 41 | 0 | 0 | 1 | 0 |
| V20 p11 | oui | 9897 | 34 | 34 | 1 | 2.9 % | 33 | 0 | 0 | 1 | 0 |
| V20 p12 | oui | 9885 | 111 | 110 | 1 | 0.9 % | 109 | 0 | 0 | 1 | 0 |
| V20 p13 | oui | 9815 | 22 | 20 | 1 | 5 % | 19 | 0 | 0 | 1 | 0 |
| V20 p14 | oui | 9968 | 65 | 63 | 1 | 1.6 % | 62 | 0 | 0 | 1 | 0 |
| V20 p15 | oui | 9955 | 219 | 215 | 0 | 0 % | 215 | 0 | 0 | 0 | 0 |
| V15 p0 | oui | 9152 | 109 | 107 | 2 | 1.9 % | 105 | 0 | 0 | 2 | 0 |
| V15 p1 | oui | 9046 | 42 | 42 | 1 | 2.4 % | 41 | 0 | 0 | 1 | 0 |
| V15 p2 | oui | 9143 | 91 | 89 | 1 | 1.1 % | 88 | 0 | 0 | 1 | 0 |
| V15 p3 | oui | 9164 | 59 | 59 | 1 | 1.7 % | 58 | 0 | 0 | 1 | 0 |
| V15 p4 | oui | 9168 | 93 | 86 | 1 | 1.2 % | 85 | 0 | 0 | 1 | 0 |
| V15 p21 | oui | 8681 | 66 | 65 | 2 | 3.1 % | 63 | 0 | 0 | 2 | 0 |
| V15 p22 | oui | 5521 | 60 | 59 | 1 | 1.7 % | 58 | 0 | 0 | 1 | 0 |
| V15 p23 | oui | 5500 | 311 | 277 | 1 | 0.4 % | 276 | 0 | 0 | 1 | 0 |

## Ce que la mesure compte

- lots lus : 5 ; lots-parties avec au moins un cut : 40 ; dont **sans liste d'ESV dans l'export du lot** : 1 (2.5 %).
- cuts de l'union visité ∪ posé : 4018 ; visités : 4018 ; posés : 3809 ; posés sans écriture observée : 62.
- cuts muets (posés) : 96 sur 3809 (2.5 %) ; cuts muets (visités) : 109 sur 4018 (2.7 %).
- causes sur les posés : liste-absente 1 ; liste-courte 0 ; cut-hors-liste 45 ; voie-courante-insuffisante 50.
- causes sur les visités : liste-absente 1 ; liste-courte 0 ; cut-hors-liste 58 ; voie-courante-insuffisante 50.

## Total principal (V18 à V20), hors V15 de comparaison

- lots-parties : 32 ; sans liste : 1 (3.1 %).
- cuts visités : 3187 ; posés : 3025 ; posés sans écriture observée : 46.
- cuts muets (posés) : 86 sur 3025 (2.8 %) ; cuts muets (visités) : 92 sur 3187 (2.9 %).
- causes sur les posés : liste-absente 1 ; liste-courte 0 ; cut-hors-liste 35 ; voie-courante-insuffisante 50.

Lots-parties sans liste (tous leurs cuts sont `liste-absente`, sans comblement par une autre collection) :
- V19 p1 : 1 cut(s).
