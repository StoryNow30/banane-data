# Collecte Natif V4.6 — 2026-09-16

Collecte terrain en mode Natif V4.6.

## Notes opérateur

- Collecte volontairement variée : placements et cas d'usage divers.
- Projet terrain comportant de nombreux cas de décorrélation de scan.
- Exemple visuel fourni séparément : un nuage bleu est décalé par rapport à deux autres acquisitions cohérentes ; la correction humaine place le champignon sur la géométrie cohérente portée par les deux autres acquisitions.
- Cette observation doit rester une annotation métier, pas une règle automatique « 2 contre 1 » sans validation statistique.

## Archives enregistrées

- Archive initiale : `banane-native-v4.6-2026-09-16.7z`, 34 509 008 octets, SHA-256 `32e48aa79de988ab8bb6efc65d7038d4e27535e2a5f2486768438616f518bfc0`.
- Archive finale complémentaire : `banane-native-v4.6-2026-09-16-final.7z`, 56 657 500 octets, SHA-256 `7cac220bd6e097f14ff1d39cbc431e7c6e918b819bdf521883bc33847ec12c66`.
- Les deux assets sont enregistrés dans la même Release `native-v4.6-2026-09-16`.
- Les deux archives ont désormais fait l'objet d'un audit structurel distinct. Les compteurs détaillés de l'archive finale sont conservés dans `audit/final-archive-structural-audit.md` et ne sont pas confondus avec ceux de l'archive initiale.
- Une session de l'archive finale (`0c58c033-f2e7-4aa5-ad8c-80b081a83932`) signale 65 événements perdus après son dernier snapshot explicitement sans perte. Sa tranche tardive doit être isolée pour les analyses causales strictes.

## Usage prévu

- qualification de la continuité et des segments Natif ;
- audit des références humaines réellement exploitables ;
- replay hors ligne des candidats exposés par le moteur ;
- analyse spécifique des décorrélations ;
- validation indépendante future de Pair Arbitration / Brain V2.

## Précautions

- Ne pas modifier une archive brute après gel du SHA-256.
- Les corrections humaines sont des références à qualifier ; elles ne deviennent pas automatiquement des exemples d'entraînement.
- Les unités de scène ×10^-3 ne sont pas des millimètres sans calibration physique.
