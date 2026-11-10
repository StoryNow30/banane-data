# Lot « Vision 12 » du 10/11/2026 (partie 9)

Build 286f541. Départ de la partie : 7 949 validés, 378 invalides, 8 327 lignes. Lot 08:32:30 à 08:42:17 (Paris), relecture « corriger » 08:42:49 à 08:55:40. La page d'ESV avait servi avant à une séance Écho de 17 min (collection `2026-11-10_v5_echo-partie1`).

## Mesuré (ÉTABLI, `tools/bilan-lot.cjs`, `outils/analyse-lots/attente-voisines.cjs`)
- Lot : 371 validés, 8 différés (2 posés ensuite par la deuxième passe), 587 s ; intervalle médian entre validations 1,2 s (P90 2,8 s).
- Relecture : 999 relus, 98 corrigés, 0 refus, 803 s.
- Capture selon le saut : +1 médiane 192 ms (P90 311 ms, 326 captures) ; 2-10 : 313 ms ; 11-50 : 215 ms ; 51-200 : 229 ms ; > 200 : 246 ms (Vision 9, partie 14 plus dense : 589 ms, 1,3 s, 2,7 s, 3 s, 4,6 s).
- Lectures au signal : 630 sur 645 déjà chargées (98 %), attente médiane 27 ms ; 15 avec chargement (Vision 9 : 58 % attendaient).
- Préchauffage : 1 369 opérations, du début du lot à la fin de la relecture ; à l'arrivée 99,8 % des nœuds de la boîte déjà chargés ; 58 opérations lointaines, 99,2 % chargé à l'arrivée ; prédiction juste 99,9 %.
- Un 502 à 08:54:24 (relecture) : le préchauffage reprend à 08:54:39 (pause de 10 s), 60 opérations après. Aucun « refus-serveur ».
- Plafonds : « plafond-lot » 1 fois (08:45:00) ; « plafond-octets » 23 fois entre 08:54:18 et 08:55:35, toutes à 0 nœud et 0 octet : c'est la garde de mémoire (tas de la page au-dessus de 1 536 Mo, mesuré 1 548 à 1 632 Mo).
- Mémoire de la page lue aux captures : 570 Mo au début du lot, 1 481 Mo à la fin (environ 36 Mo/min) ; points gardés par Potree stables (3,85 à 3,96 millions, une centaine de nœuds). La montée existe dans les lots précédents (Vision 7 : 147 à 1 702 Mo en 112 min ; Vision 9 : 570 à 1 160 Mo en 9,5 min).
- Cycle d'un cut (369 cuts, médianes) : capture 268 ms, rangement 25, calcul et proposition 285, décision 61, pose et relecture de la pose 171, suite 169 ; total 1,13 s.

## Relevé de console après le lot (`releve-console.json`, ÉTABLI sur cette page)
- Le bloc dont le chargement a reçu le 502 reste « en cours » (12 s observées) et le compteur de Potree reste à 1, pour une limite de 4 chargements à la fois : ESV ne libère pas un bloc en échec.
- Aucun bloc « au détail inconnu » autour de la coupe (27 blocs dans la zone, 15 chargés).

## À suivre
- Cause de la montée de mémoire : non établie (pas les points gardés par Potree). Sur un lot long, la garde de mémoire couperait le préchauffage (PROBABLE).
