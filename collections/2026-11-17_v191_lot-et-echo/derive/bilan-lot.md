# Bilan de lot

Qualification : chiffres lus au journal (ÉTABLI). Aucun identifiant, aucune adresse.

## 1. Lot

- Période : du 2026-11-17T14:08:27.027Z au 2026-11-17T17:12:43.174Z (UTC), soit 11056,1 s.
- Partie(s) : 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13.
- Coupes validées : 750 ; différées : 95.
- Séries de captures vides : 0 ; captures abandonnées : 96 (deferred-unresolved : 95 ; new-automatic-batch : 1).
- Lecture Rust : servie 7 742, repli 0 sur 7 742 lectures.

| Partie | Validées | Différées | Abandonnées |
|---|---|---|---|
| 3 | 1 | 1 | 1 |
| 4 | 55 | 0 | 0 |
| 5 | 91 | 1 | 1 |
| 6 | 103 | 23 | 23 |
| 7 | 211 | 31 | 32 |
| 8 | 9 | 2 | 2 |
| 9 | 9 | 1 | 1 |
| 10 | 50 | 2 | 2 |
| 11 | 27 | 0 | 0 |
| 12 | 45 | 1 | 1 |
| 13 | 149 | 33 | 33 |

## 2. Temps

- Cut (intervalle entre validations successives, moins de 10 s) : 728 intervalles ; médian 832 ms ; P90 2,6 s.
- Capture (elapsedMs de capture-ready), selon le saut depuis la coupe précédente :

| Saut | Captures | Médiane | P90 |
|---|---|---|---|
| +1 | 680 | 115 ms | 508 ms |
| 2-10 | 63 | 119 ms | 1,1 s |
| 11-50 | 31 | 118 ms | 616 ms |
| 51-200 | 21 | 266 ms | 2,3 s |
| >200 | 30 | 1,4 s | 4,7 s |
| autre | 0 | — | — |

Captures sans coupe appariée dans l'ordre des before-captured : 0.

## 3. Chargement d'ESV

- Nœuds téléchargés : 8 635, dont servis par le cache : 357 (4,1 %) ; octets : 2 486 618 197.
- Statuts de réponse : 200 : 8 612 ; 502 : 5 ; sans statut : 0 ; échecs : 5.
- Épisodes de compteur bloqué : 101.

| Tranche de 10 min (UTC) | Nœuds | Cache | Octets | Échecs | Compteur bloqué | Statuts |
|---|---|---|---|---|---|---|
| 14:00 | 154 | 36 | 45 567 906 | 0 | 1 | 200 : 152 |
| 14:10 | 1 419 | 107 | 434 491 698 | 0 | 26 | 200 : 1 415 |
| 14:20 | 1 423 | 84 | 437 332 520 | 0 | 14 | 200 : 1 421 |
| 14:30 | 1 649 | 54 | 461 071 267 | 2 | 15 | 200 : 1 647 ; 502 : 2 |
| 14:40 | 1 120 | 33 | 311 994 059 | 1 | 18 | 200 : 1 113 ; 502 : 1 |
| 14:50 | 734 | 22 | 214 593 737 | 0 | 9 | 200 : 730 |
| 15:00 | 1 293 | 5 | 360 662 859 | 2 | 9 | 200 : 1 291 ; 502 : 2 |
| 15:10 | 843 | 16 | 220 904 151 | 0 | 9 | 200 : 843 |

## 4. Préchauffage

- Préchauffages : 3 850 ; actifs (nœuds > 0 ou hiérarchies > 0) : 2 275 ; annulés : 1 825.
- Par motif : coupe : 1 818 ; aucun-noeud : 913 ; fini : 686 ; plafond-octets : 400 ; plafond-lot : 11 ; reseau-occupe : 6 ; loin : 5 ; capture : 4 ; sans-suivante : 4 ; pause-serveur : 2 ; chargement : 1.
- Par source : relu : 3 005 ; liste-esv : 816 ; changement-mode : 19 ; passe-differes : 6 ; (vide) : 4.
- Demandé : 5 167 nœuds, 0 hiérarchies, 3 009 769 525 octets.
- sansNom : 0 ; sansAdresse : 0 ; formeNoeud (masque de bits → nombre) : 30992 : 2 263 ; 30736 : 659.
- Bilans : 3 827 ; prédiction juste 3 815 (99,7 %) ; demandés par Potree 1 207, couverts 0 (0 %), servis par le cache 0.
- load() de Potree lancés par nous : 5 167 ; chargés : 2 099 ; en échec : 0.
- Arrivée (voie potree, 3 656 bilans) : nœuds de la boîte 86 456 à l'arrivée (86 456 après la capture) ; chargés à l'arrivée 84 585, dont par nous 70 160 (890 encore en vol) ; chargés ensuite par Potree lui-même 545 ; part déjà chargée 99,4 %.
- Opérations lointaines : 173 (arrivee : 168 ; pause-serveur : 3 ; remplace : 2) ; load() lancés 1 907, chargés avant l'arrivée 1 748, en échec 0 ; départ médian 6 capture(s) et 7,2 s avant l'arrivée.
  - À l'arrivée (168) : chargés 3 187 sur 3 904, dont par nous 2 714 ; Potree lui-même ensuite 352 ; part déjà chargée 90,1 %.
- Vue de Potree (1 392 relevé(s), dernier) : caméra orthographique, pointBudget 2 000 000, pointLoadLimit 4 000 000, maxLevel -1 ; fetch natif true, en-têtes XHR 0, accréditations XHR false.

## 5. Ombres de D-308

- Garde de voie : 740 évaluations, 4 pause(s) qu'elle aurait demandée(s).
  - partie 6, cut 9001 : écartement 1466,89 mm, référence 1442,34 mm, écart au voisinage 24,55 mm.
  - partie 7, cut 416 : écartement 1458,67 mm, référence 1442,46 mm, écart au voisinage 16,21 mm.
  - partie 7, cut 443 : écartement 1457,55 mm, référence 1442,49 mm, écart au voisinage 15,06 mm.
  - partie 11, cut 6233 : écartement 1469,29 mm, référence 1440,86 mm, écart au voisinage 28,43 mm.
- Serrage du lot : 138 cut(s). Plus fortes corrections (10 sur 138, liste complète avec --json) :
  - partie 7, cut 153 : écartement 1452,82 mm avant, 1435 mm après (-17,82 mm).
  - partie 12, cut 1339 : écartement 1451,24 mm avant, 1435 mm après (-16,24 mm).
  - partie 6, cut 7137 : écartement 1449,8 mm avant, 1435 mm après (-14,8 mm).
  - partie 7, cut 155 : écartement 1457,42 mm avant, 1443,46 mm après (-13,96 mm).
  - partie 7, cut 376 : écartement 1433,33 mm avant, 1445,42 mm après (12,09 mm).
  - partie 12, cut 1337 : écartement 1446,69 mm avant, 1435 mm après (-11,69 mm).
  - partie 12, cut 1341 : écartement 1430,72 mm avant, 1442,37 mm après (11,65 mm).
  - partie 7, cut 384 : écartement 1434,15 mm avant, 1445,79 mm après (11,64 mm).
  - partie 6, cut 7135 : écartement 1424,48 mm avant, 1435 mm après (10,52 mm).
  - partie 6, cut 9003 : écartement 1455,83 mm avant, 1445,97 mm après (-9,86 mm).

## 6. Relecture et passe

- Relecture (corriger, fin) : 38 faits sur 38, 19 corrigés, 0 refusés, 27 vus, durée 42,1 s.
- Relecture (corriger, fin) : 342 faits sur 342, 34 corrigés, 0 refusés, 342 vus, durée 199,5 s.
- Relecture (corriger, fin) : 174 faits sur 174, 15 corrigés, 0 refusés, 173 vus, durée 119,8 s.
- Relecture (corriger, fin) : 396 faits sur 396, 65 corrigés, 0 refusés, 372 vus, durée 381,6 s.
- Relecture (corriger, fin) : 468 faits sur 468, 70 corrigés, 0 refusés, 437 vus, durée 449,8 s.
- Relecture (corriger, fin) : 151 faits sur 151, 23 corrigés, 0 refusés, 149 vus, durée 104,1 s.
- Relecture (corriger, fin) : 129 faits sur 129, 14 corrigés, 0 refusés, 128 vus, durée 90,5 s.
- Relecture (corriger, fin) : 334 faits sur 334, 52 corrigés, 0 refusés, 332 vus, durée 284,6 s.
- Relecture (corriger, fin) : 111 faits sur 111, 12 corrigés, 0 refusés, 111 vus, durée 63,5 s.
- Relecture (corriger, fin) : 176 faits sur 176, 24 corrigés, 0 refusés, 175 vus, durée 114,5 s.
- Relecture (corriger, fin) : 706 faits sur 706, 113 corrigés, 0 refusés, 673 vus, durée 587,9 s.
- Passe des différés : passe-differes-ombre : 121 ; passe-differes-ombre-fin : 11 ; passe-differes-ecriture : 10 ; passe-differes-ecriture-fin : 4.
  - Ombre par décision : rien : 111 ; poserait : 10.
  - Fin d'ombre (ecriture) : 1 différés, 0 posés.
  - Fin d'ombre (ecriture) : 0 différés, 0 posés.
  - Fin d'ombre (ecriture) : 1 différés, 0 posés.
  - Fin d'ombre (ecriture) : 20 différés, 4 posés.
  - Fin d'ombre (ecriture) : 18 différés, 3 posés.
  - Fin d'ombre (ecriture) : 2 différés, 0 posés.
  - Fin d'ombre (ecriture) : 1 différés, 0 posés.
  - Fin d'ombre (ecriture) : 2 différés, 0 posés.
  - Fin d'ombre (ecriture) : 0 différés, 0 posés.
  - Fin d'ombre (ecriture) : 1 différés, 1 posés.
  - Fin d'ombre (ecriture) : 24 différés, 2 posés.
  - Écritures par résultat : ecrit : 10.
  - Fin d'écriture (fin) : 4 écrites sur 4 demandées (4 décidées).
  - Fin d'écriture (fin) : 3 écrites sur 3 demandées (3 décidées).
  - Fin d'écriture (fin) : 1 écrites sur 1 demandées (1 décidées).
  - Fin d'écriture (fin) : 2 écrites sur 2 demandées (2 décidées).
