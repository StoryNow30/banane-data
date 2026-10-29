# CH-012 : réplication de H7 sur la partie 20 (29/10/2026) : ÉCHEC, H7 non retenue

Constantes et seuils de tercile figés sur le réglage de la partie 17 AVANT la réplication (`H7-PARAMETRES-FIGES-2026-10-29.json`, SHA-256 dans `H7-SHA256-2026-10-29.txt`, commit `aa85e11`). Jeu de la partie 20 construit ensuite (`jeu-complet.cjs`, tronc `b85af60`, partie 10:20 en apprentissage), réplication par `h7-replique.cjs`, une seule fois, sans réajustement. Résultats : `h7-replique-p20.json`.

Comparaisons : 40 corrélations de traits (partie 17) + 4 tests de réplication (3 et 5 mm, deux variantes de H1) = 44 ; seuil de Bonferroni sur les 4 tests : 0,0125 (IC corrigé à 98,75 %).

Résultat : sur la partie 20 (252 rails sans hauteur apprise, 189 avec ; 160 et 138 cuts ; 30 blocs de 20), la différence appariée avec H1 sous 3 mm et sous 5 mm va de −1,2 à +1,2 points, **aucun intervalle n’exclut zéro** (ni à 95 %, ni corrigé), avec ou sans les rails décalés de plus de 100 mm, avec la référence brute ou corrigée du pixel de l'opérateur. Règle écrite par l'intégrateur : réplication échouée, **hypothèse non retenue**.

Ce qui subsiste, sans valeur de test : le sens du résidu vertical par tercile se retrouve en partie (tercile bas de points du dessus : +2,68 mm sans hauteur apprise, +0,75 avec), mais l'erreur de pose de H1 est dominée par des écarts de plusieurs millimètres (médiane 3D de 7 à 10 mm sur tous les rails, de 3,5 à 3,8 mm sans les décalés) : une correction verticale de 0,4 à 1,3 mm ne déplace que quelques rails de part et d'autre des seuils.
