# Collecte 2026-09-28 — Ariane 4.8.0

## Essai de l'opérateur (07:30–07:59)

`essai/essai-p11-p15-4.8.0.7z` (archive de l'opérateur telle quelle) : deux
exports (07:58 et 07:59), chacun journal, bilan, diagnostic, corpus. Deux
lots : partie 11 dès le cut 523 (pause « ESV lent » au cut 562, reprise,
arrêt de l'opérateur au 649) ; partie 15 dès le cut 1 (deux poses refusées,
cuts 1 et 104, « le clic n'a pas produit le déplacement demandé »).

Cause des refus : fenêtre d'ESV rétrécie (vue de 416 px, 0,96 mm par pixel)
et pose d'ESV au pixel entier du clic (KI-065). Analyse : banane,
`audit/terrain-4800-2026-09-28.md`.

## Écho de la partie 11 (08:03–08:20)

`relecture p11/Echo_1.ZIP.part001…006` (archive de l'opérateur, à recoller
dans l'ordre puis dézipper) : 21 fichiers, deux sessions. `13724db9` : une
visite, faux départ (08:02). **`1bf9fe0e`** : 299 visites, 260 cuts distincts
(471–815), 5 vidages automatiques et l'export final ; fusion complète (1 730
nuages déclarés, 0 manquant, aucun doublon) ; purge à chaque vidage égale
aux nuages confirmés écrits (correctif D01 vérifié sur le terrain) ; aucune
perte, aucune dégradation.

Contenu : relecture des deux lots Orbite de la partie 11 (4.7.20 du 26/09 et
4.8.0 du 28/09) et travail manuel sur les autres cuts (117 validations, dont
108 avec retouche ; 175 passages sans décision). Sur 69 des 117 cuts validés,
le geste humain sort de la fenêtre du moteur (±80 mm latéral, ±40 mm
vertical) : zones 696–716, 749–752, 758–770, 777–799, 807–815, où la pose de
départ d'ESV est décalée de 10 à 25 cm. Analyse : banane,
`audit/relecture-p11-2026-09-28.md`.

## Lot Orbite de la partie 15 (08:54–09:44)

`lot p15/LOT_15.7z.part001…003` (archive de l'opérateur, volumes 7z à recoller
dans l'ordre ; empreintes dans `SHA256SUMS`) : journal, diagnostic, bilan et
corpus (5 segments chacun). Lot `4788921e`, 4.8.0, partie 15 du cut 106 à la
fin de la partie : 251 cuts, 192 posés (76,5 %), 0 erreur d'ESV, 0 pause,
345 cuts/h ; vue d'ESV large (0,46 mm par pixel), écart pose/cible maximal
0,63 mm. Fin : ESV quitte la page après le différé de 9056 (dernier cut, sans
point LiDAR) ; Ariane met le lot en pause « navigation incertaine » (KI-067),
l'opérateur arrête. Pas de relecture Écho : C4 non évaluable. Analyse :
banane, `audit/lot-4800-p15-2026-09-28.md`.
