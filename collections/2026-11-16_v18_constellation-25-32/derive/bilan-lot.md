# Bilan de lot

Qualification : chiffres lus au journal (ÉTABLI). Aucun identifiant, aucune adresse.

## 1. Lot

- Période : du 2026-11-16T07:17:53.977Z au 2026-11-16T12:34:14.142Z (UTC), soit 18980,2 s.
- Partie(s) : 25, 26, 27, 28, 29, 30, 31, 32.
- Coupes validées : 1 361 ; différées : 74.
- Séries de captures vides : 0 ; captures abandonnées : 74 (deferred-unresolved : 74).
- Lecture Rust : servie 9 978, repli 0 sur 9 978 lectures.

| Partie | Validées | Différées | Abandonnées |
|---|---|---|---|
| 25 | 59 | 7 | 7 |
| 26 | 137 | 5 | 5 |
| 27 | 582 | 43 | 43 |
| 28 | 68 | 0 | 0 |
| 29 | 183 | 7 | 7 |
| 30 | 214 | 4 | 4 |
| 31 | 107 | 8 | 8 |
| 32 | 11 | 0 | 0 |

## 2. Temps

- Cut (intervalle entre validations successives, moins de 10 s) : 1 308 intervalles ; médian 2,1 s ; P90 5,6 s.
- Capture (elapsedMs de capture-ready), selon le saut depuis la coupe précédente :

| Saut | Captures | Médiane | P90 |
|---|---|---|---|
| +1 | 1 134 | 198 ms | 280 ms |
| 2-10 | 131 | 201 ms | 272 ms |
| 11-50 | 54 | 235 ms | 408 ms |
| 51-200 | 31 | 233 ms | 804 ms |
| >200 | 60 | 261 ms | 1,9 s |
| autre | 0 | — | — |

Captures sans coupe appariée dans l'ordre des before-captured : 0.

## 3. Chargement d'ESV

- Nœuds téléchargés : 14 608, dont servis par le cache : 337 (2,3 %) ; octets : 4 441 763 944.
- Statuts de réponse : 200 : 14 583 ; 502 : 11 ; sans statut : 0 ; échecs : 11.
- Épisodes de compteur bloqué : 86.

| Tranche de 10 min (UTC) | Nœuds | Cache | Octets | Échecs | Compteur bloqué | Statuts |
|---|---|---|---|---|---|---|
| 07:20 | 1 150 | 75 | 332 924 987 | 3 | 12 | 200 : 1 145 ; 502 : 3 |
| 07:30 | 1 384 | 18 | 415 842 647 | 2 | 16 | 200 : 1 382 ; 502 : 2 |
| 07:40 | 1 000 | 25 | 264 205 000 | 0 | 17 | 200 : 1 000 |
| 07:50 | 509 | 0 | 123 087 281 | 1 | 1 | 200 : 506 ; 502 : 1 |
| 08:00 | 389 | 1 | 91 975 259 | 0 | 0 | 200 : 389 |
| 08:10 | 749 | 2 | 224 924 723 | 0 | 0 | 200 : 749 |
| 08:20 | 930 | 79 | 240 654 856 | 0 | 1 | 200 : 930 |
| 08:30 | 991 | 3 | 312 643 504 | 0 | 6 | 200 : 991 |
| 08:40 | 1 215 | 55 | 424 325 387 | 1 | 12 | 200 : 1 210 ; 502 : 1 |
| 08:50 | 799 | 0 | 275 390 170 | 0 | 0 | 200 : 799 |
| 09:00 | 783 | 9 | 250 635 792 | 1 | 1 | 200 : 782 ; 502 : 1 |
| 09:10 | 1 208 | 4 | 421 267 174 | 0 | 9 | 200 : 1 206 |
| 09:20 | 464 | 0 | 133 418 748 | 0 | 0 | 200 : 464 |
| 09:30 | 898 | 3 | 279 972 736 | 1 | 4 | 200 : 897 ; 502 : 1 |
| 09:50 | 699 | 21 | 194 298 810 | 0 | 0 | 200 : 697 |
| 10:00 | 757 | 22 | 241 095 068 | 0 | 1 | 200 : 757 |
| 10:10 | 683 | 20 | 215 101 802 | 2 | 6 | 200 : 679 ; 502 : 2 |

## 4. Préchauffage

- Préchauffages : 4 267 ; actifs (nœuds > 0 ou hiérarchies > 0) : 2 680 ; annulés : 796.
- Par motif : fini : 2 082 ; aucun-noeud : 985 ; coupe : 785 ; plafond-lot : 253 ; plafond-octets : 142 ; pause-serveur : 7 ; reseau-occupe : 4 ; loin : 3 ; sans-suivante : 3 ; capture : 2 ; chargement : 1.
- Par source : relu : 2 848 ; liste-esv : 1 392 ; passe-differes : 13 ; changement-mode : 11 ; (vide) : 3.
- Demandé : 7 523 nœuds, 0 hiérarchies, 9 118 467 470 octets.
- sansNom : 0 ; sansAdresse : 0 ; formeNoeud (masque de bits → nombre) : 30992 : 2 449 ; 30736 : 826.
- Bilans : 4 253 ; prédiction juste 4 244 (99,8 %) ; demandés par Potree 1 396, couverts 0 (0 %), servis par le cache 0.
- load() de Potree lancés par nous : 7 523 ; chargés : 6 381 ; en échec : 0.
- Arrivée (voie potree, 3 968 bilans) : nœuds de la boîte 102 480 à l'arrivée (102 480 après la capture) ; chargés à l'arrivée 101 227, dont par nous 91 263 (319 encore en vol) ; chargés ensuite par Potree lui-même 485 ; part déjà chargée 99,5 %.
- Opérations lointaines : 293 (arrivee : 280 ; pause-serveur : 9 ; remplace : 3 ; refus-serveur : 1) ; load() lancés 3 717, chargés avant l'arrivée 3 568, en échec 2 ; départ médian 3 capture(s) et 6,4 s avant l'arrivée.
  - À l'arrivée (280) : chargés 6 502 sur 7 270, dont par nous 5 940 ; Potree lui-même ensuite 305 ; part déjà chargée 95,5 %.
- Vue de Potree (553 relevé(s), dernier) : caméra orthographique, pointBudget 2 000 000, pointLoadLimit 4 000 000, maxLevel -1 ; fetch natif true, en-têtes XHR 0, accréditations XHR false.

## 5. Ombres de D-308

- Garde de voie : 1 344 évaluations, 19 pause(s) qu'elle aurait demandée(s).
  - partie 25, cut 3686 : écartement 1451,25 mm, référence 1433,45 mm, écart au voisinage 17,8 mm.
  - partie 26, cut 1740 : écartement 1459,45 mm, référence 1436,93 mm, écart au voisinage 22,52 mm.
  - partie 26, cut 2945 : écartement 1447,93 mm, référence 1432,1 mm, écart au voisinage 15,83 mm.
  - partie 27, cut 3034 : écartement 1449,71 mm, référence 1434,7 mm, écart au voisinage 15,01 mm.
  - partie 27, cut 3090 : écartement 1451,57 mm, référence 1434,49 mm, écart au voisinage 17,08 mm.
  - partie 27, cut 3108 : écartement 1433,4 mm, référence 1452,09 mm, écart au voisinage -18,69 mm.
  - partie 27, cut 3112 : écartement 1435,78 mm, référence 1451,95 mm, écart au voisinage -16,17 mm.
  - partie 27, cut 3113 : écartement 1435,99 mm, référence 1451,5 mm, écart au voisinage -15,51 mm.
  - partie 27, cut 3195 : écartement 1467,77 mm, référence 1438,39 mm, écart au voisinage 29,38 mm.
  - partie 27, cut 3197 : écartement 1459,9 mm, référence 1438,39 mm, écart au voisinage 21,51 mm.
  - partie 27, cut 3286 : écartement 1462,39 mm, référence 1438,66 mm, écart au voisinage 23,73 mm.
  - partie 27, cut 8398 : écartement 1450,93 mm, référence 1434,41 mm, écart au voisinage 16,52 mm.
  - partie 27, cut 8444 : écartement 1449,23 mm, référence 1432,73 mm, écart au voisinage 16,5 mm.
  - partie 27, cut 8465 : écartement 1450,63 mm, référence 1434,92 mm, écart au voisinage 15,71 mm.
  - partie 27, cut 8477 : écartement 1420,73 mm, référence 1436,55 mm, écart au voisinage -15,82 mm.
  - partie 29, cut 3161 : écartement 1456,49 mm, référence 1430,34 mm, écart au voisinage 26,15 mm.
  - partie 31, cut 50 : écartement 1468,82 mm, référence 1451,57 mm, écart au voisinage 17,25 mm.
  - partie 31, cut 63 : écartement 1436,81 mm, référence 1452,63 mm, écart au voisinage -15,82 mm.
  - partie 31, cut 65 : écartement 1434,51 mm, référence 1451,34 mm, écart au voisinage -16,83 mm.
- Serrage du lot : 190 cut(s). Plus fortes corrections (10 sur 190, liste complète avec --json) :
  - partie 27, cut 3108 : écartement 1433,4 mm avant, 1452,09 mm après (18,69 mm).
  - partie 27, cut 3090 : écartement 1451,57 mm avant, 1434,49 mm après (-17,08 mm).
  - partie 30, cut 9951 : écartement 1451,32 mm avant, 1435 mm après (-16,32 mm).
  - partie 27, cut 3034 : écartement 1449,71 mm avant, 1434,7 mm après (-15,01 mm).
  - partie 27, cut 3092 : écartement 1451,95 mm avant, 1437 mm après (-14,95 mm).
  - partie 27, cut 8381 : écartement 1420,51 mm avant, 1435,21 mm après (14,7 mm).
  - partie 27, cut 2921 : écartement 1449,53 mm avant, 1435 mm après (-14,53 mm).
  - partie 27, cut 3098 : écartement 1457,44 mm avant, 1443,03 mm après (-14,41 mm).
  - partie 27, cut 3109 : écartement 1437,7 mm avant, 1452,02 mm après (14,32 mm).
  - partie 27, cut 3037 : écartement 1449,33 mm avant, 1435,12 mm après (-14,21 mm).

## 6. Relecture et passe

- Relecture (corriger, fin) : 324 faits sur 324, 33 corrigés, 0 refusés, 308 vus, durée 242,2 s.
- Relecture (corriger, fin) : 844 faits sur 844, 60 corrigés, 0 refusés, 839 vus, durée 1105,3 s.
- Relecture (corriger, fin) : 874 faits sur 874, 109 corrigés, 0 refusés, 788 vus, durée 1203,3 s.
- Relecture (corriger, fin) : 90 faits sur 90, 5 corrigés, 0 refusés, 90 vus, durée 76,4 s.
- Relecture (corriger, fin) : 720 faits sur 720, 45 corrigés, 0 refusés, 713 vus, durée 1170,6 s.
- Relecture (corriger, fin) : 389 faits sur 389, 34 corrigés, 0 refusés, 385 vus, durée 1596,8 s.
- Relecture (corriger, fin) : 229 faits sur 229, 10 corrigés, 0 refusés, 221 vus, durée 354,2 s.
- Relecture (corriger, fin) : 82 faits sur 82, 4 corrigés, 0 refusés, 82 vus, durée 72,5 s.
- Passe des différés : passe-differes-ombre : 102 ; passe-differes-ecriture : 18 ; passe-differes-ombre-fin : 8 ; passe-differes-ecriture-fin : 6.
  - Ombre par décision : rien : 74 ; poserait : 28.
  - Fin d'ombre (ecriture) : 5 différés, 3 posés.
  - Fin d'ombre (ecriture) : 5 différés, 4 posés.
  - Fin d'ombre (ecriture) : 36 différés, 11 posés.
  - Fin d'ombre (ecriture) : 0 différés, 0 posés.
  - Fin d'ombre (ecriture) : 7 différés, 7 posés.
  - Fin d'ombre (ecriture) : 3 différés, 1 posés.
  - Fin d'ombre (ecriture) : 8 différés, 2 posés.
  - Fin d'ombre (ecriture) : 0 différés, 0 posés.
  - Écritures par résultat : ecrit : 17 ; refuse : 1.
  - Fin d'écriture (fin) : 3 écrites sur 3 demandées (3 décidées).
  - Fin d'écriture (fin) : 4 écrites sur 4 demandées (4 décidées).
  - Fin d'écriture (refuse, cible hors de la vue : cette passe ne déplace pas la vue) : 0 écrites sur 10 demandées (11 décidées).
  - Fin d'écriture (fin) : 7 écrites sur 7 demandées (7 décidées).
  - Fin d'écriture (fin) : 1 écrites sur 1 demandées (1 décidées).
  - Fin d'écriture (fin) : 2 écrites sur 2 demandées (2 décidées).
