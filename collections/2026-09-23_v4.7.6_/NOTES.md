# Collecte du 23/09/2026 — Banane 4.7.6

Première collecte terrain de la 4.7.6 (calage de convention actif, flanc
partiel actif). Déposée par l'opérateur sur `main` (commit `02fbb58`), en deux
sous-dossiers :

- `pilote + corr/` — un lot **Pilote** sur la partie 19 (29 cuts), suivi de sa
  **relecture Natif** (174 visites, cuts 9019–9408) ;
- `session nativ/` — deux sessions **Natif** sur la partie 20 : une longue
  (343 visites, cuts 107–995) et une courte (56 visites, cuts 1099–1154).

Chaque `.7z` regroupe plusieurs exports JSON (segments auto et export final) ;
le détail, les tailles et les SHA-256 sont dans `manifest.json`.

## Contrôles

- Les 3 sessions Natif se reconstituent sans nuage manquant (1 103 + 3 046 + 575
  nuages déclarés, tous présents) après fusion par `tools/merge-segments.cjs`.
- Les segments auto répètent toutes les métadonnées de session : environ 83 %
  du volume décompressé (2,15 Go au total, 224 Mo compressés). À corriger côté
  extension (exports légers) ; aucune perte d'information.
- La session Natif longue fusionnée dépasse la taille maximale d'une chaîne
  JavaScript : la fusion se fait en mémoire, sans fichier intermédiaire.

## Exclusions opérateur

Les cuts **9033** et **9241** (partie 19) sont exclus du bilan à la demande de
l'opérateur : leur référence humaine repose sur une information que les
données ne contiennent pas.

## Résultats (dépôt `banane`, commit `8324e08`)

Détail : cahier 4.8, amendement n°6 ; `audit/brain-audit-2026-09-23.json` ;
`audit/continuity-guard-2026-09-23.json`.

- **Calage de convention validé sur 145 cuts inédits** de la partie 20 :
  latéral médian 2,8 → 1,3 mm, vertical 3,1 → 0,7 mm, biais d'écartement
  +4,9 → −0,2 mm (session longue) ; aucun cut rendu faux.
- **Pilote, partie 19** : 15 cuts appliqués sur 29 (52 %), 14 différés dont 12
  avec une pose ESV de départ à 20–47 mm de la pose humaine. Rejeu identique
  sur les 29 décisions. Cut **9047 suspect** (écartement 1 453,8 mm contre
  1 434,6 mm pour ses voisins), non relu.
- **Natif longue rejouée par le moteur 4.7.6** : 8 cuts appliqués faux sur 118
  jugés, dont 6 décalages communs des deux rails (117–273 mm) dans une zone en
  courbe où la pose ESV est à 100–260 mm de la pose humaine.

## Qualification

Références humaines : oracle hors ligne uniquement, non qualifiées comme vérité
d'entraînement.
