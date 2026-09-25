# Collecte du 25/09/2026 — Banane 4.7.18, partie 2 : le reliquat

Premier lot de la 4.7.18 sur le terrain (l'opérateur passe directement de la
4.7.14 à la 4.7.18). Lot Pilote de la partie 2, bornes 768–8099, arrêté par
l'opérateur après 30 cuts (3 minutes). Pas de relecture. Archive :
`pilote p2 reliquat/lot-p2-4.7.18.zip` (journal, diagnostic GCV1, bilan,
corpus LiDAR), SHA-256 dans `manifest.json`. Relecture Natif (3 segments,
115 visites) : `relecture p2 reliquat/relecture-p2-4.7.18.7z`.

**Le lot ne visite que le reliquat.** Le Pilote passe au « prochain cut non
validé » : la partie 2 étant déjà presque entièrement validée, il saute de
cut restant en cut restant (768–778, 1193–1196, puis des cuts isolés jusqu'à
4703). Ce sont les cuts les plus difficiles de la partie, et des cuts isolés
n'ont pas de voisins : la décision sur le lot n'y trouve aucun appui. Le taux
de couverture de ce lot ne représente donc pas une partie neuve.

| 30 cuts distincts | |
|---|---|
| Appliqués | 16 (53,3 %) |
| Différés | 11, dont 6 « flanc », 1 garde de paire, 1 garde d'écartement voisin |
| Refusés par l'écartement | 3 (768, 771, 1251 ; 1504–1518 mm) |

**Passage à niveau, cuts 768–778** : presque tous les points à côté des rails
sont au niveau du champignon. 4 différés (768–771), 7 appliqués ; les poses
appliquées tombent à moins de 5 mm du bord de l'ornière, sauf le rail droit du
772 (13 mm dans l'ornière). 1193–1196 : zone en partie affleurante.

**Cut 1194** (choix par la voie, un appui) : placement jugé bon par
l'opérateur ; il n'est obtenu qu'avec le choix à 5 points de dessus (4.7.16),
la 4.7.14 l'aurait différé.

Rejeu : parité 30/30 avec les règles du lot (`lot-decision-v5`, appui = cut
posé). Analyse : banane, `audit/lot-4718-p2-2026-09-25.md`.

**Relecture** : 12 appliqués jugés sur 16 (75 %, sous le seuil de 80 % : C4 non
évaluable) ; **2 faux, tous deux au passage à niveau, rail droit** : 772
(15,2 mm) et 773 (13,2 mm). 1194 juste à 0 mm. Le bord de l'ornière est à 1 à
6 mm de la pose validée sur les cuts différés 768–771 et à 5 mm sur 772 droit.
1195, différé par la garde d'écartement voisin, aurait été juste (4,8 mm).

**Natif, passage à niveau 7801–7806** (`natif p2 passage a niveau 7801/`) : la
méthode de l'opérateur. Il ouvre 2 à 3 cuts avant (7798–7800) et après
(7807–7809), déjà validés, sans y toucher : ce sont ses repères. Puis il valide
les 6 cuts du passage à niveau. Ses poses tombent à 7 mm au plus du bord de
l'ornière (11 rails sur 12) et à 6,4 mm au plus d'une courbe tracée par les
3 cuts d'avant et les 3 d'après ; une voie prolongée depuis les seuls cuts
d'avant dérive jusqu'à 20–32 mm en fin de passage.


## Lot « long », partie 3 (4.7.18)

**Lot** : Pilote, partie 3, bornes 0–8209, « appliquer », « différer ».
06:59–07:09, 82 cuts en 47 suites (reliquat, 1,7 cut par suite). **Arrêté par
un défaut** après le cut 7654 : ESV passe au cut 8209, « Adaptateur sans
réponse » et « Message exceeded maximum allowed size of 64MiB » (KI-059,
corrigé en 4.7.19). Exportés : diagnostic et corpus (`pilote p3 long/`), pas
le journal ni le bilan. Relecture Natif : `relecture p3 long/` (5 segments).

| 82 cuts distincts | |
|---|---|
| Appliqués | 49 (59,8 %) : 42 premiers passages, 2 reprises, 5 choix |
| Différés | 24 (23 sans appui, 1 garde de paire) |
| Refusés par l'écartement | 9 |
| Relecture | 48 appliqués jugés sur 49, **0 faux** ; C2 latéral p90 4,1 mm |

Rejoué avec les règles de la 4.7.12, de la 4.7.14 et de la 4.7.18 : mêmes
décisions. Passages à niveau : 4273–4282 (2 différés, 8 appliqués justes) et
5377–5384 (8 différés, sans appui). Au rejeu 4.7.19 (ornière en dernier
recours), 5377–5384 est décidé en entier. Analyse : banane,
`audit/lot-4718-p3-2026-09-25.md` et `audit/passage-niveau-lecteur-2026-09-25.md`.

## Lot « long », partie 9 (4.7.18)

**Lot** : Pilote, partie 9, cuts 0–8539, « appliquer ». 08:20–09:47, 346 cuts
en 71 suites (4,9 cuts par suite, la plus longue : 91). Exportés : diagnostic
(session entière, parties 2, 3 et 9) et corpus en 9 segments, répartis dans
trois archives (`pilote p9 long/`). Ni journal ni bilan. Pas encore de
relecture.

| 346 cuts distincts | |
|---|---|
| Appliqués | 262 (75,7 %) |
| Différés | 57 |
| Refusés par l'écartement | 26 ; aucune paire hors contrat appliquée |
| Décision sur le lot | 220 premiers passages, 37 reprises, 9 choix ; 80 différés |

Parité terrain / rejeu hors ligne (règles 4.7.18, mode « appliquer ») :
346/346. Rejeu 4.7.19 : +12 décidés, passages à niveau 3968–3975, 4890 et
8472–8474. Fin du lot 8504–8539 (36 cuts) non posée : la pose de départ d'ESV
s'écarte du rail gauche (176 mm à 8496, 206 mm à 8506), la reprise tombe hors
de la vue (KI-051, D-043), la voie se perd. Analyse : banane,
`audit/lot-4718-p9-2026-09-25.md`.
