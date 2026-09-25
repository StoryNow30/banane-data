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
