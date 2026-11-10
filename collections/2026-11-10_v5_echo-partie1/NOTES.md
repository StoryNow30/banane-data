# Séance Écho du 10/11/2026 : relecture manuelle de la partie 1

Séance de l'opérateur, 07:54:37 à 08:12:08 (Paris), 17 min 30 s. Aucun lot Ariane : le préchauffage (Vision 11 et 12) ne tourne que lorsqu'Ariane pilote, cette séance ne mesure donc pas la vitesse de Vision 12.

## Mesuré (ÉTABLI)
- Départ de la partie : 9 908 validés, 10 invalides, 9 918 lignes. Aucun cut mémorisé d'Ariane pour cette partie.
- 770 visites sur 508 coupes distinctes ; plages 145-257, 260-268, 677-993, 3395-3443, 8903-8905, 9901-9917. Visite médiane 0,78 s.
- 56 validations observées : 50 avec correction (26 les deux rails, 14 le droit, 10 le gauche), 6 sans mouvement ; 2 SKIP de l'opérateur ; 6 visites à gestes multiples.
- Sur les 61 coupes à pose finale connue (pire rail, 3D) : 20 à 5 mm ou moins, 11 entre 5 et 10, 5 entre 10 et 20, 4 entre 20 et 50, **21 au-delà de 50 mm** (jusqu'à 262 mm). Dont une série continue 811-828 (les deux rails décalés du même côté, 97 à 262 mm), 146, 152, 166, 3411, 3412, 8903.
- Réseau : 1 333 requêtes de points, toutes en 200, 0 échec ; attente serveur médiane 96 ms par fenêtre, p90 253 ms. 178 écritures, toutes en 204.
- Premier nuage exploitable après l'arrivée sur une coupe : médiane 220 ms (rail gauche), 333 ms (rail droit), maximum 5,2 et 6,7 s.

## Étude hors ligne (PROBABLE, `tools/relecture-autonome.cjs extraire`, moteur livré, nuages d'avant le premier geste)
- 373 coupes calculées sur 508 (135 sans nuage : visites trop courtes).
- Les 21 coupes corrigées de plus de 50 mm (19 calculées) : en chaîne, le moteur en retrouve 6 à 10 mm ou moins de la pose finale, s'abstient sur 12, et en laisse 1 fausse (cut 821, 171 mm) ; seul, il s'abstient sur 17 et confirme 2 poses fausses (152, 821).
- Les 251 coupes visitées sans action et calculées : en chaîne, 213 à 10 mm ou moins du départ, 32 abstentions, 6 déplacements de plus de 10 mm (dont 1 de plus de 20 mm).
- Auteur des poses fausses de départ : non établi (pas de journal de lot pour cette partie).

Fichiers dérivés (numéros de cut et millimètres seulement) : `derive/table.csv` (jointure Écho seule), `derive/cas.jsonl` (cas de l'étude). Scripts : `outils/analyse-lots/echo-partie1-1110/`.
