# Banane Data Registry — Index

Ce dépôt public centralise les collectes et benchmarks Banane. Depuis le 23/09/2026, les exports bruts sont déposés compressés (`.7z`) directement dans Git, dans le dossier `raw/` de leur collecte ; la collecte du 16/09 reste en asset de Release.

## Collectes terrain

| ID | Version | Date | Type | Statut | Archive |
|---|---|---|---|---|---|
| `2026-09-16-native-v4.6` | Banane 4.6.0 | 2026-09-16 | Natif terrain | ingérée, structure/segments/continuité/doublons vérifiés ; qualification humaine et replay candidats en attente | Release `native-v4.6-2026-09-16` → `banane-native-v4.6-2026-09-16.7z` |
| `2026-09-23_v4.7.6_` | Banane 4.7.6 | 2026-09-23 | Pilote p19 + relecture Natif ; Natif p20 (2 sessions) ; Natif p22 (logique opérateur) | ingérée, continuité vérifiée (0 nuage manquant), analysée (banane `8324e08`, amendement n°6) ; cuts 9033 et 9241 exclus par l'opérateur | Git, 10 archives `.7z` (225 Mo) — voir `manifest.json` |
| `2026-09-23_v4.7.7_` | Banane 4.7.7 | 2026-09-23 | Natif p24 (observation continuité) | ingérée, continuité vérifiée (0 nuage manquant), parité 176/176, analysée (amendement n°8) | Git, 2 archives `.7z` (25 Mo) — voir `manifest.json` |
| `2026-09-24_v4.7.7_` | Banane 4.7.7 | 2026-09-24 | Natif p30, partie neuve (observation continuité) | ingérée, 0 nuage manquant, analysée : décision sur le lot 81,9 % des cuts distincts, 0 faux | Git, 1 archive `.7z` (7,6 Mo) — voir `manifest.json` |
| `2026-09-24_v4.7.8_` | Banane 4.7.8 | 2026-09-24 | Natif p30 (contrôle) ; **Pilote p31** (51 cuts) et sa **relecture** | ingérée, jugée : Pilote 35/51, décision sur le lot 43/51 (0 faux / 17 jugés), + appuis validés 44/51 (0 / 18) | Git, 3 archives `.7z` — voir `manifest.json` |
| `2026-09-24_v4.7.14_` | Banane 4.7.14 | 2026-09-24 | **Pilote p2** (3 lots, cuts 20–138) + relecture Natif ciblée (110–138) + capture ESV | analysée ; décalage de ~200 mm de la pose ESV ; **2 faux / 11 jugés** (114 à 207,6 mm, 137) ; 4.7.15 différerait 114 | Git, 2 morceaux de 7z — voir `manifest.json` |
| `2026-09-25_v4.7.18_` | Banane 4.7.18 | 2026-09-25 | **Pilote p2, reliquat** (30 cuts non validés, 768–4703) + relecture Natif ; **Pilote p3, reliquat « long »** (82 cuts, 0–7654, arrêté par KI-059) + relecture Natif ; **Pilote p9, lot long** (346 cuts, 0–8539, sans relecture) | analysée ; p2 : passage à niveau 768–778, 16/30 appliqués, **2 faux / 12 jugés** (772, 773), parité 30/30 ; p3 : 49/82 appliqués, **0 faux / 48 jugés**, mêmes décisions sous les règles 4.7.12/4.7.14 ; passage à niveau 5377–5384 différé en entier (décidé au rejeu 4.7.19) ; p9 : 262/346 appliqués, parité 346/346, +12 au rejeu 4.7.19, fin 8504–8539 hors vue (KI-051) | Git, zip + 7z — voir `manifest.json` |
| `2026-09-24_v4.7.12_` | Banane 4.7.12 | 2026-09-24 | **Pilote p35** (partie jamais vue) | ingérée ; **203/233 (87,1 %)**, 32 par la décision sur le lot, 0 erreur ; pas de relecture (non enregistrée) | Git, 6 morceaux de zip — voir `manifest.json` |
| `2026-09-24_v4.7.11_` | Banane 4.7.11 | 2026-09-24 | **Pilote p34** (partie jamais vue) + relecture Natif | analysée ; 73/96 (76 %), **1 faux / 71** (1834, arrêté par la garde 4.7.12) | Git, 6 archives `.7z` (lot, relecture) — voir `manifest.json` |
| `2026-09-24_v4.7.10_` | Banane 4.7.10 | 2026-09-24 | **Pilote p33**, 2 lots (décision sur le lot appliquée) | ingérée ; lot 1 : 20 traités, arrêt 8089 (KI-051) ; lot 2 : 65/83, 18 différés (vue d'ESV) ; relecture à venir | Git, 3 archives `.7z` — voir `manifest.json` |
| `2026-09-24_v4.7.9_` | Banane 4.7.9 | 2026-09-24 | **Pilote p31, fin** (78 cuts, nuage saccadé) + relecture Natif | analysée ; Pilote 47/78, 0 faux / 45 ; décision sur le lot 72/78, **1 faux / 69** (7026) | Git, 4 archives `.7z` (lot, journal, relecture) — voir `manifest.json` |

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
