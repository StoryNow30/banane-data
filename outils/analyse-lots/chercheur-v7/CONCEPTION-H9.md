# CH-012 : conception de H9 (une page, écrite le 29/10/2026 AVANT tout calcul). Modèle économique.

## À quoi H9 sert en production (dit franchement)
**Assistance de relecture / Écho, pas un levier d'autonomie.** Dans les zones de voie décalée, les poses du lot sont fausses et ne donnent aucun candidat juste (exploration H8 : décalage médian du voisin du lot à 87 à 154 mm de la cible). Seuls les voisins validés par l'opérateur portent des valeurs justes. H9 n'a donc de sens que quand l'opérateur a déjà corrigé quelques cuts d'une zone : Ariane lui propose, pour les cuts suivants, la pose faite avec l'un des décalages déjà corrigés autour ; l'opérateur valide ou corrige. Elle ne sert ni au lot, ni à la passe des différés (aucun voisin sûr humain). Elle est classée **assistance de relecture**.

## Le gain compté là où il compte : des cuts, pas des rails
**Cut évité** = cut dont la pose proposée est à 5 mm ou moins de la pose finale de l'opérateur sur les deux rails (pire rail, 3D), alors que la pose proposée aujourd'hui par Ariane sans H9 (H1 publiée, sinon pose de départ H0) ne l'était pas : un cut que l'opérateur n'a plus à déplacer à la main. Le gain est donné en **nombre de cuts évités pour 100 cuts que l'opérateur a déplacés de plus de 20 mm**, net des cuts que H9 fait passer de bon à mauvais. Second compte, le danger : **propositions fausses confiantes** = cuts où la pose H9 est à plus de 10 mm de l'opérateur alors que la pose d'aujourd'hui l'était à 10 mm ou moins.

## Construction (aucune constante apprise)
- Candidats : pour chaque rail, une pose par valeur distincte de décalage des voisins **humains** de la famille « tous » de H6, à ±10 cuts (fenêtre de H6), pose d'ESV d'origine translatée du décalage [latéral, vertical] de ce voisin pour ce rail ; deux candidats à moins de 2 mm l'un de l'autre sont un seul (écart fixé ici, avant mesure). Les poses de H0 à H6 sont inchangées ; H9 s'y ajoute, hors du plafond de 12.
- Sélecteur : parmi les candidats qui ont le **support de H6** (au moins 5 points sur le dessus et 3 sur le flanc sous le gabarit, constantes de `H6.supportDessus` et `H6.supportFlanc`), celui dont le total de points sous le gabarit est le plus grand. Aucun paramètre appris : donc pas de validation croisée à faire, le jeu de développement (partie 20) sert à mesurer une fois, la partie 17 réglage à répliquer une fois.
- **Abstention** : aucun voisin humain à ±10 cuts, ou aucun candidat avec le support : H9 ne propose rien, la pose d'aujourd'hui reste. Part chiffrée en cuts et en rails.
- Outil : copie en mémoire de `gcv2-jeu.cjs` (comme `h8-extraire.cjs`), deux ajouts : les candidats H9 après la boucle H2 (avec le chemin « translaté » de H6 pour compter les points d'une pose lointaine) et la levée du plafond pour eux seuls. `gcv2-jeu.cjs` n'est pas modifié.

## Protocole
1. Cette page et `h9-extraire.cjs` (SHA-256) commités avant tout lancement.
2. Mesure UNE fois sur la partie 20 (apprentissage), puis réplication UNE fois sur la partie 17 réglage, sans réajustement. Aucune retouche de la règle après avoir vu un chiffre : si elle échoue, H9 n'est pas retenue.
3. Comparaisons comptées : 3 tests de la partie 20 (cuts évités nets ; rails sous 5 mm ; rails sous 10 mm), seuil de Bonferroni 0,0167, IC par blocs de 20 cuts à 95 % et 98,3 % ; les mêmes 3 sur la partie 17 ; en plus, descriptifs : abstention, propositions fausses confiantes, comparaison à H6 « proche humain ».
4. Critère de retenue écrit avant : H9 est **retenue comme assistance de relecture** si, sur la partie 20 ET sur la partie 17 réglage, la borne basse de l'IC corrigé des cuts évités nets est positive et le nombre de propositions fausses confiantes ne dépasse pas celui des cuts évités ; sinon non retenue.

## Ce qui ne prouvera rien
Un seul opérateur, deux parties du même projet ; la simulation suppose que l'opérateur a déjà corrigé les voisins, ce que seule l'Écho en cours produit ; le gain est en cuts d'une partie, pas en temps de l'opérateur (non mesuré) ; la partie 17 réglage a peu de cuts déplacés de plus de 20 mm (effectif à rapporter).
