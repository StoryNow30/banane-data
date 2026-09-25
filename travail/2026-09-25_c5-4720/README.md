# Balayage C5 — règles 4.7.20 (25/09/2026)

Bilan : banane, `audit/curseurs-c5-4720-2026-09-25.md` (D-055).

- `setup.py DOSSIER` : extrait des collectes les jeux du banc « passage à
  niveau » (D-053) : Natif p24, p30, p2 7801 ; lots p31 (4.7.8, 4.7.9), p34
  (4.7.11), p2 et p3 (4.7.18), avec leurs relectures. La partie 9 n'y est pas
  (partie de validation).
- `run.sh RACINE` (depuis la racine de banane, ou `BANANE=…`) : base puis un
  réglage à la fois (`gaugeGap` 5/15, `gaugeCount` 2/5, `crossingVoieMm`
  5/15), jeux a à d, avec `tools/choice-anchor-study.cjs` ; une sortie écrite
  n'est pas refaite. Environ 8 minutes par réglage.
- `agg.cjs SORTIES [bilan.json]` : décidés, jugés, faux, cuts gagnés ou perdus
  par réglage (`bilan.json`).
- `filtre-lot.cjs SOURCE DEST BATCH` : copie de travail d'un lot sans journal,
  diagnostic réduit à un lot (rapports d'acceptation des parties 3 et 9).
