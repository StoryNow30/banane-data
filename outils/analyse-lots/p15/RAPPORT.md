# Lot et Écho de la partie 15 (Ariane 4.9.5.21, test 21), 26/10/2026

Lecture seule, rien rejoué ni commité. Heures de Paris (UTC+1). Niveaux : ÉTABLI (mesuré), PROBABLE, SUPPOSÉ. Outils du tronc : `juger` (non utilisé, il juge des rejeux du banc), `jointure-echo-orbite`, `lire-volumes`, `tableau-bord`, `controle-passe`, `diff-liste`, `perf-lot` ; `decisions-numeros` sans objet (numérotation de DECISIONS.md).

**À retenir.** Le lot compte **46 cibles, 45 posés, 1 différé** (pas 59 ; 56 poses d'Ariane si on ajoute les 11 corrigés par la relecture, 56 confirmés par la liste d'ESV). **Cuts réellement jugés : 31 sur 45 poses du lot** (3 validations de l'opérateur + 28 visités sans action) ; **strictement, 3**. Aucun de ces 31 n'est à plus de 20 mm (maximum 8,2 mm), 0 mauvaise voie. L'effectif ne permet pas de dire si le budget D-223 est tenu.

## A. Le lot

| | |
|---|---|
| Bornes | 8 h 43 min 17,7 s à 8 h 45 min 25,3 s : **2 min 07,6 s**. Mode rapide « Comme avant », règle « grappe de différés » coupée. Fin normale : dernier cut à valider (7623) validé sur place, ESV reste sur ce cut. |
| Cibles / posés / différés | **46 = 45 posés + 1 différé** (cut 4655, « aucun point LiDAR disponible », capture abandonnée voulue). Les 46 cibles sont exactement les 46 invalides de la liste de 8 h 43. ÉTABLI |
| Étape de décision | chaîne normale **26** ; choix **12** ; passage à niveau **4** ; fenêtre **3** ; GCV2 dans le lot **0** ; différés **1** ; deuxième passe 0 écrit |
| Temps par cut | cycle (44 cycles, hors silences) **médiane 2,20 s, p90 6,06 s**, max 7,5 s ; cycle V1 2,00 s / 5,92 s ; 2,8 s par cible en moyenne. Phases médianes : navigation → capture 0,93 s (p90 4,9 s), analyse 0,46 s, décision 0,05 s, pose 0,11 s, capture après pose 0,07 s, validation 0,11 s, cut suivant 0,08 s. Cycle médian par étape : chaîne normale 1,97 s (24), choix 2,20 s (12), fenêtre 2,27 s (3), passage à niveau 5,45 s (4) : les longs cycles sont les entrées de zone (saut + capture jusqu'à 3,9 s). Première capture 0,6 s après le départ. |
| Arrêts, pauses | 1 arrêt (fin normale), 0 pause, 0 reprise, 0 silence de plus de 60 s. |
| Service worker | **0 redémarrage** : une seule horloge du début à la fin, aucun point `restored` (horloge démarrée à 8 h 31 min 34,8 s). ÉTABLI |
| Incidents | 41 clics hors canevas (côté gauche, chemin direct), 0 erreur ou refus associé ; 0 erreur sur 434 réponses de commande (lot + relecture) ; 3 « compteur bloqué » diagnostiques pendant le lot (+1 en relecture) ; **1 PUT 502** (cut 7218), refait 0,23 s plus tard en 204 ; 0 `ecriture-refusee`. |
| Preuve d'écriture | **45 écritures de validation 2xx observées sur 45 lignes distinctes = les 45 posés**, 0 doublon (44 pendant la fenêtre, la 45e, cut 7623, 0,5 s après l'arrêt). Recoupé par la liste de 8 h 52 : les 45 passent invalide → valide, tous déplacés de plus de 1 mm. `serverConfirmed` non lu. ÉTABLI |

**Poses d'Ariane (contexte).** Déplacement du pire rail par rapport à la pose de départ d'ESV : médiane 36,6 mm, p90 51,5 mm, max 69,5 mm sur les 45 (le rail gauche porte l'essentiel). ÉTABLI

**Deuxième passe (ombre).** **A tourné** : `passe-differes-ombre` et `-fin` à 8 h 45 min 25,34 s (69 ms après l'arrêt, 29 ms de calcul), mode ombre, `ecritureDemandee` faux, 1 différé examiné, décision « rien » (motif `sans-voie`, zone abords, hypothèse à 35,1 mm du départ non retenue). **0 « poserait », 0 écrit** : aucun `passe-differes-ecriture`, `ecritsPasse` = 0, le cut différé n'a reçu qu'une écriture « vu » (pas de pose) et reste le seul invalide de la liste de 8 h 52. **0 cut écrit par la passe.** ÉTABLI. Contrôle a posteriori (`controle-passe`) : 0 cut disponible sur 60, contrôle non fait. L'opérateur a ensuite déplacé ce cut de 34,3 mm (voir B).

**Relecture** (« corriger », 8 h 45 min 25,6 s à 8 h 49 min 43,4 s, 258,1 s, 1,94 s par cut) : **133 relus, 11 corrigés**, 132 marqués « vu », 0 refus ; aucun des 45 posés n'est relu (ce sont 132 verts et le cut différé, visité sans écriture). Corrigés : 941, 2607 à 2610, 3881, 3888, 3890, 4657 (passage à niveau, 9) ; 7217, 7220 (appui ADV, 2). Étage calculé : chaîne normale 7, choix 2, fenêtre 1, passage à niveau 1. **Déplacement (pire rail, 3D) : min 15,2 / médiane 34,4 / max 42,7 mm ; 9 sur 11 au-dessus de 20 mm, 0 au-dessus de 50.** 11 écritures de validation 2xx sur exactement ces 11 lignes. ÉTABLI

**Connexion au démarrage (test 21).** Le journal ne garde que le dernier statut de connexion (« prêt », onglet B, sans message, à 8 h 51 min 20,0 s) : pas d'historique, donc ni instant « hors ligne » ni durée d'attente établis ; aucune transition de rechargement, de reconnexion, de pause. Ce qu'il montre :

| Heure | Fait |
|---|---|
| 8 h 31 min 34,8 s | début de l'horloge du service worker (une seule jusqu'à la fin) |
| 8 h 37 min 42,5 s (± 1 s) | origine de l'horloge de la page ESV du lot (déduite de 525 événements, unique : pas de F5 ensuite) ; « page chargée à cet instant » PROBABLE |
| 8 h 40 min 16,2 s | transition « erreur » du coordinateur : une commande du panneau a échoué ; le message n'est pas dans l'export (la notice a été écrasée par celle de fin de lot) |
| 8 h 40 min 28,16 s | **1er équipement d'onglet réussi** (onglet A, …774) ; le sélecteur de parties montre la partie 14 |
| 8 h 40 min 33,36 s | **2e équipement réussi, sur un autre onglet** (B, …688), partie 15 ; changement de cible partie 14 cut 0 → partie 15 cut 1 (6 ms plus tard) |
| 8 h 43 min 17,67 s | départ du lot ; 1re capture 0,6 s après, 1re validation à 8 h 43 min 18,68 s |

Durées : erreur → 1er équipement 12,0 s ; 1er → 2e équipement 5,2 s ; 2e équipement → départ du lot 2 min 44,3 s (aucun événement dans l'intervalle) ; erreur → départ 3 min 01,5 s. Le journal ne contient ni clic ni attente côté opérateur : « premier choix sans effet » et « second clic lent » ne sont pas mesurables ; il montre seulement deux équipements réussis sur deux onglets différents, 5,2 s d'écart. Cause non établie, non devinée. L'export Écho ne contient aucun événement de connexion ni de rechargement de page.

## B. Jugement des poses contre l'Écho

Écho : 8 h 52 min 38 s à 8 h 58 min 14 s, 185 visites (indices 0 à 184 contigus, aucun trou), 183 cuts, dernier export seul. La première visite de chaque cut part de la pose écrite par Ariane (résidu 0,0 mm sur 90 rails). Vérité : pose finale de l'opérateur (dernière validation) ; règle de l'analyse du 23/10 : un cut visité au moins 0,8 s sans qu'aucun rail bouge de 0,5 mm vaut « bon ». Les **46 cuts du lot sont tous visités** (1 à 2 visites).

| Étape | Posés | **Jugés** (validés + vus sans action) | Écart 3D méd. / p90 / max (mm) | > 20 mm | > 50 mm | Mauvaise voie |
|---|---|---|---|---|---|---|
| Chaîne normale | 26 | 18 (1 + 17) | 0 / 0 / 3,5 | 0 | 0 | 0 |
| Choix | 12 | 9 (1 + 8) | 0 / 1,6 / 8,2 | 0 | 0 | 0 |
| Passage à niveau | 4 | 3 (1 + 2) | 0 / 3,8 / 4,8 | 0 | 0 | 0 |
| Fenêtre | 3 | 1 (0 + 1) | 0 / 0 / 0 | 0 | 0 | 0 |
| GCV2 dans le lot | 0 | 0 | | | | |
| **Total** | **45** | **31 (3 + 28)** | **0 / 0 / 8,2** | **0** | **0** | **0** |

- **Cuts à plus de 50 mm : aucun** (liste vide). Au-dessus de 5 mm : 1 (cut 938, choix, 8,2 mm).
- **Lecture prudente** : les médianes et p90 à 0 viennent de la règle (un cut vu sans geste compte 0), elles ne mesurent pas la précision. Stricte (validation observée) : **3 cuts**, écarts 3,5 / 4,8 / 8,2 mm (7194 chaîne normale, 940 passage à niveau, 938 choix), tous des corrections de l'opérateur, donc un échantillon biaisé vers l'erreur. Les 28 « vus sans action » ont une visite médiane de 1,2 s (0,8 à 5,8 s) : preuve faible, SUPPOSÉ que l'opérateur aurait corrigé un cut faux.
- **Budget D-223** (mauvaise voie ≤ 1 %, > 50 mm ≤ 3 %) : 0 sur 31, borne haute de Wilson 95 % **11,0 %** (0 sur 3 strict : 56 %). **Non démontrable ni réfutable** avec cet effectif ; il faudrait environ 125 cuts jugés sans erreur pour borner à 3 %, 381 pour 1 %. Ne pas généraliser.
- **Non jugés : 14 sur 45**, tous visités une fois, aucun déplacé, mais **moins de 0,8 s** (0,6 à 0,8 s) : 936, 4659 à 4661, 7611, 7613 à 7616, 7618 à 7620, 7622, 7623 (chaîne normale 8, choix 3, fenêtre 2, passage à niveau 1). **Aucun cut non visité.**
- **Cut différé (4655)** : pas une pose d'Ariane ; l'opérateur l'a validé en le déplaçant de **34,3 mm** (latéral). ÉTABLI. La passe en ombre n'avait rien à poser.
- **Les 11 corrigés par la relecture** : tous visités ; **pose corrigée plus proche de la pose finale que la pose d'origine : 11 sur 11.** Origine → opérateur : 15,2 à 42,7 mm (médiane 34,4) ; corrigée → opérateur : 0 mm pour 10 (visités sans action, 0,8 à 3,5 s) et 7,3 mm pour le cut 941 (le seul validé par l'opérateur ; origine à 34,4 mm). Seul 941 est une vraie validation : SUPPOSÉ pour les 10 autres.
- **Hors brief, relecture** : l'opérateur a corrigé 14 autres cuts hors lot (2,8 à 37,3 mm), dont 13 relus sans correction. Deux étaient notés « je corrigerais » sans écriture : 2606 (hors zone, 41,7 mm proposés, opérateur 37,3 mm) et 937 (6,7 mm proposés, opérateur 10,3 mm) ; le sens des écarts n'est pas comparé.
- **Hors brief, règle en ombre** « PN chaque cut » : aurait différé 28 des 45 posés ; sur les 14 jugés parmi eux, max 8,2 mm (938, 940 corrigés). Elle aurait différé des poses acceptées (ombre seulement).

## Limites
Un seul Écho de 5,6 min (1,8 s par visite), une seule partie, 31 jugés dont 3 validations ; 14 poses sans verdict ; pas de liste d'ESV postérieure aux corrections de l'opérateur (la liste de 8 h 52 leur est antérieure), la pose finale vient donc de l'Écho seul. Recoupement en coordonnées monde (liste de 8 h 43, liste de 8 h 52, pose finale de l'Écho) : écart maximal entre les deux mesures 0,3 mm.
