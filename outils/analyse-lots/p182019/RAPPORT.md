# Lots des parties 18, 19, 20 et Échos des parties 18 et 20 (Ariane 4.9.5.21, test 21), 26/10/2026

Lecture seule, rien rejoué, rien commité. Heures de Paris (UTC+1). Niveaux : ÉTABLI (mesuré), PROBABLE, SUPPOSÉ. Méthode et outils identiques à l'analyse des parties 16 et 17 (`jointure-echo-orbite` strict et règle « vu sans geste ≥ 0,8 s », `perf-lot`, scripts dans `$S/p182019/scripts`, résultats dans `$S/p182019/res`). « Mauvaise voie » = écart latéral > 100 mm sur un rail. « Jugé » = cut visité dans l'Écho (validation de l'opérateur, ou visite ≥ 0,8 s sans geste comptée bonne) ; « validation » = vraie validation/correction observée.

## À retenir

- **Partie 18** : 83 cibles, **78 posés + 5 différés**, 6 min 05 s, 78 écritures 2xx. Écho : **66 jugés (10 validations + 56 vus)**, 12 non jugés. Écart du pire rail : médiane 0, p90 4,2, **max 8,4 mm ; 0 > 20, 0 > 50, 0 mauvaise voie**.
- **Partie 19** : 13 cibles, **13 posés, 0 différé**, 48,6 s. **Pas d'Écho (perdu) : pas de partie B**, rien n'est jugé. Passe : a tourné, 0 différé examiné.
- **Partie 20** : 74 cibles, **70 posés + 4 différés**, 4 min 42,7 s, 70 écritures 2xx. Écho : **36 jugés (7 validations + 29 vus)** ; **34 non jugés dont 32 jamais visités** (l'Écho s'arrête au cut 9859, 32 posés sont au-delà). Max **14,0 mm** (2 cuts > 10 mm, tous deux « GCV2 dans le lot ») ; **0 > 20, 0 > 50, 0 mauvaise voie**.
- **Deuxième passe (ombre)** : a tourné dans les 3 lots, **0 cut écrit** (vérifié, voir A). **6 « poserait » sur 9 différés** (parties 18 et 20) : 5 à 2,4–9,1 mm de l'opérateur, 1 à 21,0 mm ; aucun > 50 mm. La **garde A aurait bloqué 1 pose, une bonne (3,6 mm), et aucune fausse**.
- **Six lots** (15, 16, 17, 18, 20 avec vérité ; 19 sans) : **268 jugés dont 41 validations**, max 14,0 mm, **0 > 20, 0 > 50, 0 mauvaise voie**. Budget D-223 : borne haute de Wilson 1,4 % (règle) donc sous 3 % pour « > 50 mm » **si** les « vus » valent bons ; **non concluant sur les 41 validations seules (8,6 %)** ; mauvaise voie ≤ 1 % **non démontrée** (il faut 363 jugés sans erreur, 268 aujourd'hui).
- Les lots 18 à 20 sont **plus lents** que 15 à 17 (cycle médian 3,4–3,6 s contre 2,06–2,25 s).

## A. Les lots

| | **Partie 18** | **Partie 19** | **Partie 20** |
|---|---|---|---|
| Bornes (mode rapide « Comme avant », règle « grappe de différés » coupée) | 11 h 19 min 29,0 s à 11 h 25 min 34,1 s : **6 min 05,1 s** | 11 h 44 min 00,3 s à 11 h 44 min 48,9 s : **48,6 s** | 11 h 51 min 30,2 s à 11 h 56 min 12,8 s : **4 min 42,7 s** |
| Cibles / posés / différés | **83 / 78 / 5** (83 invalides au départ) | **13 / 13 / 0** (13 invalides au départ) | **74 / 70 / 4** (74 invalides au départ) |
| Étape de décision | chaîne normale 51, choix 9, passage à niveau 0, fenêtre 10, GCV2 dans le lot 8, différés 5 | chaîne normale 8, choix 2, PN 0, fenêtre 0, GCV2 3, différés 0 | chaîne normale 36, choix 9, PN 2, fenêtre 8, GCV2 15, différés 4 |
| Cycle (hors silences) médiane / p90 / max | **3,46 / 7,77 / 12,7 s** (81) ; V1 3,18 / 7,50 ; 4,40 s par cible | **3,62 / 5,38 / 6,29 s** (11) ; 3,74 s par cible | **3,44 / 6,65 / 8,77 s** (72) ; V1 3,19 / 6,31 ; 3,82 s par cible |
| Médianes par étape | chaîne 2,86 ; choix 3,93 ; fenêtre 3,78 ; GCV2 6,85 (8) ; différés 10,0 (5) | chaîne 3,05 ; choix 6,29 (2) ; GCV2 4,44 (3) | chaîne 2,82 ; choix 2,62 ; fenêtre 3,58 ; PN 5,67 (2) ; GCV2 5,38 (15) ; différés 5,48 (4) |
| Phases médianes (navigation→capture / analyse / décision / pose / validation) | 0,99 (p90 4,4) / **1,04** / 0,11 / 0,21 / 0,18 s | 1,26 / 0,40 / 0,07 / 0,17 / 0,16 s | 1,14 / **0,73** / 0,09 / 0,19 / 0,18 s |
| Arrêts, pauses, SW | 1 arrêt (fin normale, dernier cut 7774 validé sur place), 0 pause, 0 silence > 60 s, **0 redémarrage SW** | idem (dernier cut 7990) | idem (dernier cut 9980) |
| Incidents | 69 clics « hors canevas » (bilan), 0 réponse non 2xx, 0 erreur de commande sur 244 réponses ; « compteur bloqué » 1 (lot) + 12 (relecture) ; 5 captures abandonnées = les 5 différés | 11 clics, 0 non 2xx, 0 erreur sur 39 ; compteur bloqué 1 + 4 ; 0 abandon | 65 clics, 0 non 2xx, 0 erreur sur 218 ; compteur bloqué 3 + 17 ; 4 captures abandonnées = les 4 différés |
| **Preuve d'écriture** | **78 écritures 2xx de validation sur 78 lignes distinctes = les 78 posés**, 0 doublon, 0 hors cibles ; la dernière 3,78 s après l'arrêt. Liste de 11 h 26 : 5 invalides = les 5 différés ; départ de l'Écho (13 h 27 min 29 s) : 5 invalides identiques | **13 sur 13**, 0 doublon, la dernière 0,53 s après l'arrêt ; pas de liste postérieure au lot | **70 sur 70**, 0 doublon, la dernière 2,32 s après l'arrêt. Liste de 11 h 56 : 4 invalides = les 4 différés ; départ de l'Écho (14 h 05 min 43 s) : 4 invalides identiques |
| **Deuxième passe (ombre)** | **A tourné** (34,5 s de calcul, fin 34,6 s après l'arrêt) : 8 décisions (5 en passe 1, 3 en passe 2), **2 « poserait »** (7575, 7643), 3 « rien » (6390 `anomalie-non-corrigee`, 6599 `sans-approche`, 7646 `recherche-adv-contredite-rien`) | **A tourné**, 0 ms, 0 différé examiné, 0 « poserait » | **A tourné** (8,2 s) : 4 décisions, **4 « poserait »**, 0 « rien » |
| **0 écrit par la passe ?** | **Oui, vérifié** : mode ombre, `ecritureDemandee` faux, 0 événement d'écriture de passe, `ecritsPasse` = 0 (journal des fins de lot), 0 écriture de validation sur les 5 lignes entre l'arrêt et l'Écho (seule la marque « vu » de l'instant du report, pendant le lot), liste de l'Écho encore invalide | idem (rien à écrire) | **Oui, vérifié**, mêmes quatre contrôles ; les 4 lignes restent invalides au départ de l'Écho |
| Relecture « corriger » | 11 h 26 min 11,5 s à 11 h 42 min 37,6 s (986 s, **2,69 s/cut**) : **366 relus, 20 corrigés**, 361 « vu », 0 refus ; 20 écritures 2xx = exactement les 20 corrigés (14 chaîne normale, 6 choix ; 15 ADV, 4 écartement, 1 abords). Déplacement du pire rail **min 8,9 / médiane 19,8 / max 35,2 mm ; 10 > 20, 0 > 50** | 11 h 44 min 51,1 s à 11 h 50 min 07,7 s (317 s, 2,06 s/cut) : **154 relus, 24 corrigés** (21 chaîne normale, 2 choix, 1 fenêtre ; 20 écartement, 2 ADV, 2 abords), 154 « vu », 0 refus ; 24 écritures = les 24. Déplacement **12,0 / 22,1 / 31,9 mm ; 15 > 20, 0 > 50** | 11 h 56 min 23,5 s à 12 h 16 min 19,9 s (1 196 s, 2,68 s/cut) : **447 relus, 40 corrigés** (26 chaîne normale, 11 choix, 2 fenêtre, 1 PN ; 21 ADV, 16 écartement, 3 PN), 443 « vu », 0 refus ; 40 écritures = les 40. Déplacement **9,6 / 22,7 / 43,8 mm ; 22 > 20, 0 > 50** |

Le journal de chaque lot est cumulatif depuis 11 h 19 min 22 s (données précédentes vidées à la main) : tous les comptes ci-dessus sont filtrés sur le lot de la partie. Les 3 lots tournent sur une seule horloge (origine 10 h 12 min 20,8 s, `lost` = 0) ; cette origine diffère de celle des lots 15 à 17 (8 h 31 min 34,8 s) : l'horloge a donc redémarré avant le 11 h 19, hors de ces lots (ÉTABLI sur les dates, cause non recherchée). Les cuts des lots ne sont pas relus par la relecture, sauf les différés (relus sans écriture « vu » : 5 en partie 18, 4 en partie 20).

**Partie 19 contre elle-même (pas d'Écho)** : (1) étapes : 3 GCV2 sur 13 (23 %) contre 8/83 (10 %) en 18 et 15/74 (20 %) en 20 ; ces 3 poses GCV2 sont déplacées de 53,3, 43,3 et 23,0 mm du départ (mesure du journal), non relues, donc sans aucun verdict. (2) Relecture : taux de corrigés **24/154 (15,6 %)** contre 20/366 (5,5 %) en 18, 40/447 (8,9 %) en 20 et 5,8 à 8,3 % en 15–17 ; 20 des 24 sont en zones « écartement » (plages 642–648, 5846–5852, 7889–7895, 7899–7901, 7934–7935), et 23 sur 24 déplacent le rail droit du même côté (+ en latéral, 11,4 à 31,8 mm). (3) Motifs de différé : sans objet (0 différé). Aucune de ces mesures ne dit si les poses de la 19 sont justes.

## B. Jugement contre l'Écho

**Partie 18** : Écho 13 h 27 min 28 s à 13 h 49 min 49 s (22 min 21 s), 469 visites, 460 cuts, dernier export seul ; résidu de repère 0,0 mm sur 148 rails. 74 des 78 posés sont visités (non visités : 6936, 7772 à 7774).

| Étape | Posés | **Jugés** (valid. + vus) | Écart 3D méd. / p90 / max (mm) | > 20 | > 50 | Mauv. voie |
|---|---|---|---|---|---|---|
| Chaîne normale | 51 | 42 (4 + 38) | 0 / 0 / 8,4 | 0 | 0 | 0 |
| Choix | 9 | 9 (2 + 7) | 0 / 1,1 / 5,5 | 0 | 0 | 0 |
| Passage à niveau | 0 | 0 | | | | |
| Fenêtre | 10 | 9 (2 + 7) | 0 / 4,8 / 5,7 | 0 | 0 | 0 |
| GCV2 dans le lot | 8 | 6 (2 + 4) | 0 / 5,6 / 6,1 | 0 | 0 | 0 |
| **Total** | **78** | **66 (10 + 56)** | **0 / 4,2 / 8,4** | **0** | **0** | **0** |
| *Strict (validations)* | *10* | *10* | *5,3 / 7,7 / 8,4* | *0* | *0* | *0* |

- **Cuts > 50 mm : aucun.** Au-dessus de 5 mm : 6, toutes des validations de l'opérateur (7626 chaîne normale 8,4 ; 7644 chaîne normale 7,7 ; 6358 GCV2 6,1 ; 7625 fenêtre 5,7 ; 6392 choix 5,5 ; 6387 GCV2 5,1).
- **Non jugés : 12** : 4 jamais visités (6936, 7772, 7773, 7774), 8 visités 0,3 à 0,7 s sans déplacement (1, 6558, 7613, 7614, 7616, 7618, 7769, 7770). Les 56 « vus » ont une visite médiane de 1,2 s (0,8 à 24,6 s) : preuve plus faible qu'une validation (SUPPOSÉ que l'opérateur corrige un cut faux). 0 étiquette SKIP parmi les posés.
- Poses déplacées de plus de 50 mm du départ : 55 posés, 49 jugés (6 validations), écart max 7,7 mm ; déplacement médian au départ 72 mm (max 109).
- **Les 20 corrigés de la relecture** : 8 jugés (2 validations : 6359, 6361), **8 sur 8 plus proches de la pose finale**. Validés : 9,3 → 0,4 ; 10,0 → 4,6 mm. Les 6 autres jugés → 0,0 (visités sans geste : SUPPOSÉ). 12 non jugés (9 visites < 0,8 s, 3 non visités : 7775 à 7777).
- Hors brief : l'opérateur a corrigé de plus de 5 mm 17 cuts hors lot (3 > 10 mm : 7677 à 18,4, 6963 à 15,4, 6577 à 14,2) ; 7677 était relu « je laisserais » et 6963 n'était pas dans les plages relues.

**Partie 20** : Écho 14 h 05 min 34 s à 14 h 20 min 21 s (14 min 47 s), 467 visites, 450 cuts ; résidu de repère 0,0 mm sur 76 rails. **L'Écho couvre 4022–4033, 6846–6862, 8338–8410, 8496–8594, 8761–8823, 9595–9662, 9745–9859 : les 32 posés de 9876 à 9980 (20 chaîne normale, 5 fenêtre, 3 choix, 4 GCV2) ne sont jamais visités.**

| Étape | Posés | **Jugés** (valid. + vus) | Écart 3D méd. / p90 / max (mm) | > 20 | > 50 | Mauv. voie |
|---|---|---|---|---|---|---|
| Chaîne normale | 36 | 15 (1 + 14) | 0 / 0 / 7,3 | 0 | 0 | 0 |
| Choix | 9 | 6 (1 + 5) | 0 / 2,7 / 5,5 | 0 | 0 | 0 |
| Passage à niveau | 2 | 2 (0 + 2) | 0 / 0 / 0 | 0 | 0 | 0 |
| Fenêtre | 8 | 2 (0 + 2) | 0 / 0 / 0 | 0 | 0 | 0 |
| GCV2 dans le lot | 15 | 11 (5 + 6) | 0 / 12,1 / 14,0 | 0 | 0 | 0 |
| **Total** | **70** | **36 (7 + 29)** | **0 / 5,6 / 14,0** | **0** | **0** | **0** |
| *Strict (validations)* | *7* | *7* | *5,8 / 12,8 / 14,0* | *0* | *0* | *0* |

- **Cuts > 50 mm : aucun.** Au-dessus de 10 mm : 2, **les deux « GCV2 dans le lot », validés par l'opérateur** : 9626 à 14,0 mm (latéral 13,8 ; étiquette Écho « validé sans mouvement » alors que la pose finale diffère de 13,8 mm de celle d'Ariane : écart d'étiquetage non élucidé) et 8792 à 12,1 mm. Entre 5 et 10 mm : 4 (8791 chaîne normale 7,3 ; 9807 GCV2 5,8 ; 8793 choix 5,5 ; 9808 GCV2 5,1).
- **Non jugés : 34 sur 70** : **32 jamais visités** (voir ci-dessus), 2 visités 0,7 à 0,8 s (4027, 6856). Les 29 « vus » : visite médiane 1,2 s (0,8 à 16,1 s) ; 2 portent l'étiquette SKIP (8534, 8535) ; sans eux 34 jugés, même maximum.
- Poses déplacées de plus de 50 mm du départ : 39 posés, 22 jugés (7 validations), écart max 14,0 mm.
- **Les 40 corrigés de la relecture** : 17 jugés (1 validation : 6858, 21,4 → 6,6 mm), **17 sur 17 plus proches** ; les 16 autres jugés → 0,0 (SUPPOSÉ). 23 non jugés (17 jamais visités, 6 visites < 0,8 s).
- Hors brief : 13 cuts hors lot corrigés de plus de 5 mm par l'opérateur, dont 4 > 10 mm et 1 > 20 mm (8379, 27,4 mm ; relu « je corrigerais » à 29,4 mm, sans écriture).

**Budget D-223 (mauvaise voie ≤ 1 %, pose > 50 mm ≤ 3 %)** — 0 erreur : partie 18 sur 66 jugés, borne haute de Wilson **5,5 %** (validations seules 0/10 : 27,8 %) ; partie 20 sur 36, **9,6 %** (0/7 : 35,4 %) ; 18 + 20 sur 102, **3,6 %** (0/17 : 18,4 %). Aucune des deux parties ne permet de conclure seule ; ensemble elles ne passent pas sous 3 %.

## C. Les 9 différés des parties 18 et 20 et la garde A

Garde A (module du worktree) : pose refusée si déplacement du pire rail < 100 mm **et** aucun appui normal (chaîne normale, choix, fenêtre ; pas les poses GCV2 ni de la passe) à ≤ 4 cuts. « Écart » = pose de la passe contre la pose finale de l'opérateur, pire rail 3D.

| Cut | Motif de différé (écartement de départ) | Départ → opérateur (pire rail) | Passe en ombre | Déplacement D | Appui normal le plus proche | Garde A | Écart « poserait » / opérateur | Verdict |
|---|---|---|---|---|---|---|---|---|
| 18 / 6390 | ambiguïté, flanc insuffisant | 78,1 mm | rien (`anomalie-non-corrigee`) | 44,1 (moteur) | 1 cut (choix) | sans objet | | rien |
| 18 / 6599 | écartement hors contrat (1 323,5) | 48,1 | rien (`sans-approche`) | 49,8 (moteur) | 24 cuts | sans objet (D < 100 et appui à 24 cuts : aurait bloqué une pose) | | rien |
| 18 / **7575** | écartement hors contrat (1 474,0) | 70,7 | **poserait** | 76,0 | 1 cut (chaîne normale) | laisse passer | **21,0 mm** (G 5,3 ; D 21,0) | **fausse** (> 20 ; gain 49,7 mm sur le départ) |
| 18 / **7643** | candidat gauche, ambiguïté droite | 80,3 | **poserait** | 79,0 | 1 cut | laisse passer | **4,7 mm** | **juste** (gain 75,6) |
| 18 / 7646 | écartement hors contrat (1 360,6) | 94,0 | rien (`recherche-adv-contredite-rien`) | 51,9 (moteur) | 1 cut | sans objet | | rien |
| 20 / **9627** | écartement hors contrat (1 490,8) | 58,0 | **poserait** (rail gauche inchangé) | 52,1 | 1 cut | laisse passer | **9,1 mm** | juste à 10 mm, fausse à 5 mm (gain 48,9) |
| 20 / **9802** | ambiguïté, pente hors domaine | 93,8 | **poserait** | 96,4 | **25 cuts** | **BLOQUE** | **3,6 mm** | **juste, perdue par la garde** (gain 90,2) |
| 20 / **9803** | écartement hors contrat (1 358,1) | 100,5 | **poserait** | 104,0 | 26 cuts | laisse passer (D ≥ 100) | **4,2 mm** | **juste** (gain 96,3) |
| 20 / **9831** | écartement hors contrat (1 293,3) | 127,7 | **poserait** | 128,6 | 2 cuts | laisse passer | **2,4 mm** | **juste** (gain 125,3) |

Pour la partie 19 : aucun différé, rien à dire de plus. ÉTABLI sur ces cuts, avec une réserve : la pose finale de l'opérateur est la dernière validation observée, et 5 de ces 9 cuts portent l'étiquette « intentions multiples ou ambiguës » ou deux visites.

- **Vrais et faux positifs de la passe (parties 18 et 20 : 6 « poserait »)**, « juste » = à 10 mm ou moins de l'opérateur : **sans garde 5 vrais positifs (4,7 ; 9,1 ; 3,6 ; 4,2 ; 2,4 mm) et 1 faux (21,0 mm)** ; **avec la garde A 4 vrais et 1 faux** : une bonne pose perdue (9802), **aucune fausse évitée**. Au seuil de 5 mm : sans garde 4 justes (4,7 ; 3,6 ; 4,2 ; 2,4) et 2 fausses (21,0 ; 9,1), avec garde 3 justes et 2 fausses. En y ajoutant la partie 17 (5183 : fausse à 17,7 mm, la garde ne la bloquait pas) : 7 « poserait », 5 justes et 2 fausses sans garde, 4 justes et 2 fausses avec.
- Aucun « poserait » > 50 mm ni mauvaise voie. Les 6 sont plus proches de l'opérateur que la pose de départ (gains 48,9 à 125,3 mm). Les 3 « rien » (partie 18) laissent des cuts que l'opérateur a déplacés de 48 à 94 mm : la passe n'y a rien apporté ni rien abîmé.
- **Ce que la garde ne teste pas** : elle vise des poses fausses proches du départ et loin de tout appui normal (partie 0 du 23/10 : 5 poses à 150–266 mm). Parmi les 6, la seule pose sans appui normal proche est 9802, **juste** ; aucune pose fausse ne remplit les deux conditions (la fausse 7575 a un appui à 1 cut). Seuil D = 100 mm : 9802 (D = 96,4) est bloquée, 9803 (D = 104,0, cut voisin, même écart d'erreur) passe : la frontière coupe entre deux bonnes poses. Les voisins GCV2 de 9802 (9804 à 9809) sont jugés à 0,0 mm (9804 à 9806, 9809) ou 5,1 à 5,8 mm (9807, 9808) : les poses GCV2 voisines ne sont pas fausses ici.
- Motifs : 6 des 9 différés sont des **écartements de paire hors contrat** (1 293 à 1 491 mm de la pose de départ), 3 sont des ambiguïtés ou des pentes ; 4 des 6 écartements donnent un « poserait » (7575, 9627, 9803, 9831), ainsi que 2 des 3 autres (7643, 9802).

## D. Synthèse sur les six lots

| | 15 | 16 | 17 | 18 | 19 | 20 | **Total** |
|---|---|---|---|---|---|---|---|
| Cibles / posés / différés | 46 / 45 / 1 | 108 / 108 / 0 | 43 / 41 / 2 | 83 / 78 / 5 | 13 / 13 / 0 | 74 / 70 / 4 | **367 / 355 / 12** |
| Relus / corrigés | 133 / 11 | 275 / 16 | 159 / 11 | 366 / 20 | 154 / 24 | 447 / 40 | 1 534 / 122 |
| Passe : « poserait » / écrits | 0 / 0 | 0 / 0 | 1 / 0 | 2 / 0 | 0 / 0 | 4 / 0 | **7 / 0** |
| **Jugés** (valid. + vus) | 31 (3 + 28) | 99 (14 + 85) | 36 (7 + 29) | 66 (10 + 56) | sans Écho | 36 (7 + 29) | **268 (41 + 227)** |
| Non jugés | 14 | 9 | 5 | 12 | | 34 | 74 |
| Écart méd. / p90 / max (mm) | 0 / 0 / 8,2 | 0 / 2,8 / 10,3 | 0 / 3,9 / 6,8 | 0 / 4,2 / 8,4 | | 0 / 5,6 / 14,0 | **0 / 3,6 / 14,0** |
| > 20 / > 50 / mauvaise voie | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | | 0 / 0 / 0 | **0 / 0 / 0** |
| Wilson haut, jugés (règle) | 11,0 % | 3,7 % | 9,6 % | 5,5 % | | 9,6 % | **1,4 %** |
| Wilson haut, validations seules | 56 % | 21,5 % | 35,4 % | 27,8 % | | 35,4 % | **8,6 % (0/41)** |

Par étape sur les cinq lots jugés (posés / jugés / max) : chaîne normale 193 / 146 / 10,3 ; choix 72 / 62 / 8,2 ; passage à niveau 16 / 14 / 6,8 ; fenêtre 33 / 24 / 5,7 ; **GCV2 dans le lot 28 / 22 (7 validations) / 14,0**. Les 3 cuts à plus de 10 mm (2593 chaîne normale 10,3 ; 8792 et 9626 GCV2) sont tous des validations. Les 7 validations GCV2 ont un écart de 0,0 à 14,0 mm (médiane 5,8). Corrigés de la relecture : 98 corrigés dans les lots jugés (15, 16, 17, 18, 20), 55 jugés (9 validations), **55 sur 55 plus proches** de la pose finale ; sur les 9 validations la pose corrigée reste à 0,4 à 9,8 mm de l'opérateur.

**Budget D-223.** Pose > 50 mm : 0 sur 268 jugés, borne haute 1,4 % (< 3 %) mais **86 % des jugés sont des « vus sans geste »** (SUPPOSÉ bons) ; sur les 41 validations seules la borne est 8,6 % : **non concluant**. Mauvaise voie ≤ 1 % : la borne de 1,4 % dépasse 1 % ; il faut 363 jugés sans erreur (268 aujourd'hui) et plus encore en validations ; **non démontrée**. Pour les 7 « poserait » de la passe (parties 17, 18, 20), 0 > 50 mm, borne haute 35 % : effectif trop petit pour une conclusion.

## Connexion au démarrage (ce que le journal montre)

Le journal ne garde qu'un seul état de connexion : « prêt », même onglet aux exports de 11 h 43 min 10,1 s et de 12 h 21 min 29,1 s ; ni historique d'états, ni heure « hors ligne », ni durée d'attente. Il n'y a aucun événement de choix d'onglet ni d'attente. Les faits ci-dessous sont ceux du journal, **sans cause avancée**. L'export Écho ne contient aucun événement de connexion.

| Heure | Partie 18 | Partie 19 | Partie 20 |
|---|---|---|---|
| Avant le lot | données vidées à la main à 11 h 19 min 22,8 s ; **aucun événement de connexion** ; premier événement = départ du lot à 11 h 19 min 29,0 s (6,2 s après) | **reconnexion automatique, résultat « équipé », 1 essai, 25 ms, à 11 h 43 min 46,5 s** ; 3 ms plus tard : contrat de l'interface ESV vu (sans bouton, rails absents, empreinte identique, pas de changement) | **reconnexion automatique « équipé », 1 essai, 38 ms, à 11 h 50 min 47,2 s** ; 4 ms plus tard : même contrat |
| Page | une page (cut 18), un observateur, du départ à 11 h 43 min 47 s | nouvelle page à 11 h 43 min 55,1 s (cut 0 de la partie 0), **8,6 s après l'équipement** ; départ du lot 5,2 s plus tard | nouvelle page à 11 h 50 min 56,1 s (partie 0, cut 0), **8,9 s après l'équipement** ; cuts 1 et 2 de la partie 20 à 11 h 51 min 25–26 s ; départ du lot à 11 h 51 min 30,2 s |
| Équipement → départ du lot | sans objet | **13,8 s** | **43,0 s** |
| Contrats suivants | | aucun autre événement de contrat | aucun autre événement de contrat |

Les trois pages ont des identifiants de page, de repère et d'observateur différents ; les trois observateurs partagent la même origine d'horloge, donc le journal ne date pas les chargements de page par cette voie (la date d'une page se lit à son premier événement). Transitions du coordinateur : la liste est tronquée au lot courant (64 entrées) ; elle contient le « démarrage » de la partie 19 (11 h 44 min 00,302 s, 3 ms avant le départ) et aucune transition « erreur » ; elle ne remonte pas jusqu'au démarrage des parties 18 et 20. ÉTABLI : deux équipements automatiques enregistrés, chacun suivi d'une nouvelle page 8,6 à 8,9 s plus tard ; non mesurable : le choix d'onglet, les clics de l'opérateur et le statut hors ligne.

## Limites

- Un seul opérateur, un poste. **227 des 268 jugés sont des « vus sans geste »** (visite médiane 1,2 s) : la preuve forte est celle des 41 validations. Partie 20 : 46 % des posés ne sont pas observés (Écho arrêté à 9859) ; partie 19 : aucune vérité.
- Pas de liste d'ESV postérieure aux corrections de l'opérateur : la pose finale vient de l'Écho seul. Pour la partie 18 comme pour la 20, la liste d'avant correction est celle lue juste après le lot, avant la relecture.
- Sur les différés, la vérité est la dernière validation de l'opérateur ; 5 des 9 ont l'étiquette « intentions multiples » ou plusieurs visites : écarts à 3 à 21 mm à lire avec cette réserve. Neuf différés ne suffisent pas à juger la garde A.
- Le ralentissement des lots 18 et 20 (cycle médian +55 %, analyse ×1,4 à ×2) est mesuré, pas expliqué.
- Extractions, archive du tronc et liens de travail supprimés ; scripts et résultats dans `$S/p182019/scripts` et `$S/p182019/res`.
