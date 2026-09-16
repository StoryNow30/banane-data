# Banane Data Registry — Index

Ce dépôt privé centralise les métadonnées des collectes et benchmarks Banane. Les grosses archives restent hors Git classique et sont stockées comme assets de Release ou via Git LFS.

## Collectes terrain

| ID | Version | Date | Type | Statut | Archive |
|---|---|---|---|---|---|
| `2026-09-16-native-v4.6` | Banane 4.6.0 | 2026-09-16 | Natif terrain | archive initiale ingérée et auditée structurellement ; archive finale complémentaire enregistrée, audit structurel en attente ; qualification humaine et replay candidats en attente | Release `native-v4.6-2026-09-16` → `banane-native-v4.6-2026-09-16.7z` + `banane-native-v4.6-2026-09-16-final.7z` |

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
