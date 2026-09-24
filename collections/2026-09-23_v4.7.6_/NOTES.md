# Collecte du 23/09/2026 — Banane 4.7.6

Première collecte terrain de la 4.7.6 (calage de convention actif, flanc
partiel actif). Déposée par l'opérateur sur `main` (commit `02fbb58`), en deux
sous-dossiers :

- `pilote + corr/` — un lot **Pilote** sur la partie 19 (29 cuts), suivi de sa
  **relecture Natif** (174 visites, cuts 9019–9408) ;
- `session nativ/` — deux sessions **Natif** sur la partie 20 : une longue
  (343 visites, cuts 107–995) et une courte (56 visites, cuts 1099–1154) ;
- `natif p22 logique operateur/` — un court export **Natif** sur la partie 22
  (cuts 1196–1205), transmis par la conversation et compressé par Claude :
  l'opérateur y place chaque champignon en s'aidant de l'écartement des cuts
  précédents (voir plus bas).

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
  où la pose ESV de départ met le rail le plus décalé à 33–47 mm de la pose
  humaine, l'autre à 0–34 mm (corrigé le 24/09 : « 20–47 mm » mêlait les deux
  rails). Rejeu identique
  sur les 29 décisions. Cut **9047 suspect** (écartement 1 453,8 mm contre
  1 434,6 mm pour ses voisins), non relu.
- **Natif longue rejouée par le moteur 4.7.6** : 8 cuts appliqués faux sur 118
  jugés, dont 6 décalages communs des deux rails (117–273 mm) dans une zone en
  courbe où la pose ESV est à 100–260 mm de la pose humaine.

## Logique opérateur (partie 22)

Zone où chaque rail a un second champignon à 8–16 cm (contre-rail ou appareil
de voie). La pose ESV de départ est un gabarit à 1 500 mm, à 156–272 mm des
rails. L'opérateur pose le rail gauche puis le rail droit (deux clics, 5 à 6 s
par cut) ; le second clic tombe à un écartement proche du cut précédent. Au cut
1203, un premier clic à 1 321 mm (−120 mm par rapport au voisin) révèle le
mauvais champignon : l'opérateur essaie les autres et retient 1 437,8 mm
(voisin : 1 441,2). Le réglage fin suit ensuite les points (1205 : 1 440 →
1 426 mm). Fin de session : retours 1204 → 1203 → 1202 → 1203 → 1204 → 1205 pour
vérifier la continuité.

Mesure hors ligne (dépôt `banane`, amendement n°7, §7.8 — chiffres corrigés
après une relecture indépendante ; la première version, « 161/11 → 192/3 » et
« les 9 faux de la courbe deviennent justes », était fausse) : partir de la
droite des deux derniers cuts validés au lieu de la pose ESV fait passer le
moteur de 0 à 4 cuts justes sur cette partie, avec 2 erreurs marginales (11,3
et 11,5 mm) ; sur les 252 cuts jugés du 23/09, de 118 justes et 6 faux à 141
justes et 3 faux. Les 5 cuts faux de la courbe de la partie 20 deviennent
justes.

## Qualification

Références humaines : oracle hors ligne uniquement, non qualifiées comme vérité
d'entraînement.
