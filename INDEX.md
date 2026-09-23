# Banane Data Registry — Index

Ce dépôt public centralise les collectes et benchmarks Banane. Depuis le 23/09/2026, les exports bruts sont déposés compressés (`.7z`) directement dans Git, dans le dossier `raw/` de leur collecte ; la collecte du 16/09 reste en asset de Release.

## Collectes terrain

| ID | Version | Date | Type | Statut | Archive |
|---|---|---|---|---|---|
| `2026-09-16-native-v4.6` | Banane 4.6.0 | 2026-09-16 | Natif terrain | ingérée, structure/segments/continuité/doublons vérifiés ; qualification humaine et replay candidats en attente | Release `native-v4.6-2026-09-16` → `banane-native-v4.6-2026-09-16.7z` |

## Benchmarks

| ID | Contenu | Statut |
|---|---|---|
| `pair-arbitration-benchmark-v1` | 110 cuts, 93 develop + 17 no-tuning holdout | gelé / référence indépendante |

## Règles

- Une archive brute est identifiée par son nom, sa taille et son SHA-256.
- Ne jamais modifier une archive brute après enregistrement de son SHA-256.
- Une transformation, fusion, extraction ou qualification produit un nouvel artefact avec son propre SHA-256.
- Les grosses archives ne doivent pas être ajoutées comme blobs Git ordinaires.
- Une correction humaine Natif doit être qualifiée avant tout usage comme vérité d'entraînement.
