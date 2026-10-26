# Lots et Échos des parties 16 et 17 (Ariane 4.9.5.21, test 21), 26/10/2026

Lecture seule, rien rejoué, rien commité. Heures de Paris (UTC+1). Niveaux : ÉTABLI (mesuré), PROBABLE, SUPPOSÉ. Outils du tronc : `jointure-echo-orbite` (strict, et règle « vu sans geste ≥ 0,8 s »), `perf-lot`, `tableau-bord` et `controle-passe` (recoupement : mêmes chiffres), `lire-volumes` ; `juger` non utilisé (rejeux du banc), `decisions-numeros` sans objet. « Mauvaise voie » = écart latéral > 100 mm sur un rail (définition de `juger`) ; aucune pose n'est même à plus de 50 mm, donc le compte est 0 sous toute définition.

## À retenir

- **Partie 16** : 108 cibles, **108 posés, 0 différé**, 5 min 02,7 s, 108 écritures 2xx. Écho : les 108 sont visités ; **99 réellement jugés (14 validations de l'opérateur + 85 vus sans geste ≥ 0,8 s)**, 9 non jugés (visite < 0,8 s). Écart du pire rail : médiane 0, p90 2,8, max 10,3 mm ; **0 > 20 mm, 0 > 50 mm, 0 mauvaise voie**.
- **Partie 17** : 43 cibles, **41 posés + 2 différés**, 2 min 15,5 s, 41 écritures 2xx. Écho : 41 posés visités, **36 jugés (7 validations + 29 vus)**, 5 non jugés. Max 6,8 mm ; **0 / 0 / 0**.
- **Deuxième passe (ombre)** : a tourné dans les deux lots ; partie 16 : rien à examiner ; partie 17 : 2 différés, **1 « poserait » (cut 5183), 1 « rien » (cut 5962)**. **0 cut écrit par la passe** (vérifié par quatre voies, voir A). Le « poserait » aurait été à **17,7 mm** de la pose finale de l'opérateur (la pose de départ en était à 61,7 mm) ; la garde A ne l'aurait pas bloqué.
- **Trois lots (15, 16, 17)** : 197 cibles, 194 posés ; **166 jugés dont 24 validations seulement**, max 10,3 mm, 0 > 20, 0 > 50, 0 mauvaise voie. Borne haute de Wilson 2,3 % (règle) / 13,8 % (validations seules). Budget D-223 : voir plus bas.

## Partie 16

### A. Le lot

| | Partie 16 |
|---|---|
| Bornes | 9 h 05 min 05,7 s à 9 h 10 min 08,4 s : **5 min 02,7 s**. Mode rapide « Comme avant », règle « grappe de différés » coupée. Fin normale (dernier cut à valider, 9203, validé sur place ; ESV reste sur ce cut). |
| Cibles / posés / différés | **108 / 108 / 0** (108 invalides au départ, 0 à l'Écho) |
| Étape de décision | chaîne normale **66**, choix **28**, passage à niveau **6**, fenêtre **6**, GCV2 dans le lot **2**, différés **0** |
| Temps par cut | cycle (106 cycles, hors silences) **médiane 2,06 s, p90 5,48 s**, max 9,9 s ; cycle V1 1,91 s / 5,29 s ; 2,80 s par cible. Médianes par étape : chaîne normale 1,89 s, choix 2,25 s, fenêtre 2,13 s, passage à niveau 5,0 s (6), GCV2 8,5 s (2) : les longs cycles sont les entrées de zone. Phases médianes : navigation → capture 0,84 s (p90 4,4), analyse 0,51 s, décision 0,06 s, pose 0,14 s, validation 0,14 s. Première capture 0,78 s après le départ. |
| Arrêts, pauses, SW | 1 arrêt (fin normale), 0 pause, 0 reprise, 0 silence > 60 s. **0 redémarrage du service worker** : une seule horloge (origine 8 h 31 min 34,8 s, commune aux lots 15, 16, 17), 0 événement perdu. |
| Incidents | 97 clics « hors canevas » (bilan ; les 5 exemples : côté gauche, chemin direct, cuts 1 et 863 à 866, les 5 premiers cuts du lot), 0 erreur sur 324 réponses de commande du lot ; « compteur bloqué » diagnostique 1 (lot) + 4 (relecture) ; 1 réponse 502 sur une **lecture de liste** (9 h 09 min 55,5 s), pas sur une écriture ; 0 écriture refusée. |
| Preuve d'écriture | **108 écritures de validation 2xx sur 108 lignes distinctes = les 108 posés**, 0 doublon, 0 hors cibles ; la dernière 0,52 s après l'arrêt. La liste d'ESV de 10 h 47 (départ de l'Écho) : 0 invalide. `serverConfirmed` non lu. ÉTABLI |
| Deuxième passe | **A tourné** (`passe-differes-ombre-fin` à 9 h 10 min 08,41 s, 56 ms après l'arrêt), mode ombre, `ecritureDemandee` faux, 0 différé examiné, 0 « poserait », 0 événement d'écriture de passe, `ecritsPasse` = 0. **0 cut écrit par la passe.** Rien à juger. |
| Relecture | « corriger », 9 h 10 min 09,1 s à 9 h 18 min 05,7 s (477 s, 1,74 s par cut) : **275 relus, 16 corrigés**, 275 « vus », 0 refus ; aucun cut du lot relu. 16 écritures de validation 2xx = exactement les 16 corrigés (862, 2600, 4607, 4615, 6476, 6481, 6487, 8117, 8360 à 8363, 8841, 8842, 9197, 9204 ; étages calculés : 8 chaîne normale, 4 choix, 2 passage à niveau, 2 fenêtre). **Déplacement (pire rail, 3D) : min 11,3 / médiane 26,6 / max 35,8 mm ; 12 sur 16 au-dessus de 20 mm, 0 au-dessus de 50.** Les 16 sont les seuls cuts qui changent entre la liste d'ESV de 9 h 10 et celle de 10 h 47. |

### B. Jugement contre l'Écho

Écho : 10 h 47 min 47 s à 11 h 02 min 55 s (15 min 07 s), 392 visites (indices 0 à 391 contigus), 384 cuts, 8 retours, 0 interruption ; dernier export seul. Les 108 cuts du lot sont tous visités (4 deux fois). Première visite = pose d'Ariane (résidu de repère 0,0 mm sur 216 rails). Vérité : pose finale de l'opérateur (dernière validation) ; règle : cut visité ≥ 0,8 s sans que aucun rail bouge de 0,5 mm = bon.

| Étape | Posés | **Jugés** (valid. + vus) | Écart 3D méd. / p90 / max (mm) | > 20 | > 50 | Mauv. voie |
|---|---|---|---|---|---|---|
| Chaîne normale | 66 | 59 (5 + 54) | 0 / 0 / 10,3 | 0 | 0 | 0 |
| Choix | 28 | 27 (5 + 22) | 0 / 2,4 / 4,3 | 0 | 0 | 0 |
| Passage à niveau | 6 | 5 (3 + 2) | 3,3 / 4,6 / 5,3 | 0 | 0 | 0 |
| Fenêtre | 6 | 6 (1 + 5) | 0 / 1,4 / 2,8 | 0 | 0 | 0 |
| GCV2 dans le lot | 2 | 2 (0 + 2) | 0 / 0 / 0 | 0 | 0 | 0 |
| **Total** | **108** | **99 (14 + 85)** | **0 / 2,8 / 10,3** | **0** | **0** | **0** |
| *Strict (validations)* | *14* | *14* | *3,5 / 7,4 / 10,3* | *0* | *0* | *0* |

- **Cuts à plus de 50 mm : aucun.** Au-dessus de 5 mm : 3 (2593 chaîne normale 10,3 ; 2590 chaîne normale 8,4 ; 3417 passage à niveau 5,3), toutes des corrections de l'opérateur.
- **Non jugés : 9 sur 108**, tous visités une fois, aucun déplacé, 0,7 à 0,8 s : 4608, 4610 à 4612, 7750, 7754, 7755, 7758, 7760 (chaîne normale 7, choix 1, passage à niveau 1). **Aucun cut non visité.**
- Les 85 « vus » ont une visite médiane de 1,2 s (0,8 à 39,4 s) : preuve plus faible qu'une validation (SUPPOSÉ que l'opérateur aurait corrigé un cut faux). **3 des 85 portent l'étiquette SKIP** (8339, 8817, 8822 : décision explicite de passer) ; sans eux : 96 jugés, même maximum.
- Poses d'Ariane déplacées de plus de 50 mm du départ : 26 posés, 24 jugés (0 validation), écart maximal 0,0 mm.
- **Les 16 corrigés par la relecture** : 12 jugés (3 validations : 862, 6476, 9197), **12 sur 12 plus proches de la pose finale que la pose d'origine**. Validés : 16,7 → 2,8 ; 25,3 → 4,8 ; 32,1 → 9,8 mm. Les 9 autres jugés : → 0,0 (visités sans geste, 0,8 à 1,7 s : SUPPOSÉ). 4 non jugés (visites 0,4 à 0,8 s : 4607, 4615, 8841, 8842).
- Hors brief : règle en ombre « PN chaque cut » aurait différé 64 des 108 posés (56 jugés, max 10,3 mm). L'opérateur a corrigé de plus de 5 mm 7 cuts hors lot, tous relus par Ariane (5,0 à 13,8 mm) ; 8 relus notés « je corrigerais » sans écriture : 3 corrigés par l'opérateur (5,4 à 6,8 mm), 4 laissés, 1 sans verdict.

## Partie 17

### A. Le lot

| | Partie 17 |
|---|---|
| Bornes | 9 h 22 min 04,9 s à 9 h 24 min 20,3 s : **2 min 15,5 s**. Même mode. Fin normale (dernier cut 8118 validé sur place). |
| Cibles / posés / différés | **43 / 41 / 2** (les 43 = les 43 invalides de la liste de 9 h 22 ; différés 5183 et 5962, captures abandonnées voulues) |
| Étape de décision | chaîne normale **14**, choix **14**, passage à niveau **4**, fenêtre **6**, GCV2 dans le lot **3** (5180, 5960, 5961), différés **2** |
| Temps par cut | cycle (41) **médiane 2,25 s, p90 6,46 s**, max 7,4 s ; V1 2,12 s / 6,37 s ; 3,15 s par cible. Médianes par étape : chaîne normale 2,07 s, choix 2,24 s, fenêtre 1,98 s, passage à niveau 6,4 s (4), GCV2 6,9 s (3), différés 4,0 s (2). Phases : navigation → capture 1,04 s (p90 4,8), analyse 0,51 s, décision 0,38 s. Première capture 0,68 s après le départ. |
| Arrêts, pauses, SW | 1 arrêt (fin normale), 0 pause, 0 reprise, 0 silence > 60 s. **0 redémarrage SW** (même horloge). |
| Incidents | 37 clics « hors canevas » (les 5 exemples : côté gauche, chemin direct, cuts 1, 299, 300, 302, 303), 0 erreur sur 127 réponses de commande ; « compteur bloqué » 4 (lot) + 8 (relecture) ; 1 réponse 502 sur une lecture de liste (9 h 23 min 03,2 s, relue en 200 une milliseconde plus tard) ; 0 écriture refusée ; 2 captures abandonnées = les 2 différés ; relecture : 2 refus de commande sur les 2 différés. |
| Preuve d'écriture | **41 écritures 2xx sur 41 lignes distinctes = les 41 posés**, 0 doublon ; **0 écriture sur les lignes 5183 et 5962** ; la dernière (8118) est observée 3,78 s après l'arrêt, à l'instant où la passe se termine (9 h 24 min 24,116 s contre 24,115 s). Liste de 11 h 07 : exactement 2 invalides, 5183 et 5962. ÉTABLI |
| Deuxième passe | **A tourné** : 3 événements (5183 passe 1, 5962 passes 1 et 2), 3,76 s de calcul, mode ombre, `ecritureDemandee` faux. **1 « poserait » (5183), 2 « rien » (5962, motif `recherche-adv-contredite-rien`).** 0 événement d'écriture de passe, `ecritsPasse` = 0, aucune écriture sur les 2 lignes, 2 invalides à l'Écho : **0 cut écrit par la passe.** `controle-passe` : 1 « poserait », 0 écrit, contrôle non fait (0 cut disponible sur 60). |
| Relecture | 9 h 24 min 24,7 s à 9 h 29 min 16,2 s (296 s, 1,86 s par cut) : **159 relus, 11 corrigés** (298, 305, 5204, 5205, 5207, 5984 à 5987, 8111, 8119 ; tous étage calculé « chaîne normale », 7 ADV, 4 PN), 157 « vus ». 11 écritures 2xx = ces 11 lignes. **Déplacement : min 10,2 / médiane 25,8 / max 38,1 mm ; 7 sur 11 > 20 mm, 0 > 50.** |

### B. Jugement contre l'Écho

Écho : 11 h 07 min 21 s à 11 h 17 min 06 s (9 min 45 s), 203 visites (contiguës), 200 cuts, 2 segments, 0 interruption. Les 43 cuts du lot sont tous visités. Résidu de repère 0,0 mm (82 rails).

| Étape | Posés | **Jugés** (valid. + vus) | Écart 3D méd. / p90 / max (mm) | > 20 | > 50 | Mauv. voie |
|---|---|---|---|---|---|---|
| Chaîne normale | 14 | 12 (1 + 11) | 0 / 0 / 3,5 | 0 | 0 | 0 |
| Choix | 14 | 11 (2 + 9) | 0 / 2,3 / 3,0 | 0 | 0 | 0 |
| Passage à niveau | 4 | 4 (3 + 1) | 5,0 / 6,5 / 6,8 | 0 | 0 | 0 |
| Fenêtre | 6 | 6 (1 + 5) | 0 / 2,6 / 5,3 | 0 | 0 | 0 |
| GCV2 dans le lot | 3 | 3 (0 + 3) | 0 / 0 / 0 | 0 | 0 | 0 |
| **Total** | **41** | **36 (7 + 29)** | **0 / 3,9 / 6,8** | **0** | **0** | **0** |
| *Strict (validations)* | *7* | *7* | *4,3 / 6,2 / 6,8* | *0* | *0* | *0* |

- **Cuts à plus de 50 mm parmi les poses d'Ariane : aucun.** Au-dessus de 5 mm : 3 (3997 passage à niveau 6,8 ; 7376 passage à niveau 5,7 ; 5184 fenêtre 5,3), corrections de l'opérateur.
- **Non jugés : 5 sur 41**, visités une fois, 0,4 à 0,6 s, non déplacés : 1, 4001 à 4003, 5983. Aucun non visité.
- Les 3 poses « GCV2 dans le lot » (déplacées de 46 à 59 mm du départ) sont vues sans geste (1,2 à 1,9 s, 0,0 mm) : 3 jugés, aucune validation.
- **Les 11 corrigés par la relecture** : 7 jugés (2 validations : 298, 5207), **7 sur 7 plus proches**. Validés : 26,9 → 2,8 mm ; **8,1 → 6,4 mm (5207 : un déplacement de 10,3 mm pour 1,7 mm de gain)**. Les 5 autres jugés → 0,0 (SUPPOSÉ). 4 non jugés (5984 à 5987, visites 0,4 à 0,6 s).
- Hors brief : règle en ombre « PN chaque cut » aurait différé 24 des 41 posés (21 jugés, max 5,7 mm). L'opérateur a corrigé de plus de 5 mm 10 cuts hors lot, tous relus (5,3 à 10,0 mm) ; 6 relus notés « je corrigerais » sans écriture : 4 corrigés par l'opérateur (4,8 à 10,0 mm), 2 laissés.

### C. Les 2 différés de la partie 17 et la deuxième passe

| | **5183** (ADV) | **5962** (ADV) |
|---|---|---|
| Motif de différé | rail gauche non résolu (pente hors domaine) | rail gauche ambigu (placements concurrents) |
| Départ → pose finale de l'opérateur (pire rail) | **61,7 mm** (gauche : −33,7 latéral, −10,5 vertical ; droit : −52,6 ; −32,3) | **49,6 mm** (gauche : −49,5 ; +3,8 ; droit : +19,9 ; −3,7) |
| Passe en ombre | **« poserait »** (hypothèse H0+H3, p 0,72 pour un seuil 0,49, recherche ADV encadrée) | **« rien »** aux deux passes (motif `recherche-adv-contredite-rien`) |
| Déplacement D au départ | **63,2 mm** (gauche 20,3 ; droit 63,2) | 48,5 mm (pas de pose) |
| Plus proche appui normal (pose du lot en chaîne normale, choix ou fenêtre) | **1 cut** (5182 chaîne normale, 5184 fenêtre) | 1 cut (5963) |
| Garde A (D < 100 mm **et** aucun appui normal à ≤ 4 cuts → « rien ») | **n'aurait pas bloqué** (D < 100 mais appui à 1 cut) : la pose serait passée | sans objet (pas de pose) |
| « Poserait » contre l'opérateur | gauche −20,3 ; +1,0 contre −33,7 ; −10,5 : **17,7 mm** ; droit **2,4 mm** ; pire rail **17,7 mm**, latéral max 13,4 : **ni > 20 ni > 50 mm, pas la mauvaise voie** ; plus de 10 mm, donc « fausse » au sens du juge à 10 mm ; **44 mm plus proche** que la pose de départ | aucune pose |

ÉTABLI sur ces deux cuts. Ce que l'échantillon dit pour la garde A : **un seul « poserait » sur 151 cibles, correct à 17,7 mm, passant la garde**. Il ne contient aucune pose fausse proche du départ et sans appui (le cas visé par la garde, partie 0 du 23/10 : 5 poses à 150–266 mm), donc il ne la teste ni ne l'infirme ; il ne montre pas non plus de bonne pose qu'elle bloquerait (0). Avec la partie 15 (cut 4655 : « rien », motif sans voie, opérateur à 34,3 mm), 3 différés sur 197 cibles, 1 « poserait ». Pour mémoire (non retenue par la décision, SUPPOSÉ sans portée) : la paire du moteur de 5962 était à 1,6 mm (gauche) et 8,9 mm (droit) de l'opérateur ; celle de 5183 à 35,3 / 0,7 mm.

## Total parties 16 + 17 et synthèse sur trois lots

| | 15 | 16 | 17 | **16 + 17** | **15 + 16 + 17** |
|---|---|---|---|---|---|
| Cibles / posés / différés | 46 / 45 / 1 | 108 / 108 / 0 | 43 / 41 / 2 | **151 / 149 / 2** | **197 / 194 / 3** |
| Durée du lot | 2 min 07,6 s | 5 min 02,7 s | 2 min 15,5 s | 7 min 18,2 s | 9 min 25,8 s |
| Cycle médian / p90 (s) | 2,20 / 6,06 | 2,06 / 5,48 | 2,25 / 6,46 | | |
| Relus / corrigés (déplacement médian) | 133 / 11 (34,4) | 275 / 16 (26,6) | 159 / 11 (25,8) | 434 / 27 | 567 / 38 |
| Écritures 2xx / posés | 45 / 45 | 108 / 108 | 41 / 41 | 149 / 149 | 194 / 194 |
| Passe en ombre : « poserait » / écrits | 0 / 0 | 0 / 0 | 1 / 0 | 1 / 0 | 1 / 0 |
| **Jugés** (validations + vus) | 31 (3 + 28) | 99 (14 + 85) | 36 (7 + 29) | **135 (21 + 114)** | **166 (24 + 142)** |
| Non jugés (visite < 0,8 s) | 14 | 9 | 5 | 14 | 28 |
| Écart 3D méd. / p90 / max (mm) | 0 / 0 / 8,2 | 0 / 2,8 / 10,3 | 0 / 3,9 / 6,8 | 0 / 2,9 / 10,3 | 0 / 2,9 / 10,3 |
| > 20 mm / > 50 mm / mauvaise voie | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | **0 / 0 / 0** |
| Wilson 95 % haut, jugés (règle) | 11,0 % | 3,7 % | 9,6 % | 2,8 % | **2,3 %** |
| Wilson 95 % haut, validations seules | 56 % (0/3) | 21,5 % (0/14) | 35,4 % (0/7) | 15,5 % (0/21) | **13,8 % (0/24)** |
| Poses déplacées de > 50 mm : posés / jugés (écart max) | 6 / 6 (3,5) | 26 / 24 (0,0) | 10 / 9 (5,3) | 36 / 33 | 42 / 39 |

Par étape sur 15 + 16 + 17 (posés / jugés / max) : chaîne normale 106 / 89 / 10,3 ; choix 54 / 47 / 8,2 ; passage à niveau 14 / 12 / 6,8 ; fenêtre 15 / 13 / 5,3 ; GCV2 dans le lot 5 / 5 / 0,0 (aucune validation) ; 0 > 20 mm partout. L'opérateur a corrigé 24 des 194 poses (12 %) et **jamais de plus de 10,3 mm** (médiane 3,9 mm).

**Corrigés de la relecture, trois lots** : 38 corrigés, 30 jugés (6 validations), **30 sur 30 plus proches de la pose finale**. Les 6 validations : origine → opérateur 8,1 à 34,4 mm, corrigée → opérateur 2,8 à 9,8 mm (médiane 5,6).

**Budget D-223 (mauvaise voie ≤ 1 %, pose > 50 mm ≤ 3 %).** 0 sur 135 (16 + 17) et 0 sur 166 (trois lots) : borne haute de Wilson 2,8 % et 2,3 %, donc sous 3 % **si** l'on tient pour bons les « vus sans geste ≥ 0,8 s » (86 % des jugés, SUPPOSÉ). Sur les seules validations (24), la borne est 13,8 % : **non concluant**. Il faut 125 jugés sans erreur pour borner à 3 %, **381 pour 1 % : la mauvaise voie n'est pas démontrable** (166 aujourd'hui). La partie 16 seule (99 jugés) ne suffit pas (3,7 %), la 17 non plus (9,6 %). Ne pas généraliser : trois parties, un opérateur, un poste.

## Connexion au démarrage (ce que le journal montre)

Le journal ne garde que le dernier statut de connexion : « prêt », même onglet (identifiant …688) aux deux exports (9 h 18 min 53,9 s et 9 h 30 min 05,9 s) ; ni historique d'états, ni heure « hors ligne », ni durée d'attente. Les événements ci-dessous sont des faits du journal ; **aucune cause n'est avancée**. L'export Écho ne contient aucun événement de connexion.

| Heure | Partie 16 | Partie 17 |
|---|---|---|
| Origine de l'horloge de la page ESV (déduite de 1 138 et 567 événements, dispersion 0,6 s et 1,6 s ; « page chargée » PROBABLE) | 8 h 59 min 53,6 s | 9 h 21 min 42,0 s (nouvelle page : identifiant de page et observateur différents de ceux de la partie 16) |
| Données précédentes vidées à la main | 9 h 00 min 41 s | 9 h 21 min 37,1 s |
| Premier événement du journal | 9 h 00 min 55,5 s : sélecteur de parties lu (partie 16 courante, 22 parties) ; contrat de l'interface ESV changé 38 ms plus tard (avis) ; relectures du contrat sans changement à 9 h 01 min 39 s, 02 min 29 s, 03 min 34 s, 04 min 52 s | 9 h 21 min 42,7 s : **reconnexion automatique, résultat « équipé », 1 essai, 40 ms** ; 2 ms plus tard : sélecteur « absent » (0 partie) et contrat vu sans boutons |
| Suite | rien avant le départ | 9 h 21 min 43,9 s : cible de la partie 16 (cut 9209) vers (partie 0, cut 0) de la nouvelle page ; **9 h 21 min 49,7 s** : contrat de nouveau complet (7,0 s après l'équipement) ; 9 h 21 min 51,9 s : cut 0 vers partie 17 cut 1 ; 9 h 21 min 54,5 s : sélecteur lu (partie 17) ; 9 h 21 min 58,9 s et 59,9 s : cut 1 vers 0 vers 1 |
| Transitions du coordinateur | aucune « erreur » | **9 h 22 min 00,677 s « démarrage », 9 h 22 min 00,681 s « erreur » (4 ms plus tard)** ; message non conservé dans l'export (notice écrasée par la fin de lot) ; **9 h 22 min 04,859 s « démarrage »** (4,18 s après l'erreur) |
| Départ du lot | 9 h 05 min 05,654 s | 9 h 22 min 04,861 s |
| Durées | 1er événement → départ : 4 min 10,2 s | reconnexion → départ : 22,2 s ; erreur → départ : 4,18 s |

ÉTABLI : un seul chargement de page par lot (observateur unique), un seul équipement automatique enregistré (partie 17), une transition « erreur » enregistrée (partie 17) 4 ms après un démarrage, un départ réussi 4,18 s plus tard. Non mesurable : tout ce qui concerne le choix d'onglet et les clics de l'opérateur.

## Limites

- Un seul opérateur, trois parties ; Écho de 15 et 10 min. 142 des 166 jugés sont des « vus sans geste » (visite médiane 1,2 s) : la preuve forte est celle des 24 validations. 28 poses sans verdict (visites < 0,8 s, jamais déplacées).
- Pas de liste d'ESV postérieure aux corrections de l'opérateur : la pose finale vient de l'Écho seul. Recoupement sur les 5 corrigés validés des parties 16 et 17 : l'écart « corrigée → opérateur » de l'outil et celui calculé sur la liste diffèrent d'au plus 0,6 mm (l'outil est retenu).
- Partie 16 : la liste du lot date de 9 h 10 min 15 s (6 s après le début de la relecture) ; l'origine des 16 corrigés est la liste, confirmée par la pose ESV notée par la relecture (accord 0,05 mm). Partie 17 : liste d'avant le lot.
- Un seul « poserait » de la passe : l'échantillon manque toujours pour juger la garde A.
- Extractions, archive du tronc et liens de travail supprimés ; scripts et résultats dans `$S/p1617/scripts` et `$S/p1617/res`.
