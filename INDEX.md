# Banane Data Registry — Index

Ce dépôt public centralise les collectes et benchmarks Banane. Depuis le 23/09/2026, les exports bruts sont déposés compressés (`.7z`) directement dans Git, dans le dossier `raw/` de leur collecte ; la collecte du 16/09 reste en asset de Release.

## Collectes terrain

| ID | Version | Date | Type | Statut | Archive |
|---|---|---|---|---|---|
| `2026-09-16-native-v4.6` | Banane 4.6.0 | 2026-09-16 | Natif terrain | ingérée, structure/segments/continuité/doublons vérifiés ; qualification humaine et replay candidats en attente | Release `native-v4.6-2026-09-16` → `banane-native-v4.6-2026-09-16.7z` |
| `2026-09-23_v4.7.6_` | Banane 4.7.6 | 2026-09-23 | Pilote p19 + relecture Natif ; Natif p20 (2 sessions) ; Natif p22 (logique opérateur) | ingérée, continuité vérifiée (0 nuage manquant), analysée (banane `8324e08`, amendement n°6) ; cuts 9033 et 9241 exclus par l'opérateur | Git, 10 archives `.7z` (225 Mo) — voir `manifest.json` |

## Benchmarks

| ID | Contenu | Statut |
|---|---|---|
| `pair-arbitration-benchmark-v1` | 110 cuts, 93 develop + 17 no-tuning holdout | gelé / référence indépendante |

## Règles

- Une archive brute est identifiée par son nom, sa taille et son SHA-256.
- Ne jamais modifier une archive brute après enregistrement de son SHA-256.
- Une transformation, fusion, extraction ou qualification produit un nouvel artefact avec son propre SHA-256.
- Une archive `.7z` de collecte est versionnée directement dans Git (100 Mo au plus par fichier) ; au-delà, découpage en volumes.
- Une correction humaine Natif doit être qualifiée avant tout usage comme vérité d'entraînement.
