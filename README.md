# banane-data

Dépôt privé de référence pour les données du projet Banane.

Ce dépôt est séparé de `StoryNow30/banane` : le dépôt `banane` contient le code, les tests et les rapports ; `banane-data` contient les registres, manifests, benchmarks gelés et références vers les grosses collectes terrain.

## Principes

1. Les exports bruts restent immuables.
2. Chaque archive enregistrée possède un SHA-256.
3. Les grosses archives (`.7z`, `.zip`) ne sont pas stockées dans Git classique. Elles doivent être placées comme assets de Release ou, si nécessaire, sous Git LFS.
4. Les analyses et jeux dérivés sont versionnés séparément des données brutes.
5. Les références humaines servent d'oracle hors ligne uniquement quand leur qualification le permet ; elles ne doivent pas être utilisées comme feature d'une politique censée fonctionner avant correction humaine.
6. Les unités de scène ne sont jamais qualifiées de millimètres ou d'écartement physique sans calibration indépendante.
7. Ne déposer ici que des données dont le stockage sur un service cloud externe privé est autorisé.

## Organisation

- `INDEX.md` : catalogue central.
- `collections/` : manifests et notes des collectes terrain.
- `benchmarks/` : benchmarks gelés et leurs métadonnées.
- `templates/` : modèles réutilisables pour enregistrer de nouvelles collectes.

Le fichier brut ou l'archive citée dans un manifest est identifié par son nom, sa taille et son SHA-256 ; ce triplet fait foi pour éviter qu'un modèle d'IA travaille sur une copie différente.
