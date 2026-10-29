# CH-015 : analyse des exports terrain, partie 20, lot du 28/10 (4.9.5.23)

Outil : `tools/juger-lot.cjs` (dépôt `banane`), graine 20261028. Sorties dans `sorties/` (comptes et millimètres, aucun numéro de cut). Entrées, non versées ici : 20 volumes du lot du 28/10 (journal, bilan, corpus de nuages) et 22 archives d'Écho de la partie 20 du 29/10, reçues de l'opérateur dans la conversation de CH-015. À archiver dans `collections/` (convention : dossier daté, `raw/` en .7z, `manifest.json` SHA-256) par l'intégrateur ; je n'ai rien écrit dans `collections/`.

## Fait
- Tableau standard de la partie 20, lot 4.9.5.23, jugé contre l'Écho ; trois tableaux de comparaison relancés avec le même outil sur les lots déjà archivés (partie 20 en 4.9.5.21, partie 0 en 4.9.5.22, partie 1 en 4.9.5.23).

## Mesures (partie 20, 4.9.5.23) — ÉTABLI (compté par l'outil)
| Ligne | Valeur |
|---|---|
| cibles / posés / différés | 889 / 721 / 168 (18,9 % de différés) |
| sans Écho / non jugés / jugés | 544 / 5 / 172 (sur 721 posés) |
| jugés : corrigés / contrôlé, bon | 97 / 75 |
| écart, pire rail 3D | médiane 1,68 mm [0 ; 3,96], max 391,3 mm |
| ≤ 2 / ≤ 5 / ≤ 10 mm (sur 172) | 50,6 % / 63,4 % / 81,4 % |
| > 20 mm / > 50 mm (sur 172) | 24 (14,0 %) / 21 (12,2 %) |
| mauvaise voie, latéral > 100 mm (sur 172) | 21 (12,2 %), soit tous les > 50 mm |
| passe en ombre : « poserait » / « rien » / refus garde (sur 168) | 80 / 88 / 0 |
| 80 « poserait », tous jugés | médiane 3,25 mm [2,75 ; 3,82], > 20 mm : 3 (3,8 %), > 50 mm : 2 (2,5 %), max 171,7 mm |

La relecture après lot du journal indique 1 088 cuts relus, 92 corrigés (ÉTABLI, ligne `CONTENU.txt`).

## Où la pose est fausse
- Les erreurs graves sont toutes du type « mauvaise voie » : 21 sur 21 des écarts > 50 mm ont un écart latéral > 100 mm (ÉTABLI). Les écarts entre 20 et 50 mm sont 3 (ÉTABLI). Il n'y a presque rien entre « bon à moins de 10 mm » et « autre voie » : la distribution est à deux étages, comme chez le débutant (BRUIT_REFERENCE § 3).
- Passe en ombre : 3 « poserait » sur 80 dépassent 20 mm, dont 2 dépassent 50 mm (3,8 % et 2,5 %, ÉTABLI) ; leur latéral n'est pas lu ici, donc rien n'est dit sur la voie (NON FAIT). Petit effectif.
- Où sont ces 21 cuts (passages à niveau, aiguilles, un tronçon) : NON FAIT, il faut le détail par cut (`precision-poses.cjs --detail`), que cet outil ne sort pas pour un dossier d'export brut.

## Ce que le bruit de référence limite
- Médiane 1,68 mm : du même ordre que le bruit de référence (0,75 à 1,5 mm latéral, 2,3 mm vertical). Elle ne se lit pas comme une précision.
- 29 jugés sur 172 (16,9 %) sont dans la zone grise du seuil de 5 mm (ÉTABLI, sortie JSON) : le « ≤ 5 mm » de 63,4 % est à lire comme un taux de partie, pas cut par cut. Le seuil de 10 mm (12 cuts en zone grise, 7,0 %) et surtout 20 et 50 mm ne sont pas touchés.
- 75 jugés sur 172 sont des « contrôlé, bon » : écart nul par la règle, avec le biais d'ancrage que fiche BRUIT_REFERENCE décrit ; ils tirent la médiane vers 0.

## Limites
- **Sélection** : seuls 172 des 721 posés (23,9 %) ont été vus par l'Écho. Les cuts visités ne sont pas tirés au hasard (SUPPOSÉ : l'opérateur va voir ce qui l'inquiète). Les taux ci-dessus décrivent les cuts visités, pas la partie.
- **Écho incomplet ou pas** : 22 archives, certaines en plusieurs volumes ; je n'ai pas vérifié qu'il n'en manque pas (NON FAIT). Le premier passage avec 5 archives donnait 51 jugés, le dernier 172 : la mesure grossit avec l'Écho disponible.
- **Pas de comparaison de versions** : les quatre lots ne se comparent pas. 74 cibles (partie 20, 4.9.5.21) contre 889 ; 36, 16 et 24 jugés pour les trois autres, contre 172. Les trois lots antérieurs montrent 0 pose > 20 mm sur 36, 16 et 24 jugés, mais avec ces effectifs une absence n'est pas une preuve (borne haute de Wilson à 95 % pour 0 sur 36 : environ 9,6 %, calcul à la main). Différés : 4/74 (5,4 %), 39/597 (6,5 %), 28/380 (7,4 %), puis 168/889 (18,9 %) : la hausse est mesurée ; sa cause n'est pas établie. Départ de la partie 20 en 4.9.5.23 : 889 cuts invalides au départ, contre moins de 40 pour les parties 0 et 1 ; la population de cuts n'est pas la même (PROBABLE).
- **4.9.5.24** : aucun export reçu, aucune ligne sur cette version.

## Pas fait
- Détail par cut des 21 mauvaises voies et des 168 différés ; recherche de ce qu'ils ont en commun.
- Rejeu des mêmes cuts en 4.9.5.21 à 4.9.5.23 (seule comparaison valable).
- Corrections demandées pour le chantier molette / clic droit : l'opérateur n'a pas précisé de fichier ni de cuts ; question posée à l'intégrateur.
- Archivage des exports dans `collections/` (CH-012 archive peut-être le même lot : à coordonner par l'intégrateur).
