# Partie 20, lot du 28/10 (4.9.5.23) : le résumé pour l'opérateur

**Ce qui est établi** (compté sur le journal du lot et 22 archives d'Écho)
- Le lot a traité 889 cuts : 721 posés, 168 différés (18,9 %). Les autres parties jouées en 4.9.5.23 étaient entre 1,3 % et 7,4 % de différés : la partie 20 est une exception, pas la version.
- Sur 172 posés que l'Écho a jugés, 21 (12,2 %) sont décalés de 107 à 391 mm : les deux rails du même côté. Les autres sont presque tous à moins de 10 mm (81 % à 10 mm ou moins). Ce n'est pas une autre voie, c'est un décalage de 11 à 39 cm.
- Différés et poses décalées sont presque tous dans deux tronçons : cuts 6000 à 6999 et 9000 à 9499. Ailleurs : 5 différés et 1 pose décalée sur 343 cuts.
- Les poses décalées sont collées aux différés : 41 % des jugés voisins immédiats d’un différé (cut juste avant ou juste après) sont faux, contre 5 % ailleurs.
- Cinq poses fausses (6402, 9438, 9439, 9440, 9457) viennent de cuts où le moteur n'avait résolu aucun rail : la décision du lot ou la GCV2 L1 a déplacé les rails et le Pilote a validé. Au total, 88 des 721 posés étaient dans ce cas côté moteur.
- La molette et le déplacement de vue ne marchent pas dans ce lot : 45 coups de molette sur 45 sans effet sur la caméra ; 19 déplacements de vue sur 19 refusés. Ils concernent 29 différés, aucune des 21 poses décalées.

**Ce qui n'est pas établi**
- La précision du lot entier : l'Écho a vu 24,5 % des posés, surtout près des différés. Les taux ci-dessus sont ceux des cuts visités.
- Pourquoi ces deux tronçons (nuage, voie, terrain) : le nombre de points ne les explique pas ; la courbe n'a pas pu être mesurée proprement.
- Que « un des deux cuts précédents est différé » serve de garde : trouvée sur les 172 jugés (13 des 21 faux attrapés pour 41 posés signalés, 5,7 %), non confirmée ailleurs. Premier contrôle sur la partie 17 de CH-012 (blocs de réglage) : 2 différés et 1 faux seulement, donc sans valeur.
- Une comparaison 4.9.5.21 à 4.9.5.24 : les lots anciens ont 16 à 36 jugés ; aucun export 4.9.5.24.

**À décider avec le prochain lot (test 24)**
1. Aucune garde avant une validation sur un lot jugé indépendant ; l'intégrateur l'a décidé. L'outil `predicteurs-valider.cjs` donne le résultat en une commande dès que le lot et son Écho sont déposés.
2. Pour que le lot soit utile : faire passer l'Écho sur les posés qui suivent chaque différé (les trois cuts qui suivent), pas seulement sur les différés.
3. Une question pour vous : « ne jamais valider un cut non résolu » veut-il dire « rail non résolu côté moteur » (alors 88 posés sur 721 la violent, à la lettre) ou « cut sans aucune décision du lot » (alors non) ? Les décisions D-041 et D-042 permettent au lot de poser ce que le moteur ne résout pas.
