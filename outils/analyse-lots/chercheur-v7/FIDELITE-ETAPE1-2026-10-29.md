# CH-012, étape 1 du rejeu : fidélité du profil `base` (déclaration datée du 29/10/2026)

Population : partie 17, lot v6 (4.9.5.23), cuts de RÉGLAGE du tirage `tirage-2026-10-29.json`. 412 cuts rejoués, 410 posés par le lot, 402 rejoués en « pose ». Sortie filtrée par `rejeu-filtre.cjs` (SHA-256 dans `rejeu-filtre.cjs.sha256`), brut supprimé, comptes dans `rejeu-base-comptes.json`.

## Critère d'origine (écrit avant le lancement, NON effacé)
Pose rejouée égale à la pose du journal à 0,5 mm ou moins (pire rail, 3D) sur au moins 95 % des cuts. **Résultat : 60,7 % [55,8 ; 65,3] (244/402). Critère non tenu.** Médiane 0,47 mm, P90 0,59 mm, maximum 0,69 mm.

## Critère modifié après coup, étape 1
Tolérance de 0,8 mm (pire rail, 3D), déclarée APRÈS avoir vu l'écart. **Résultat : 100 % (402/402) à 0,8 mm.** Étiquette : *critère modifié après coup, étape 1*. Les deux chiffres sont à donner ensemble dans le rapport.

## Test direct de l'arrondi au pixel (demandé par l'intégrateur)
- La grille absolue des pixels suit la caméra de chaque cut et son origine n'est pas dans le journal : on ne peut pas quantifier la pose rejouée sur la grille. Test fait sur la forme du résidu.
- Résidu (rejeu moins journal), latéral et vertical, 804 valeurs chacun : uniforme et à sens unique, sur [−0,52 ; 0] mm (`pixel-test.json`), axes indépendants (corrélation 0,05). La grille de 0,386 mm est rejetée (KS contre l'uniforme sur [−0,386 ; 0] : 0,20 et 0,24).
- Le journal porte la taille du pixel de la vue au moment de la pose (`vueFin.pixelMm`) : **0,499 mm pour les 402 cuts**. Résidu divisé par ce pixel : uniforme sur [−1 ; 0], KS 0,031 (1 608 valeurs), 100 % dans l'intervalle (`pixel-par-cut.json`). C'est la prédiction d'une troncature au pixel de la vue, avec le pixel du lot (0,499 mm), pas celui de 0,386 mm des séances Écho. **Hypothèse confirmée (PROBABLE à ÉTABLI selon la lecture de ESV, que je n'ai pas).**
- Réserve sur la règle « sous un demi-grain pour l'essentiel » : elle vaut pour un arrondi au plus proche. Une troncature uniforme laisse 50 % des résidus sous un demi-pixel (mesuré : 50,2 %), pas davantage. Le test retenu est donc l'uniformité sur [−1 ; 0] pixel, plus précis ; il est écrit ici pour que l'intégrateur tranche.
- Conséquence : les poses du lot sont décalées en moyenne de −0,25 mm par axe, sur les deux rails, par la troncature. Hypothèse de v7 n° 1 (à chiffrer sur les cuts jugés du réglage) : viser le centre du pixel.

## Les 8 cuts « pose réelle / différé rejoué »
Cuts 4818, 4819, 8314, 8316, 8672, 8674, 8675, 8676. Dans le journal, ce sont des cuts à l'étage `deferred` que le lot a ensuite posés (étage différé suivi de L1) ; le profil `base`, sans L1, les laisse différés avec le motif de la décision du lot : `no-qualified-minimum-near-prediction` (5 cuts) ou `no-anchor` (3 cuts : 8674 à 8676, ceux dont la pose du lot est à 28 à 111 mm de l'opérateur). C'est la différence entre `base` et `L1`, pas un désaccord d'arrondi. Ils ne comptent ni dans la fidélité ni dans les poses jugées. Le profil `base` ne les différait pas déjà ailleurs : sur les 2 différés réels du réglage, `base` les laisse différés (2/2), et il ne pose aucun cut que le lot a différé (0).
