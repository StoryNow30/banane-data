# CH-015 : analyse des exports terrain, partie 20, lot du 28/10 (4.9.5.23)

Outils : `tools/juger-lot.cjs` (dépôt `banane`, graine 20261028) et `scripts/` (détail par cut, motifs de différés, jointure Écho). Sorties dans `sorties/` (la liste par cut y porte les numéros de cut, aucune coordonnée). Entrées archivées dans `collections/2026-10-28_v4.9.5.23_partie-20-lot` et `collections/2026-10-29_v4.9.5.23_echo-partie-20` (branche `chantier/CH-015`). Qualifications : ÉTABLI = compté par script ; PROBABLE = lecture des comptes ; SUPPOSÉ = hypothèse.

## 1. Le tableau (partie 20, jugé contre l'Écho) — ÉTABLI
889 cibles, 721 posés, 168 différés (18,9 %). Sur 721 posés : sans Écho 544, non jugés 5, jugés 172 (97 corrigés, 75 contrôlés bons). Écart pire rail 3D : médiane 1,68 mm ; ≤ 5 mm 63,4 %, ≤ 10 mm 81,4 % ; > 20 mm 24/172 (14,0 %) ; > 50 mm 21/172 (12,2 %), tous « mauvaise voie ». Passe en ombre : 80 « poserait » sur 168, tous jugés, médiane 3,25 mm, > 20 mm 3/80, > 50 mm 2/80.

## 2. Où la pose est fausse (21 cuts à plus de 50 mm) — A
- **Ce n'est pas une autre voie.** Les 21 sont décalées de **107 à 391 mm** (médiane 164 mm), les deux rails du même côté (signe latéral négatif des deux rails sur 21/21, écart entre rails de 0 à 30 mm : translation de la paire). Une voie voisine serait à plusieurs mètres : « mauvaise voie » est l'étiquette du seuil de 100 mm, pas une mesure d'une autre voie (ÉTABLI).
- **Elles sont collées aux différés.** 14 des 21 touchent un cut différé (n ± 1) ; parmi les 172 jugés, 14/34 des cuts adjacents à un différé sont faux (41 %) contre 7/138 ailleurs (5,1 %) ; à 2 cuts ou moins d'un différé : 18/50 (36 %) contre 3/122 (2,5 %) (ÉTABLI). PROBABLE : les fausses poses sont dans les zones où la géométrie est incertaine, là où Ariane se tait sur les voisins.
- **Un paquet, trois épisodes.** 12 paquets de cuts consécutifs (plus grand : 4), cuts 6385 à 6610 (12 cuts, minutes 5 à 19 du lot), 7557, 9124-9125, 9437-9457 (6 cuts, minutes 91 à 95) (ÉTABLI).
- **Ariane ne se sait pas fausse.** Confiance minimale des deux rails : médiane 0 pour les 21 contre 68 pour les 151 autres jugés (rail en abstention ou S1 sur 12 des 21) ; mais 9 des 21 ont les deux rails « astar » à 46-85 de confiance (ÉTABLI). 5 des 21 sont des abstentions sur les deux rails : la pose validée est la pose de départ (PROBABLE : l'erreur vient alors de l'extraction ESV, pas du moteur).
- **Pas de cause de vue.** 0 des 21 a un geste de vue (molette, déplacement) ; le rail gauche est hors vue à la fin sur 21/21 comme sur 150/151 des autres : ce critère ne sépare rien (ÉTABLI).

## 3. Pourquoi 18,9 % de différés — B
- **Ce n'est ni la version ni les invalides au départ.** Même 4.9.5.23, journal du 28/10 (`finsLot`) : parties 3, 4, 7, 8, 14, 17 à 3,9 / 7,1 / 4,4 / 6,3 / 1,3 / 1,8 %, partie 1 à 7,4 %. La partie 17 avait 791 invalides au départ et 1,8 % de différés ; la partie 20, 889 et 18,9 % (ÉTABLI). Valeur aberrante aussi : partie 2 (9 posés, 26 différés), journal résumé seulement, non analysable.
- **Des grappes.** Les 168 différés forment 28 paquets (24, 16, 16, 15, 15, 15, 10, 10, 9…) ; en partie 0 (.22) 39 différés font 38 paquets, en partie 1 (.23) 28 font 27 : isolés (ÉTABLI).
- **Un autre motif.** Partie 20 : écartement hors contrat 44 (26 %), flanc interne insuffisant 37 (22 %), plan de roulement non estimable (rsf) 31 (18 %), candidat 20, minTop 19, ambiguïté 6, input 6, pente 3, fenêtre 2. En parties 0 et 1 réunies (67 différés) : flanc 0 et rsf 1 (partie 0, `rsf` 1 sur 39), écartement 15 (22 %), ambiguïté 14, candidat 17, minTop 14 (ÉTABLI). 40 % des différés de la partie 20 viennent de nuage insuffisant (flanc, rsf), contre moins de 2 % ailleurs. PROBABLE : zones de la partie 20 mal couvertes par le LiDAR. SUPPOSÉ : lien avec les épisodes de la section 2 (non testé).
- 123 des 168 (73 %) n'ont « aucun appui » pour la voie prédite ; la passe en ombre en ramasserait 80 (48 %).

## 4. L'Écho est-il complet ? — C
Un seul Écho (session du 29/10, 08:49 à 09:37, heure de Paris), 447 visites déclarées par l'export final de 151 Mo et 447 visites lues par l'outil (ÉTABLI). 27 segments automatiques numérotés seg01 à seg27 sans trou, plus l'export final. Cuts visités : 393 distincts (341 une fois, 50 deux fois, 2 trois fois), dont **168/168 différés**, **177/721 posés (24,5 %)** et 48 hors lot. Les 177 sont concentrés près des différés : 35 des 38 posés adjacents à un différé (92 %) contre 142 des 683 autres (20,8 %). Donc l'échantillon jugé est biaisé vers les zones difficiles ; les taux de la section 1 ne sont pas ceux de la partie (ÉTABLI par comptage, effet sur le taux SUPPOSÉ).

## 5. Molette et déplacement de vue — D
Parmi les 168 différés : **29 (17 %) ont un geste de vue** (11 déplacements de vue, 28 coups de molette, 1 glissement). Sur les 721 posés : 6. Sur les 21 mauvaises voies : 0. **Tous les gestes échouent** : 45 coups de molette sur 45 « caméra immobile », 19 déplacements de vue sur 19 refusés « pre-vol:camera-immobile » (14 hors vue gauche, 4 garde hors vue gauche, 1 hors vue droite) (ÉTABLI). 5 clics hors vue sur posés ; le bilan du lot en compte 653 (état STOPPED, signification du total non lue : NON FAIT). Parmi ces 29 différés, la passe en ombre « poserait » 21 (72 %) contre 59/139 (42 %) des autres : SUPPOSÉ : la vue empêche la pose d'une partie de ces cuts (non établi : la passe n'utilise pas la vue), et ne joue aucun rôle dans les 21 fausses poses. Liste des cuts : `sorties/p20-cuts-detail.json` (champ `gestesVue`).

## 6. Les autres parties de l'export
Le journal ne contient que des événements de la partie 20 (44 996 événements ; 11 sans partie). Les 11 « départs » de `CONTENU.txt` et le résumé `finsLot` (parties 1, 2, 3, 4, 7, 8, 14, 17, 20) sont des fiches de départ et de fin d'anciens lots, sans pose ni cut : **aucune autre partie ne peut être jugée avec cet export**, et aucun Écho que partie 20 (ÉTABLI). L'effectif jugé de 172 ne grossit donc pas par cet export. La partie 17 n'est pas touchée (lot de CH-012).

## Limites et pas fait
- Pas de comparaison de versions : lots 4.9.5.21, 22 et 23 antérieurs à 36, 16 et 24 jugés, 0 pose > 20 mm chacun (borne haute de Wilson pour 0/36 : 9,6 %, calcul à la main) ; aucun export 4.9.5.24.
- Médiane 1,68 mm : du même ordre que le bruit de référence (0,75 à 1,5 mm latéral, 2,3 mm vertical) ; 29 jugés sur 172 sont dans la zone grise du seuil de 5 mm, le seuil de 10 mm en a 12 (BRUIT_REFERENCE). Les 75 « contrôlé, bon » tirent la médiane vers 0.
- Pas de rejeu sur les mêmes cuts en .21 à .23, pas de test causal des épisodes, pas de lecture du nuage.
- Code de projet ESV et nom d'opérateur des collectes archivées : non contrôlés dans ma session (motifs absents).
