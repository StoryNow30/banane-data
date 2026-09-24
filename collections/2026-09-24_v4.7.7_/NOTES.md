# Collecte du 24/09/2026 matin — Banane 4.7.7, partie 30

Session Natif unique (`e77e894e…`) sur la **partie 30, jamais collectée** :
91 visites, 83 cuts distincts entre 2473 et 8755. Trois exports de l'opérateur
(segments auto 01–02 et export final 01), compressés en un `.7z` par Claude,
contenu inchangé (SHA-256 de chaque JSON dans `manifest.json`).

## Contrôles

- 1 064 nuages déclarés, tous présents après fusion (`tools/merge-segments.cjs`).
- 83 blocs d'observation « continuité » : 53 calculés, 28 sans ancre, 2 sans
  points.

## Résultats (dépôt `banane`, 24/09) — partie tenue à l'écart de tout réglage

| Mesure (règles du banc, D-038) | Résultat |
|---|---|
| Moteur depuis la pose ESV | 57 cuts appliqués sur 83 (68,7 %), 44 justes, 0 faux |
| **Décision sur le lot, deux passages** (`tools/lot-choice-study.cjs --variant B --chain guarded --sides both`) | **68 sur 83 (81,9 %), 50 justes, 0 faux** sur 57 jugés |
| Observation continuité jugée (`continuity-seed-study --mode observer`) | départ ESV 28 justes / 0 faux ; continuité 27 / 0 |
| Entrée moteur : banc contre pose ESV (`tools/cut-matrix.cjs`) | 69 contre 80 cuts ; 11 que le filtre du banc retirait |

Première partie neuve où la décision sur le lot dépasse 80 % des cuts
distincts, sans faux. Limite : banc Natif (capture avant le premier geste),
pas un lot Pilote.
