# CH-012 : conception du rejeu hors ligne de la GCV2 (une page, avant tout code)

Statut : proposition soumise à l'intégrateur le 29/10/2026. Rien n'est lancé. Aucune modification de `src/` ni de `tools/` de `banane`.

## Entrées
- Journal du lot (partie 17, 4.9.5.23), nuages des volumes « corpus » du lot (2 à 11), liste d'ESV, Écho de 539 visites. Tirage `tirage-2026-10-29.json` (blocs de 20, garde de 3, graine 20261029).
- Outils existants, utilisés tels quels : `tools/banc-differes.cjs rejouer` (profils `base`, `L1`, `L1-e`) et `tools/gcv2-jeu.cjs construire` puis `rappel` (hypothèses H0 à H6 par rail, sans fuite de l'Écho, rappel atteignable). Aucun module de décision n'est modifié.

## Ce qui est rejoué
1. **Fidélité d'abord** : `base` sur les 791 cibles du lot ; critère : pose rejouée égale à la pose vérifiée du journal à moins de 0,5 mm sur au moins 95 % des cuts de réglage, sinon le rejeu ne prouve rien et on s'arrête (écart écrit).
2. **Cuts de réglage visités à l'Écho sans pose v6 comparable** (environ 130, plus les 25 déjà jugés) : le moteur d'aujourd'hui (profil `base`, puis `L1`) pose chaque cut sur son nuage, comme la v6 l'aurait fait, et on compare à la dernière validation de l'opérateur, par rail et par axe.
3. **Voie décalée** : pour les cuts où le rejeu ou le lot s'écarte de plus de 20 mm, séparer décalage commun aux deux rails (voie, H6) et écartement ; retrouver quelle hypothèse porte la bonne pose (rappel atteignable) et quel signal manquait (appuis absents, `no-groove`, étage différé). Les cuts 8674 à 8676 du réglage sont le premier exemple ; le détail par cut de CH-015 (partie 20) sert de second jeu **pour la compréhension seulement**, jamais pour le chiffre de réglage de la partie 17.

## Ce qui est mesuré (réglage seul)
- Écart v6-rejoué contre opérateur, par rail et axe, médiane et P90 avec bootstrap par bloc de 20 cuts.
- Taux de poses sans décalage de voie (écart latéral commun inférieur à 20 mm) et écart sur les cuts différés.
- Rappel atteignable à 10 mm et à 5 mm : part des cuts dont une hypothèse H0 à H6 est à 5 mm ou moins de la pose de l'opérateur (borne haute de ce qu'une sélection d'hypothèses pourrait gagner).
- Biais par zone, côté, hauteur : retenu seulement si l'intervalle exclut 0 ET dépasse le bruit mesuré sur ce réglage (voisins : 1,01 mm latéral, 1,26 mm vertical par rail ; 66 fenêtres, 11 blocs).

## Critère d'arrêt
Arrêt dès que : la fidélité échoue ; ou le rappel à 10 mm ne dépasse pas celui de la v6 sur le réglage (aucune marge de sélection) ; ou l'effectif d'un strate est inférieur à 15 cuts (aucun chiffre de strate). Les paramètres de toute proposition sont figés et déclarés avant que l'intégrateur ouvre l'examen.

## Ce qui ne prouvera rien
- Un rejeu hors ligne n'est pas le terrain : latence, ordre d'arrivée des appuis et état d'ESV sont ceux du journal, pas rejoués.
- L'examen est « dans la partie » : il ne prouve pas la généralisation à une autre partie ni à un autre projet.
- La mesure du nuage (`tools/sensibilite-nuage.cjs`) est une borne basse de ce que les points permettent de situer, pas la perception de l'opérateur.
- Le rattachement du réglage v6 à cette partie 17 reste SUPPOSÉ non tranché (question posée à l'opérateur).
- Sous 5 mm : non démontrable avec cet effectif (25 jugés hors différés, environ 150 avec le rejeu). Écart minimal détectable d'un taux : de l'ordre de 15 à 20 points.

## Cible proposée (honnête)
Pas de cible « 5 mm ». Cibles mesurables sur les mêmes cuts, même référence : (1) taux de poses sans décalage de voie (latéral commun inférieur à 20 mm) contre la v6 ; (2) écart médian sur les cuts de l'étage différé ; (3) part des cuts posés à 10 mm ou moins sans en dégrader aucun (cahier § 2). La sous-5 mm reste une mesure de suivi, jamais un verdict de cut.
