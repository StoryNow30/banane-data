# Scripts d'analyse — partie 9 (25/09/2026)

À lancer depuis la racine de `banane` (ou avec `BANANE=/chemin/vers/banane`),
sur le dossier `lot-4718` produit par
`benchmarks/partie-9-2026-09-25/extraire.py`. Compter environ 20 s et 12 Go
de mémoire (`node --max-old-space-size=12000`).

- `cmp.cjs DOSSIER SORTIE.json` : partie 9 rejouée seule, en mode
  « appliquer », règles 4.7.18 puis 4.7.19 ; parité avec le terrain, décisions
  cut par cut.
- `reprise.cjs DOSSIER` : Reprise des différés simulée dans la même page
  (appuis posés à 8 cuts au plus d'un différé), règles 4.7.19.
- `off.cjs DOSSIER DEBUT FIN` : écart entre la pose de départ d'ESV et la
  position décidée (fin de partie hors vue, KI-051).
- `view.cjs DOSSIER DEBUT FIN` : cuts « hors-vue » et position des rails dans
  la vue.

Synthèse : banane, `audit/lot-4718-p9-2026-09-25.md` et
`audit/lot-4719-p9-2026-09-25.md`.
