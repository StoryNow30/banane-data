# Banane Data Registry

Index central des jeux de données et collectes utilisés par le projet Banane.

## Collections terrain

Aucune collection n'est encore enregistrée.

## Benchmarks gelés

- `pair-arbitration-benchmark-v1` — benchmark Pair Arbitration V1, 110 cuts, SHA-256 du `benchmark.json` : `3a700609dc264e2df8eae515ff9289a834c402023b4d80f222f32f60d0326ecf`.

## Règles

- Les données brutes sont immuables après enregistrement.
- Chaque archive doit avoir un SHA-256 vérifié.
- Les grosses archives ne sont pas commitées dans Git classique ; elles sont stockées comme assets de Release ou via LFS.
- Les analyses, sous-corpus et dérivés sont séparés des données brutes.
- Une réserve « no-tuning » ne doit pas être utilisée pour régler une politique.
- Ne stocker ici que des données dont l'externalisation vers GitHub privé est autorisée.
