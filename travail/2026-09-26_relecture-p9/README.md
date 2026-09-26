# Relecture Natif de la partie 9 — scénarios (26/09/2026)

Synthèse : banane, `audit/relecture-p9-2026-09-26.md`. Données : extraire
`benchmarks/partie-9-2026-09-25/extraire.py DOSSIER` (lots 4.7.18 et 4.7.19,
relecture). Depuis la racine de `banane` (ou avec `BANANE=/chemin/vers/banane`),
environ 13 Go de mémoire.

- `scenarios.cjs DOSSIER/lot-4718 DOSSIER/relecture SORTIE.json` : lot 4.7.18
  rejoué aux règles 4.7.20, jugé par la relecture, sous six hypothèses (S0
  règles actuelles ; S1 voisins validés, garde livrée ; S1b voisins en dernier
  recours ; S2 vue corrigée ; S3, S3b combinaisons). 7 à 10 min ; seul le
  lot de la partie 9 est lu dans le diagnostic (`batchId` 09d3c4f0…). Sorties : `scenarios.json` (cut par cut), `scenarios.txt` (totaux).
- `corrections.cjs RELECTURE ACC-4718.json ACC-4719.json SORTIE.json` :
  ampleur des corrections de la relecture par classe de cut (hors lot,
  appliqué, différé) ; sortie `corrections.json`.

Partie 9 = validation : ces scénarios mesurent, ils ne règlent rien. S1b est
né de cette lecture ; il doit être confirmé ailleurs avant adoption.
