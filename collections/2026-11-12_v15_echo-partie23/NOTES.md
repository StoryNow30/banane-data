# Séance Écho du 12/11/2026 : partie 23, jugée contre le lot « Vision 15 » de 11:46

563 visites, 341 cuts (segments 1 à 8, session « en cours » : pas d'export final). Journal : `collections/2026-11-12_v15_constellations-21-23_0-4` (volume 2). Table : `derive/jointure-echo-lot-p23.csv`.

## Mesuré (ÉTABLI)
- Lot : 277 posés, 33 différés au journal de la jointure. Revus : 65 posés (45 avec référence) et 29 différés. L'opérateur a suivi en partie la liste « verts à contrôler » : échantillon orienté vers les cuts douteux.
- Posés jugés : 24 à 10 mm ou moins, **21 à plus de 10 mm dont 15 à plus de 50 mm** (3694, 3695, 3747-3750, 4672, 4673, 4675, 5132, 5133, 5203, 5204, 5209, 5210 ; 126 à 300 mm). Tous posés par le lot ; zones `alerte` (7), `marge-apres` (7), `alerte-non-confirmee` (1).
- Différés : 28 jugés, tous à corriger (médiane 129 mm).
- Relecture : 89 corrections dans la partie, 8 revues, 1 avec référence (4674, juste à 0 mm).

## Examen de la règle « voie des cuts sûrs » (CH-112), outil `chantiers/CH-112/outils/regle-voie.cjs`
- Réglage retenu par CH-112 et branché en ombre par CH-114 (zone `alerte` seule, seuil 100 + 2·g² mm, G 12) : **0 des 13 erreurs de plus de 100 mm arrêtées**, 1 bon bloqué. Le terme de courbure (ajouté après coup) porte le seuil à 388 mm à 12 cuts : 3694 (285 mm) et 5132 (171 mm) passent ; les marges, exclues, portent 3747-3750.
- Réglage d'origine (seuil 100 fixe, zones `alerte` et marges) : 7 des 13 arrêtées, 3 bons bloqués, 16 arrêts sur 267 posés.
- Lecture (PROBABLE) : la courbure ajoutée au vu de deux cuts du 08/11 a ruiné le rappel sur un lot neuf.

## Export final (13-22-42, parties 22 et 23)
- Partie 23 : jointure refaite sur l'export final, chiffres identiques à ceux des segments automatiques (45 posés jugés, 15 à plus de 50 mm ; 28 différés jugés, tous à corriger).
- Partie 22 : 5 cuts revus seulement (4 posés sans action, 1 différé dont l'écart n'est pas jugeable : repère non raccordé). Pas d'examen possible.
