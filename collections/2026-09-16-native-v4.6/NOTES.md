# Collecte Natif V4.6 — 2026-09-16

Collecte terrain en mode Natif V4.6.

## Notes opérateur

- Collecte volontairement variée : placements et cas d'usage divers.
- Projet terrain comportant de nombreux cas de décorrélation de scan.
- Exemple visuel fourni séparément : un nuage bleu est décalé par rapport à deux autres acquisitions cohérentes ; la correction humaine place le champignon sur la géométrie cohérente portée par les deux autres acquisitions.
- Cette observation doit rester une annotation métier, pas une règle automatique « 2 contre 1 » sans validation statistique.

## Usage prévu

- qualification de la continuité et des segments Natif ;
- audit des références humaines réellement exploitables ;
- replay hors ligne des candidats exposés par le moteur ;
- analyse spécifique des décorrélations ;
- validation indépendante future de Pair Arbitration / Brain V2.

## Précautions

- Ne pas modifier l'archive brute après gel du SHA-256.
- Les corrections humaines sont des références à qualifier ; elles ne deviennent pas automatiquement des exemples d'entraînement.
- Les unités de scène ×10^-3 ne sont pas des millimètres sans calibration physique.
