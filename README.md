# banane-data

Dépôt de référence pour les données du projet Banane.

**Dépôt public, par choix du propriétaire** (confirmé le 23/09/2026) : tout ce qui est déposé ici est lisible par tous.

Ce dépôt est séparé de `StoryNow30/banane` : le dépôt `banane` contient le code, les tests et les rapports ; `banane-data` contient les registres, manifests, benchmarks gelés et références vers les grosses collectes terrain.

## Principes

1. Les exports bruts restent immuables.
2. Chaque archive enregistrée possède un SHA-256.
3. Les exports bruts sont déposés **compressés (`.7z`) directement dans Git**, dans le dossier `raw/` de leur collecte. Un export Natif se compresse d'un facteur 5 à 10. Les assets de Release ne sont plus utilisés pour les nouvelles collectes : ils ne sont pas téléchargeables depuis l'environnement de Claude Code. La collecte `2026-09-16-native-v4.6` garde son asset et sa matérialisation.
4. Les analyses et jeux dérivés sont versionnés séparément des données brutes.
5. Les références humaines servent d'oracle hors ligne uniquement quand leur qualification le permet ; elles ne doivent pas être utilisées comme feature d'une politique censée fonctionner avant correction humaine.
6. Les unités de scène ne sont jamais qualifiées de millimètres ou d'écartement physique sans calibration indépendante.
7. Le dépôt étant public, ne déposer ici que des données dont la publication est acceptée.

## Organisation

- `INDEX.md` : catalogue central.
- `collections/` : manifests et notes des collectes terrain.
- `benchmarks/` : benchmarks gelés et leurs métadonnées.
- `templates/` : modèles réutilisables pour enregistrer de nouvelles collectes.

Le fichier brut ou l'archive citée dans un manifest est identifié par son nom, sa taille et son SHA-256 ; ce triplet fait foi pour éviter qu'un modèle d'IA travaille sur une copie différente.

## Déposer une nouvelle collecte

1. Compresser chaque export en `.7z` sans le modifier : un export, une archive.
2. Créer le dossier `collections/YYYY-MM-DD_vX.Y.Z_alias/raw/` et y déposer les
   archives. Par le site GitHub (*Add file* → *Upload files*) : **25 Mo au plus
   par fichier**, 100 fichiers par envoi. Une archive plus grosse est découpée
   en volumes de 24 Mo (7-Zip : « Découper en volumes »). En ligne de
   commande : 100 Mo au plus par fichier, alerte GitHub au-delà de 50 Mo.
3. Demander à Claude d'écrire `manifest.json` (nom, taille, SHA-256, version,
   parties, cuts) et `NOTES.md`, et d'ajouter la collecte à `INDEX.md`.
