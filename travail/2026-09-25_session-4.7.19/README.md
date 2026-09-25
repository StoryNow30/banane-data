# Fichiers de travail — session 4.7.19 (25/09/2026)

Résultats intermédiaires de la conversation qui a produit la 4.7.19, conservés
pour la conversation suivante. Les chemins `/tmp/claude-0/…/scratchpad/` des
scripts désignent l'ancien espace de travail : les remplacer par un dossier
local où l'on a décompressé les archives de `collections/` (voir leurs
`manifest.json`).

- `banc-passage-niveau/` : banc du lecteur « passage à niveau »
  (`tools/choice-anchor-study.cjs`). `off-*` = lecteur coupé (4.7.18),
  `on-*` = lecteur en arbitre (écarté), `on4-*` = dernier recours (retenu).
  Jeux : a = Natif p24, p30, p2 7801 ; b = lots p31 ; c = lot p34 ;
  d = lots 4.7.18 p2 et p3. `cmp2.cjs` compare deux configurations.
  Synthèse : banane, `audit/passage-niveau-lecteur-2026-09-25.md`.
- `balayage-c5/` : balayages des curseurs de la décision sur le lot (C5).
  `appui-pose-*` = base 4.7.18 ; `gaugeGap5-a..d` faits ; `gaugeGap5-e`,
  `gaugeGap15`, `gaugeCount2`, `gaugeCount5` **à relancer** (`run11.sh`,
  sur un arbre au commit 244200d).
- `relevés/` : lecteur contre pose humaine (`natif3.json` = calage final,
  `err.cjs` = erreurs par décalage) ; rapport d'acceptation du lot p3 avec
  relecture (`acc-rel.*`) ; rejeu du lot p3 sous les règles 4.7.12/14/18
  (`regles.cjs`).
- `scripts/` : vérification avec pause des calculs de fond, test de fumée
  Chromium de la 4.7.19, relevé de taille des captures.
