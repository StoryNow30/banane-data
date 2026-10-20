# Collecte 2026-10-20_v4.9.5.13_echo-partie-17

Ariane 4.9.5.13 (test 13), **Écho de la partie 17** (projet à confirmer par Mic : second projet probable), 20 octobre 2026, de 8 h 28 à 8 h 32 (heure de Paris) : **55 visites** (45 complètes, 10 partielles), 642 objets LiDAR, 3 277 événements. Session Écho terminée (état FINISHED, reprise de page à 8 h 32). C'est la correction, par Mic, des cuts posés la veille (lot Orbite de la partie 17 dans `2026-10-19_v4.9.5.8_partie-17-lot-15h51`).

Cuts visités, dans l'ordre : 9520 à 9530, 9545, 9549 à 9558, 9604, 9624 à 9626, 9638 à 9655, 9687 à 9689, 9753 à 9755, 9790, 9800, 9803, 9815, 9843.

Départ de la partie 17 vu par l'Écho à 8 h 28 : 9 801 validés, 41 invalides, total 9 844. Liste d'ESV relue (9 844 lignes) : **aucun cut mémorisé d'Ariane pour cette partie** (la liste ne sert donc pas ici de vérité de comparaison).

Export envoyé et archivé le 20/10/2026 (heures de Paris), **tel qu'envoyé** (3 zips d'origine, préfixe de téléversement retiré du nom). Les empreintes sont dans `SHA256SUMS` ; chaque copie a la même empreinte que l'original téléversé, et le CRC de chaque zip est valide (`python3 -I -m zipfile -t`). Les trois zips se complètent : segment automatique de 8 h 30 (24 visites), segments 2 et 3 du vidage de 8 h 32 min 07 s (50 visites), export final de 8 h 32 min 53 s (55 visites, qui porte l'instantané complet des visites et des événements). Fusion contrôlée avec `tools/merge-segments.cjs` : 642 nuages déclarés, 0 manquant, 838 210 points, 55 records.

Contrôle d'identité avant dépôt (tout le contenu des zips) : **0 courriel, 0 adresse web, 0 identifiant de projet ESV, 0 nom d'opérateur**. Les identifiants UUID présents sont ceux des visites, des nuages et de la session d'Ariane.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo p17 08h28` | 3 zips (segment automatique 8 h 30, vidage 8 h 32 min 07 s, export final 8 h 32 min 53 s), `SHA256SUMS` | 16,6 Mo (16 647 100 octets) |

Chaque zip contient aussi l'instantané de la liste d'ESV (`ariane-liste-partie17-20261020-062833Z.json`) et un `CONTENU.txt`.
