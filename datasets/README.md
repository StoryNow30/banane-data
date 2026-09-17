# Materialized datasets

Ce dossier contient des vues **décompressées et directement lisibles par les agents** des collectes conservées comme assets de Release.

Principes :

- les archives `.7z` de Release restent la source brute immuable et font foi par nom, taille et SHA-256 ;
- la vue matérialisée est destinée au développement, à l'audit et au replay hors ligne ;
- un JSON de petite taille est conservé octet pour octet ;
- un JSON volumineux est découpé en shards JSON valides d'au plus quelques MiB, avec un `_index.json` permettant sa reconstruction sémantique ;
- aucun fichier matérialisé ne doit dépasser 8 MiB, afin de rester facilement lisible par GitHub et les environnements d'agents ;
- les fichiers non JSON restent référencés par le manifest mais ne sont pas transformés silencieusement.

Le dataset `native-v4.6-2026-09-16` provient exclusivement des deux assets de la Release `native-v4.6-2026-09-16` :

- `banane-native-v4.6-2026-09-16.7z` — 34 509 008 octets — SHA-256 `32e48aa79de988ab8bb6efc65d7038d4e27535e2a5f2486768438616f518bfc0`
- `banane-native-v4.6-2026-09-16-final.7z` — 56 657 500 octets — SHA-256 `7cac220bd6e097f14ff1d39cbc431e7c6e918b819bdf521883bc33847ec12c66`

Outils :

- `tools/materialize_release_dataset.py` crée la vue matérialisée depuis les répertoires extraits ;
- `tools/reconstruct_materialized_json.py` reconstruit un JSON sharded à partir de son `_index.json`.

Cette vue ne remplace pas les archives brutes et ne doit pas être présentée comme une nouvelle collecte.
