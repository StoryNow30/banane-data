# Scripts d'analyse des lots et des Échos (test 21 à test 23)

Scripts écrits par les agents d'analyse du 26/10/2026, sauvés ici pour ne pas être perdus avec l'espace de travail éphémère. Chaque dossier porte le rapport (`RAPPORT.md`) et les scripts (`scripts/`) d'une analyse :

- `p15` : lot et Écho de la partie 15 (méthode de référence : partie A le lot, partie B jugement contre l'Écho).
- `p1617` : parties 16 et 17.
- `p182019` : parties 18, 19 (sans Écho), 20 ; différés et garde A.
- `p01` : parties 0 et 1, périmètre restreint aux différés ; comparaison passe / garde A / pose finale.

Ils lisent les zips des collections voisines (`collections/`) et ne modifient rien. À consolider en un seul outil (`juger-lot`) qui sort le tableau standard : jugés, > 20 mm, > 50 mm, mauvaise voie, différés, « poserait », garde. Tant que ce n'est pas fait, `p01/scripts` est la version la plus complète.
