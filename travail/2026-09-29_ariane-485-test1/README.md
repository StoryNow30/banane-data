# Ariane 4.8.5 TEST — paquet test 1 (29/09/2026)

`ariane-4.8.5-test.1.zip`, SHA-256 dans `ariane-4.8.5-test.1.zip.sha256`
(`0e7c8f8a…`), construit depuis `36b8242` de `banane` (branche
`claude/friendly-gauss-1p9c6q`) par `git archive` + `tools/package.py` ;
deux constructions identiques. Manifeste `4.8.5.1`, nom « Ariane 4.8.5
TEST », affiché « 4.8.5 test 1 ». Version de test : ni merge, ni étiquette,
ni publication.

## Pour toi (10 lignes)

1. Installe-la **à côté** de la 4.8.0 (nouveau dossier, « Charger
   l'extension décompressée ») ; une seule Ariane active à la fois.
2. Deux actives dans l'onglet : la seconde refuse de se connecter et nomme
   l'autre ; désactive-la, F5.
3. « Ariane 4.8.5 test 1 **en sécurité** » : l'autre a tenté de commander
   l'onglet ; désactive-la, F5, Reprendre.
4. **Garde d'écartement bas** : un premier passage sans appui sous 1 420 mm
   est différé ; la tuile Différés dit « refusés (écartement bas) : … ».
5. À la relecture Écho, **pose et valide chacun de ces refus** : c'est la
   mesure de la garde.
6. **Fin de partie** : « fin de partie probable : clique sur Reprendre » ; si
   ESV montre la partie suivante, le lot se clôt seul.
7. Rien de nouveau à faire pour le relevé passif (compteur « N on M », objets
   rail) : il part dans le journal, exporte-le avec le lot.
8. Lot J2 sur une partie neuve, puis relecture : `consignes/operateur-suite.md`,
   étape 6.
9. Fin : **Tout télécharger pour l'analyse**, avant de revenir à la 4.8.0.
10. Retour à la stable : désactive « Ariane 4.8.5 TEST », active « Ariane », F5.

## Contrôles

- `node tools/verify.cjs` à 0 sur `36b8242` : 954 essais, 0 échec, 2 ignorés
  (corpus natif absent du clone).
- Portes J1 (`tools/portes-j1.cjs`) sur `36b8242` : toutes VERTES ; 633 cuts de
  validation inchangés ; 8 jeux : 707 et 711 refusés, 718 posé, 0 juste perdu.
- Revue de code sur tout le diff 4.8.5 (après celle de chaque chantier) :
  constats corrigés ou écrits (`CHANGELOG.md`, section « Revue de tout le
  diff 4.8.5 »).
- **Cohabitation dans Chromium** (`essai-cohabitation-chromium.json`,
  `banane/tools/navigateur-cohabitation.cjs`) : ce paquet et le paquet final
  4.8.0 chargés ensemble, onglet ESV **synthétique** (aucun code ni contenu
  d'ESV). 4.8.0 d'abord : la 4.8.5 refuse avant toute injection (« Une autre
  Ariane (4.8.0) est active… ») ; 4.8.5 d'abord : son adaptateur refuse la
  4.8.0 (« Une autre Ariane (4.8.5 test 1) est active… ») et la 4.8.5 reste
  maîtresse de l'onglet, sans mise en sécurité. Aucune erreur de page.
  « Ouvre une coupe dans ESV 3D » : attendu sur cette page sans vue 3D.
