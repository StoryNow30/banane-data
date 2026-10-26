# Parties 0 et 1 du 26/10/2026 : lots, cuts différés, passe en ombre et garde A

Lecture seule, rien rejoué, rien commité. Heures de Paris. ÉTABLI (mesuré), PROBABLE, SUPPOSÉ. **Périmètre restreint** : seuls les différés sont jugés contre l'Écho (pose finale = dernière validation observée). Outils : `jointure-echo-orbite`, `perf-lot`, `garde-passe-appuis.js` de la test 23. Scripts `$S/p01/scripts`, résultats `$S/p01/res`.

## À retenir

- **Partie 0** (4.9.5.22, test 22, sans garde A) : 597 cibles, **558 posés + 39 différés**, 62 min 29,6 s. Passe en ombre : 12 « poserait », 27 « rien », **0 écrit**. L'Écho a visité **39 différés sur 39**, tous réellement traités (35 à 174 mm du départ).
- **Partie 1** (test 23, garde A présente, pas de relecture) : 380 cibles, **352 posés + 28 différés**, 30 min 34,7 s. Passe : 9 « poserait », 19 « rien », **0 écrit**. Écho : **28 sur 28** visités et traités (4 à 168 mm du départ).
- **Les 21 « poserait »** : 19 à ≤ 20 mm de la pose finale, 2 à 21,4 et 22,5 mm, **0 > 50 mm, 0 mauvaise voie** ; résidu surtout vertical. La **garde A n'a rien bloqué** (recalculée en partie 0, réelle en partie 1).
- **Cumul avec 18 et 20** : 76 différés, 27 « poserait », 24 à ≤ 20 mm, 3 entre 20 et 50, 0 > 50 (Wilson haut 12,5 %) ; la garde en bloquerait 1, une bonne. Effectif insuffisant pour conclure (§ 3).
- **Nuage** : 5 différés à nuage vide (0 à 2 points), 31 différés sur 67 portent `minTop` ou `input` ; la saleté du nuage n'est pas mesurable (§ 4).

## 1. Les lots (partie A)

| | **Partie 0** (test 22) | **Partie 1** (test 23) |
|---|---|---|
| Bornes (mode rapide « Comme avant », règle « grappe de différés » coupée) | 13 h 22 min 36,4 s à 14 h 25 min 06,0 s : **62 min 29,6 s** | 14 h 56 min 37,3 s à 15 h 27 min 12,0 s : **30 min 34,7 s** ; départ posé sur le cut 0, déjà vert, reporté au cut 1 à 14 h 56 min 42,6 s (non compté comme cible) |
| Cibles / posés / différés | **597 / 558 / 39** (597 invalides au départ) | **380 / 352 / 28** (380 invalides au départ) |
| Étapes de décision | chaîne normale 469, fenêtre 38 (+7 reprises par la chaîne après différé), choix 3 (+2), passage à niveau 0, GCV2 dans le lot 39, différés 39 | chaîne normale 308, fenêtre 10 (+2), choix 7 (+2), passage à niveau 7, GCV2 16, différés 28 |
| Cycle par cut, hors silences (médiane / p90 / max) | **6,22 / 8,87 / 18,0 s** (595) ; 6,28 s par cible ; V1 5,64 / 8,20 | **4,71 / 7,19 / 10,3 s** (379) ; 4,83 s par cible ; V1 4,21 / 6,54 |
| Médianes par étape | chaîne 6,04 ; fenêtre 5,18 ; choix 5,67 ; GCV2 8,01 ; différés 7,66 | chaîne 4,40 ; fenêtre 3,69 ; choix 4,98 ; PN 5,29 ; GCV2 5,56 ; différés 5,32 |
| Phases médianes (navigation→capture / analyse / décision / pose / validation) | 3,42 (p90 5,4) / 0,75 / 0,15 / 0,40 / 0,34 s | 2,62 (p90 4,9) / 0,56 / 0,10 / 0,31 / 0,25 s |
| Arrêts, pauses, SW | 1 arrêt (fin normale, dernier cut 9806), 0 pause, 0 silence > 60 s, **0 redémarrage du SW** (une session, horloge unique, `lost` 0) | 1 arrêt (fin normale, dernier cut 9599), 0 pause, 0 silence, **0 redémarrage** (`interruptedByRestart` faux) ; reconnexion automatique « équipé » (1 essai, 18 ms) à 14 h 56 min 09 s, 28 s avant le départ |
| Incidents | 508 clics « hors canevas » (bilan), 0 réponse non 2xx, 0 erreur de commande dans le lot (4 en relecture) ; « compteur bloqué » 49 (lot) + 59 (relecture) ; 39 captures abandonnées = les 39 différés | 314 clics, 0 non 2xx, 0 erreur ; « compteur bloqué » 23 ; 29 captures abandonnées = 28 différés + le cut 0 vert |
| **Preuve d'écriture** (2xx, jamais `serverConfirmed`) | **558 écritures 2xx de validation sur 558 lignes distinctes = les 558 posés**, 0 doublon, 0 hors cibles ; la dernière 0,38 s après l'arrêt. Liste de 14 h 25 : 39 invalides ; départ de l'Écho (15 h 35 min 07 s) : 39 invalides = exactement les 39 différés | **352 sur 352**, 0 doublon, 0 hors cibles ; la dernière 1,98 s après l'arrêt. Départ de l'Écho (15 h 57 min 18 s) : 28 invalides = exactement les 28 différés |
| **Deuxième passe (ombre)** | **A tourné** (63,7 s de calcul, fin 63,9 s après l'arrêt) : 66 décisions (39 en passe 1 : 12 « poserait » + 27 « rien » ; 27 « rien » en passe 2). « Rien » : `départ-le-plus-probable` 15, `sans-approche` 7, `sans-voie` 4, `plus-de-150-mm` 1 | **A tourné** (34,6 s, fin 34,7 s après l'arrêt) : 47 décisions (28 en passe 1 : 9 « poserait » + 19 « rien » ; 19 « rien » en passe 2). « Rien » : `départ-le-plus-probable` 8, `sans-approche` 6, `sous-delta` 2, `sans-voie` 1, `veto-voie` 1, `commande:gauge-HIGH_INVALID` 1 |
| **0 écrit par la passe ? Oui, vérifié** | mode `ombre`, `ecritureDemandee` faux, 0 événement `passe-differes-ecriture`, `ecritsPasse` = 0 (journal des fins de lot) ; sur les 39 lignes : 39 écritures 2xx en tout, toutes la marque « vu » (une par ligne, pendant le lot), **0 écriture de validation** ; liste de l'Écho : 39 toujours invalides, poses des 39 inchangées entre les deux listes | mêmes contrôles : `ecritsPasse` = 0 ; sur les 28 lignes : 28 marques « vu », **0 écriture de validation**, aucune après l'arrêt ; 28 toujours invalides au départ de l'Écho |
| Relecture « corriger » | 14 h 25 min 19 s à 15 h 27 min 38 s (3 739 s, 4,61 s/cut) : **811 relus, 100 corrigés** (98 chaîne normale, 1 PN, 1 fenêtre ; 53 abords, 25 ADV, 22 écartement), 801 « vu », 0 refus ; 100 écritures 2xx = exactement les 100 corrigés (aucun n'est un différé). Déplacement du pire rail **min 8,2 / médiane 12,0 / max 43,9 mm ; 17 > 20, 0 > 50** | **aucune** (pas d'événement de relecture dans le journal) |

« Reprises » : cuts marqués `deferred` par le moteur puis posés par la chaîne ; ils comptent comme appuis normaux dans la garde recalculée.

## 2. Les différés, cut par cut (tableaux complets en annexe)

| | **Partie 0** | **Partie 1** |
|---|---|---|
| Écho (dernier export seul) | 15 h 34 min 55 s à 15 h 56 min 51 s (21 min 56 s), 149 visites, 127 cuts dont 39 différés, 19 posés, 69 hors lot | 15 h 57 min 13 s à 16 h 09 min 24 s (12 min 11 s), 218 visites, 153 cuts dont 28 différés, 33 posés, 92 hors lot |
| **Différés visités** | **39 sur 39** | **28 sur 28** (visites par différé, deux lots : 1 visite 28 cuts, 2 visites 37, 3 visites 2) |
| (c) Ce que l'opérateur a fait | **39 réellement traités** (validation observée, écriture 2xx de validation sur les 39 lignes), **0 « vu sans geste », 0 non visité**. Étiquettes : 24 deux rails, 7 gauche seul, 7 droit seul, 1 « validé sans mouvement » à la dernière visite (4362, 2 visites, pose finale à 143,8 mm du départ : déplacée à une visite antérieure, SUPPOSÉ) | **28 réellement traités**, 0 « vu sans geste », 0 non visité. Étiquettes : 23 deux rails, 3 gauche seul, 2 droit seul |
| Déplacement départ → pose finale, pire rail | min 34,7 / médiane 140,9 / max 173,7 mm ; 38 > 50, 36 > 100 | min 4,1 / médiane 107,4 / max 167,9 mm ; 25 > 50, 16 > 100 |
| (a) Passe en ombre | 12 « poserait », 27 « rien » | 9 « poserait », 19 « rien » |
| (b) Garde A | recalculée : laisse passer 12/12 (11 par D ≥ 100 mm, 1 par appui à 1 cut : 1106, D 90,5) ; **pas de garde dans ce lot** (champ `garde` absent des 66 événements) | **réelle** : champ `garde` sur les 9 « poserait », `bloque` faux 9 fois (5 `loin-du-depart`, 4 `appui-normal`) ; 0 « rien » au motif `garde-appuis` |
| (d) « Poserait » contre la pose finale (pire rail 3D) | 11/12 ≤ 20 mm (7 ≤ 10, 6 ≤ 5), 1 à 21,4 ; médiane 7,1, max 21,4 ; **0 > 50** | 8/9 ≤ 20 mm (3 ≤ 10, 1 ≤ 5), 1 à 22,5 ; médiane 11,2, max 22,5 ; **0 > 50** |

Lecture. « Juste » = ≤ 20 mm de la pose finale, « fausse » = > 50 mm, « intermédiaire » entre les deux.
- **Les 21 « poserait »** sont plus proches de la pose finale que le départ (72 à 174 mm). Ils déplacent le pire rail de 81 à 183 mm et retrouvent la voie à 11,9 mm ou moins en latéral ; le reste est vertical (vertical ≥ latéral sur 14 sur 21). Intermédiaires : 2391 (21,4) et 1300 (22,5). 20 sur 21 ont un appui normal à 1 ou 2 cuts ; aucun sur nuage vide (minimum 5 802 points).
- **Les 46 « rien »** laissent des cuts que l'opérateur a déplacés de 4,1 à 172,7 mm (médiane 126,9 ; 36 > 100) : rien d'apporté, rien d'abîmé. `départ-le-plus-probable` (23) : départ déplacé de 133,7 mm en médiane (22 sur 23 de plus de 30 mm) ; `sous-delta` (2, partie 1 : 6606, 7009) : seuls départs presque bons (13,2 et 4,1 mm).
- **Garde A** : 5 des 21 poses ont D < 100 mm (1106, 1012, 1039, 1300, 7330), toutes avec un appui à 1 cut : les deux conditions n'ont jamais été réunies ; elle laisse aussi passer les 2 poses intermédiaires.

## 3. Bilan de la passe et de la garde, cumulé avec les parties 18 et 20

Écart du « poserait » à la pose finale (pire rail 3D) : justes ≤ 20 mm, fausses > 50 mm ; ≤ 10 mm donné pour comparer au rapport 18-19-20 (où « juste » = ≤ 10 mm). Parties 18 et 20 reprises de `$S/p182019/RAPPORT.md`.

| | P0 (test 22) | P1 (test 23) | P18 (test 21) | P20 (test 21) | **Total** |
|---|---|---|---|---|---|
| Différés / « poserait » / « rien » | 39 / 12 / 27 | 28 / 9 / 19 | 5 / 2 / 3 | 4 / 4 / 0 | **76 / 27 / 49** |
| ≤ 5 mm / ≤ 10 mm | 6 / 7 | 1 / 3 | 1 / 1 | 3 / 4 | **11 / 15** |
| **Justes (≤ 20 mm)** | 11 | 8 | 1 | 4 | **24** |
| Intermédiaires (20 à 50 mm) | 1 (21,4) | 1 (22,5) | 1 (21,0) | 0 | **3** |
| **Fausses (> 50 mm) / mauvaise voie** | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | **0 / 0** |
| Écart médian / max (mm) | 7,1 / 21,4 | 11,2 / 22,5 | 12,9 / 21,0 | 3,9 / 9,1 | 9,1 / 22,5 |
| **Garde A : bloque** (lot) | 0 (recalculée) | 0 (réelle) | 0 (recalculée) | 1 (9802, juste 3,6 mm) | **1** |
| Avec garde A : justes / intermédiaires / fausses | 11 / 1 / 0 | 8 / 1 / 0 | 1 / 1 / 0 | 3 / 0 / 0 | **23 / 3 / 0** |

- **Vrais et faux positifs** : sans garde, 24 justes, 3 intermédiaires, 0 fausses ; avec la garde A, 23 / 3 / 0 : **une bonne pose perdue, aucune fausse évitée**. Avec la partie 17 (5183, 17,7 mm) : 28 « poserait », 25 justes, mêmes pertes.
- **Effectif** : 27 « poserait » sur 76 différés (36 %), 0 > 50 mm : Wilson haut 95 % **12,5 %** ; > 20 mm : 3/27 (Wilson 3,9 à 28,1 %). À 0 faute, une borne ≤ 3 % demande 125 poses, ≤ 1 % : 381 (le « 363 » du rapport 18-19-20 vient d'un arrondi à 0,1 %). Au rythme observé, 125 poses = environ 19 parties (SUPPOSÉ). **L'effectif cumulé ne permet pas de décider de rouvrir l'écriture** ; il établit seulement qu'aucune des 27 poses n'a dépassé 22,5 mm.
- **Limites** : un opérateur ; nuage « très sale » (les résidus de 10 à 13 mm, 9 poses sur 21, sont peut-être dans l'incertitude de la vérité : SUPPOSÉ) ; voisins posés par Ariane non jugés ; le cas visé par la garde (différé isolé, loin de tout appui) n'a que 2 poses sur 27 (9802, 9803, justes) ; 24 des 27 sont à ≤ 2 cuts d'un appui.

## 4. Qualité du nuage : ce qui se mesure sans deviner

Points par capture : `adapter-result` de capture, fenêtre du lot.

| | Partie 0 | Partie 1 |
|---|---|---|
| Points par capture, posés (médiane / p10 / minimum) | 11 820 / 9 984 / 1 930 (558) | 11 287 / 7 033 / 5 754 (352) |
| Points par capture, différés (médiane / p10 / minimum) | 11 680 / 8 804 / 0 (39) | 11 099 / 3 968 / 0 (28) |
| **Cuts à nuage vide (≤ 2 points)** | **2**, tous différés : 4362 (2 points), 9541 (0) | **3**, tous différés : 7008 (0), 7009 (1), 8168 (2) |
| Posés à moins de 3 000 / 5 000 points | 1 / 2 | 0 / 0 |
| Motifs de différé liés au nuage | `input` : 2 cuts (= les 2 nuages vides) ; `minTop` (moins de 15 points de dessus) : 14 cuts ; **16 différés sur 39 (41 %)** | `input` : 3 cuts (= les 3 nuages vides) ; `minTop` : 12 cuts ; **15 différés sur 28 (54 %)** |
| « Poserait » portant `minTop` | 6 sur 12 | 5 sur 9 |
| `cloudsInCorpus` (bilan) | 597 captureId = les 597 captures du lot ; `clouds` du bilan vide | 381 = les 381 captures du lot (cut 0 compris) ; `clouds` vide |
| Écho : snapshots écartés pour `roi-point-count-below-minimum` / qualifiés | 559 sur 894 (62,5 %) / 112 (12,5 %) | 374 sur 716 (52,2 %) / 111 (15,5 %) |

- Échos précédents (test 21), même indicateur : partie 18, 283 snapshots sur 1 180 écartés (24,0 %), 31,2 % qualifiés ; partie 20, 370 sur 1 189 (31,1 %), 25,0 % qualifiés. Écart net, mais **non causal** : ces Échos visitent surtout des différés (cuts déjà difficiles), biais de sélection.
- ÉTABLI : `input` = nuage vide, 5 sur 5 dans les deux sens. En densité de lot, les posés des parties 0 et 1 ne sont pas pauvres (médiane ~11 000 points) ; la partie 1 a un p10 plus bas (7 033 contre 9 984).
- **Non mesurable** : la « saleté » (bruit, points parasites) ; journal et bilan ne portent que points, nœuds et motifs. Il faudrait lire le corpus (12 segments de ~60 Mo, partie 0 ; 7, partie 1) avec une définition de « sale ». Non fait.

## Limites

- Pour les 5 nuages vides (pose finale à 143,8 / 34,7 / 93,0 / 4,1 / 10,5 mm du départ), la vérité ne vient pas du nuage (SUPPOSÉ : voisins ou géométrie).
- Partie 0 = test 22 (version lue au journal, PROBABLE) : garde recalculée sur les décalages journalisés ; méthode vérifiée sur la partie 1 (9 poses sur 9 identiques au champ `garde`).
- Lots 0 et 1 plus lents que 18 à 20 : navigation→capture 3,4 et 2,6 s contre 1,0 à 1,1 s, pose et validation plus longues, analyse non ; « compteur bloqué » 49 et 23 contre 1 à 3. Mesuré, non expliqué.

## Annexe : les différés cut par cut

Légende. Motifs de différé (rail gauche/droit) : amb = ambiguïté, cand = candidat, éc = écartement hors contrat, mT = `minTop`, vide = `input` (nuage vide), fl = flanc. Points = points de la capture du lot (milliers). Passe : départ = `départ-le-plus-probable`, s-appr = `sans-approche`, s-voie = `sans-voie`, >150 = `plus-de-150-mm`, s-delta = `sous-delta`, veto = `veto-voie`, écart-inv = `commande:gauge-HIGH_INVALID`. D = déplacement du pire rail (mm, 3D) de la pose que la passe aurait faite ; pour « rien », (m) = écart de la meilleure hypothèse du moteur au départ (0 = le départ). Appui = distance en cuts au plus proche appui normal. Garde A : « passe » = laisse passer (motif entre parenthèses) ; « réelle » = champ `garde` du journal. Opérateur : tous réellement traités (validation observée) ; « corrigé x » = pose finale à x mm du départ (pire rail 3D) ; v. = visites. Dernière colonne : écart 3D du pire rail entre le « poserait » et la pose finale (juste ≤ 20 ; intermédiaire 20 à 50 ; fausse > 50).

### Partie 0
| Cut | Motif de différé (G/D) | Points | Passe en ombre | D (mm) | Appui (cuts) | Garde A | Opérateur (départ→final, visites) | Écart « poserait »→final |
|---|---|---|---|---|---|---|---|---|
| 507 | amb/cand | 16,5 | rien (départ) | 0,0 (m) | 1 | — | corrigé 146,7, 3 v. |  |
| 517 | mT/cand | 17,1 | rien (s-appr) | 106,4 (m) | 5 | — | corrigé 133,4, 2 v. |  |
| 561 | éc/éc | 17,1 | rien (s-appr) | 134,2 (m) | 1 | — | corrigé 140,6, 2 v. |  |
| 639 | mT/cand | 6,1 | rien (départ) | 0,0 (m) | 6 | — | corrigé 133,7, 2 v. |  |
| 717 | éc/éc | 15,0 | rien (s-voie) | 176,0 (m) | 1 | — | corrigé 156,5, 2 v. |  |
| 1106 | cand/amb | 12,6 | **poserait** | 90,5 | 1 | passe (appui ≤ 4) | corrigé 88,4, 2 v. | 3,1 (juste) |
| 1227 | amb/cand | 11,3 | rien (s-appr) | 123,0 (m) | 7 | — | corrigé 151,9, 2 v. |  |
| 1336 | éc/éc | 11,7 | rien (départ) | 0,0 (m) | 17 | — | corrigé 126,9, 2 v. |  |
| 1549 | cand/amb | 11,5 | **poserait** | 148,5 | 1 | passe (D ≥ 100) | corrigé 151,5, 1 v. | 10,5 (juste) |
| 1619 | mT/cand | 9,6 | rien (départ) | 0,0 (m) | 8 | — | corrigé 162,1, 2 v. |  |
| 1636 | pente/cand | 11,2 | rien (départ) | 0,0 (m) | 8 | — | corrigé 156,0, 2 v. |  |
| 2281 | cand/mT | 12,1 | **poserait** | 139,2 | 1 | passe (D ≥ 100) | corrigé 140,9, 1 v. | 2,5 (juste) |
| 2319 | mT/cand | 10,9 | rien (départ) | 0,0 (m) | 2 | — | corrigé 172,7, 1 v. |  |
| 2326 | mT/cand | 11,0 | rien (s-appr) | 118,4 (m) | 6 | — | corrigé 156,0, 1 v. |  |
| 2375 | cand/mT | 11,9 | **poserait** | 135,6 | 1 | passe (D ≥ 100) | corrigé 136,6, 1 v. | 13,1 (juste) |
| 2391 | cand/mT | 11,9 | **poserait** | 132,7 | 1 | passe (D ≥ 100) | corrigé 146,3, 1 v. | 21,4 (intermédiaire) |
| 2412 | cand/mT | 10,8 | **poserait** | 158,0 | 2 | passe (D ≥ 100) | corrigé 166,1, 1 v. | 11,2 (juste) |
| 2476 | éc/éc | 11,3 | rien (s-voie) | 124,3 (m) | 3 | — | corrigé 133,4, 1 v. |  |
| 2531 | cand/amb | 11,8 | rien (>150) | 189,9 (m) | 2 | — | corrigé 162,4, 1 v. |  |
| 2535 | éc/éc | 11,8 | **poserait** | 183,3 | 2 | passe (D ≥ 100) | corrigé 173,7, 1 v. | 11,9 (juste) |
| 2723 | amb/cand | 11,1 | rien (départ) | 0,0 (m) | 15 | — | corrigé 157,8, 1 v. |  |
| 2730 | amb/cand | 12,0 | rien (s-appr) | 56,8 (m) | 8 | — | corrigé 124,1, 1 v. |  |
| 2754 | éc/éc | 12,3 | rien (départ) | 0,0 (m) | 10 | — | corrigé 100,8, 1 v. |  |
| 2790 | amb/cand | 12,3 | rien (s-voie) | 135,5 (m) | 2 | — | corrigé 138,3, 1 v. |  |
| 2791 | amb/cand | 12,3 | **poserait** | 125,3 | 1 | passe (D ≥ 100) | corrigé 128,5, 1 v. | 3,3 (juste) |
| 4077 | amb/cand | 11,5 | rien (départ) | 0,0 (m) | 6 | — | corrigé 109,1, 1 v. |  |
| 4362 | vide/vide | 0,0 | rien (départ) | 0,0 (m) | 20 | — | corrigé 143,8, 2 v. (étiq. « sans mouvement ») |  |
| 4426 | cand/mT | 12,0 | rien (s-voie) | 157,6 (m) | 1 | — | corrigé 140,9, 1 v. |  |
| 4629 | amb/cand | 12,2 | **poserait** | 128,0 | 4 | passe (D ≥ 100) | corrigé 129,1, 1 v. | 2,2 (juste) |
| 4632 | éc/éc | 11,8 | **poserait** | 147,8 | 1 | passe (D ≥ 100) | corrigé 149,8, 1 v. | 4,1 (juste) |
| 5805 | mT/cand | 11,5 | rien (départ) | 0,0 (m) | 10 | — | corrigé 158,6, 2 v. |  |
| 5809 | amb/cand | 11,5 | rien (s-appr) | 120,4 (m) | 7 | — | corrigé 109,5, 2 v. |  |
| 5897 | cand/mT | 11,8 | **poserait** | 150,3 | 1 | passe (D ≥ 100) | corrigé 153,2, 1 v. | 10,0 (juste) |
| 7684 | rsf/cand | 5,2 | rien (s-appr) | 107,9 (m) | 21 | — | corrigé 104,7, 2 v. |  |
| 8457 | cand/mT | 9,5 | **poserait** | 148,1 | 1 | passe (D ≥ 100) | corrigé 149,5, 2 v. | 2,8 (juste) |
| 8768 | amb/cand | 9,8 | rien (départ) | 0,0 (m) | 10 | — | corrigé 125,0, 1 v. |  |
| 9315 | amb/cand | 11,7 | rien (départ) | 0,0 (m) | 13 | — | corrigé 137,5, 2 v. |  |
| 9541 | vide/vide | 0,0 | rien (départ) | 0,0 (m) | 38 | — | corrigé 34,7, 2 v. |  |
| 9764 | mT/cand | 10,5 | rien (départ) | 0,0 (m) | 17 | — | corrigé 92,7, 2 v. |  |

### Partie 1
| Cut | Motif de différé (G/D) | Points | Passe en ombre | D (mm) | Appui (cuts) | Garde A | Opérateur (départ→final, visites) | Écart « poserait »→final |
|---|---|---|---|---|---|---|---|---|
| 1012 | cand/amb | 12,1 | **poserait** | 93,6 | 1 | **réelle** passe (appui ≤ 4) | corrigé 89,2, 3 v. | 11,2 (juste) |
| 1039 | cand/amb | 11,6 | **poserait** | 97,2 | 1 | **réelle** passe (appui ≤ 4) | corrigé 94,6, 1 v. | 7,4 (juste) |
| 1141 | cand/mT | 12,2 | **poserait** | 142,8 | 1 | **réelle** passe (D ≥ 100) | corrigé 141,0, 1 v. | 6,3 (juste) |
| 1300 | éc/éc | 11,4 | **poserait** | 81,4 | 1 | **réelle** passe (appui ≤ 4) | corrigé 72,0, 1 v. | 22,5 (intermédiaire) |
| 1339 | éc/éc | 11,2 | rien (départ) | 0,0 (m) | 9 | — | corrigé 98,6, 2 v. |  |
| 1415 | éc/éc | 11,2 | rien (s-appr) | 68,1 (m) | 2 | — | corrigé 78,4, 1 v. |  |
| 1868 | amb/cand | 10,9 | rien (s-appr) | 119,4 (m) | 2 | — | corrigé 149,6, 1 v. |  |
| 1884 | éc/éc | 11,2 | rien (départ) | 0,0 (m) | 12 | — | corrigé 138,0, 2 v. |  |
| 2069 | éc/éc | 11,5 | rien (départ) | 0,0 (m) | 12 | — | corrigé 117,6, 2 v. |  |
| 2135 | éc/éc | 11,0 | **poserait** | 153,8 | 1 | **réelle** passe (D ≥ 100) | corrigé 152,4, 2 v. | 11,2 (juste) |
| 2151 | éc/éc | 10,2 | rien (écart-inv) | 118,7 (m) | 1 | — | corrigé 110,4, 2 v. |  |
| 3032 | mT/cand | 11,3 | rien (s-appr) | 142,9 (m) | 12 | — | corrigé 126,1, 2 v. |  |
| 3157 | cand/mT | 11,6 | **poserait** | 117,5 | 1 | **réelle** passe (D ≥ 100) | corrigé 125,9, 2 v. | 10,0 (juste) |
| 3224 | mT/cand | 11,5 | rien (s-appr) | 46,7 (m) | 16 | — | corrigé 126,8, 2 v. |  |
| 3802 | cand/mT | 11,8 | **poserait** | 138,5 | 1 | **réelle** passe (D ≥ 100) | corrigé 130,0, 2 v. | 13,1 (juste) |
| 3826 | mT/cand | 11,5 | rien (s-appr) | 115,7 (m) | 7 | — | corrigé 133,9, 2 v. |  |
| 3835 | amb/cand | 11,2 | rien (départ) | 0,0 (m) | 2 | — | corrigé 93,0, 2 v. |  |
| 4544 | mT/cand | 7,3 | rien (départ) | 0,0 (m) | 20 | — | corrigé 167,9, 2 v. |  |
| 4556 | mT/cand | 7,7 | rien (départ) | 0,0 (m) | 8 | — | corrigé 158,8, 2 v. |  |
| 4788 | éc/éc | 7,4 | rien (s-voie) | 55,2 (m) | 2 | — | corrigé 54,5, 2 v. |  |
| 4876 | amb/fl | 6,3 | rien (veto) | 113,3 (m) | 2 | — | corrigé 103,5, 1 v. |  |
| 5808 | cand/mT | 5,8 | **poserait** | 154,6 | 1 | **réelle** passe (D ≥ 100) | corrigé 161,2, 2 v. | 11,7 (juste) |
| 6606 | mT/cand | 5,7 | rien (s-delta) | 1,7 (m) | 70 | — | corrigé 13,2, 2 v. |  |
| 7008 | vide/vide | 0,0 | rien (s-appr) | 87,6 (m) | 2 | — | corrigé 93,0, 2 v. |  |
| 7009 | vide/vide | 0,0 | rien (s-delta) | 1,8 (m) | 1 | — | corrigé 4,1, 1 v. |  |
| 7330 | cand/mT | 7,1 | **poserait** | 94,3 | 1 | **réelle** passe (appui ≤ 4) | corrigé 95,0, 2 v. | 2,1 (juste) |
| 8168 | vide/vide | 0,0 | rien (départ) | 0,0 (m) | 74 | — | corrigé 10,5, 2 v. |  |
| 8673 | mT/cand | 7,6 | rien (départ) | 0,0 (m) | 8 | — | corrigé 107,4, 2 v. |  |
