# Collecte du 23/09/2026 après-midi — Banane 4.7.7

Première collecte de la 4.7.7 : en Natif, Banane calcule et consigne, à la fin
de chaque première visite, la pose que GCV1 aurait proposée en partant des cuts
voisins déjà validés (`continuityObservation`), sans l'appliquer ni l'afficher.

Session unique (`d8cb68af…`), partie 24 : 210 visites, 176 cuts en 20 séries
de 3 à 27 cuts, réparties de 764 à 8457, chacune commencée quelques cuts avant
sa zone. Deux archives de l'opérateur, inchangées (`session nativ/`) : segments
automatiques 01 à 06 et export final ; tailles et SHA-256 dans `manifest.json`.

## Contrôles

- 2 037 nuages déclarés, tous présents après fusion.
- 176 blocs d'observation sur 176 premières visites ; parité hors ligne 176/176.
- Santé de collecte : 0 événement perdu, file au plus à 24, niveau complet.

## Résultats (dépôt `banane`, amendement n°8)

| 105 cuts jugés | Justes | Faux | Refus d'écartement |
|---|---|---|---|
| Départ depuis la pose ESV | 59 | 0 | 17 |
| Départ par continuité | 68 | 0 | 7 |

Temps moteur dans le service worker : 255 ms médian. Règle d'arrêt non
déclenchée.

## Qualification

Références humaines : oracle hors ligne uniquement, non qualifiées comme vérité
d'entraînement.
