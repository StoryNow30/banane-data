# Collecte du 24/09/2026 matin — Banane 4.7.8, partie 30

Première session Natif avec la 4.7.8 (`1cc1d5c5…`), contrôle d'installation :
12 visites, 10 cuts (9163–9172), 9 validations. Un export de l'opérateur,
compressé en `.7z` par Claude, contenu inchangé.

- 86 nuages déclarés, tous présents ; 8 observations « continuité » calculées.
- Trop court pour une mesure : décision sur le lot 40 % → 60 % des cuts, 0 faux
  sur 6 jugés.

## Lot Pilote 4.7.8, partie 31 (`pilote p31/`)

Archive de l'opérateur, inchangée : journal, diagnostic GCV1, corpus LiDAR,
bilan, et la courte session Natif ci-dessus. Partie 31 jamais collectée.
Lot arrêté à la main sur 5061 : le nuage ESV ne s'était pas chargé sur
plusieurs cuts (défaut d'ESV, l'opérateur rafraîchit la page ; KI-049).

| Cuts distincts : 51 (D-038) | Tous | Hors 5 cuts sans nuage ESV et cut d'arrêt (45) |
|---|---|---|
| Pilote, appliqués | 35 (68,6 %) | 35 (77,8 %) |
| Décision sur le lot (rejeu, `--decision-par-rejeu`) | 43 (84,3 %) | 43 (95,6 %) |

Paires refusées par l'écartement : 5 ; appliquées hors contrat : 0. Justesse
non mesurée avant la relecture. La décision sur le lot consignée par la 4.7.8
diffère du rejeu sur 6 cuts sur 50 : défaut KI-048 (choix par la voie privé de
sa grille dans l'extension), corrigé ensuite ; le rejeu fait foi.

## Relecture Natif du lot (`relecture p31/`)

183 visites, 171 cuts de la partie 31 (voisins ±5 compris), 79 validations,
1 709 nuages tous présents. Jugement (`tools/acceptance-report.cjs
--decision-par-rejeu`, relevé `audit/acceptance-p31-2026-09-24.json` du dépôt
banane) :

| | Cuts | Jugés | Faux |
|---|---|---|---|
| Pilote, appliqués | 35 / 51 | 9 (26 traversés sans Maj+Espace) | 0 |
| Décision sur le lot | 43 / 51 | 17 | 0 — les 8 cuts gagnés tous justes, 0,8 à 4,2 mm |
| + voisins déjà validés, garde de cohérence | 44 / 51 | 18 | 0 |

Hors les 5 cuts sans nuage ESV et le cut d'arrêt : 35, 43 et 44 cuts sur 45.
Erreur des rails appliqués jugés : latéral 1,1 / 5,6 mm, vertical 0,4 / 2,7 mm
(médiane / p90), P2 non mesuré.
