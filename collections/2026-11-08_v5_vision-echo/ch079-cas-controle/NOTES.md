# CH-079 (D-308) : cas de contrôle permanents, neuf cuts validés faux (Écho du 08/11, partie 6)

- Origine : lot de 21:30 (223 coupes) et Écho de la partie 6, jointure `tools/jointure-echo-orbite.cjs` du dépôt banane.
- Un fichier par cut (`cut-6-<cut>.json`, format `ch079-cas-controle-v1`) : capture (rails, nuage), appuis du lot, décision du lot et de L1 telles que le journal les a consignées, pose d'Ariane, écart de l'opérateur à cette pose (repère profil), écartements des voisins validés avant le cut, écart actuel en mm.
- Famille « mauvaise-voie » : 220, 360, 361 (écart 174, 156, 156 mm). Famille « imprecision » : 142, 143, 221, 228, 231, 232 (9,7 ; 5,1 ; 9,2 ; 11,1 ; 17,1 ; 11,9 mm), posés par la décision L1-e après un différé du lot.
- Générés par `node tools/ch079-extraire-corpus.cjs` (dépôt banane) ; lus par `tests/ch079-cas-controle.test.cjs` via `CH079_CORPUS=<ce dossier>`.
- Limite (ÉTABLI) : seuls 220, 360 et 361 sont rejouables en entier (moteur + `decideCut`, fidèles à 0,2 mm) ; les six autres dépendent de l'état du lot au moment de la décision L1-e (voisins, poses transportées, zones), absent de ce petit corpus : leur pose enregistrée sert de témoin.
