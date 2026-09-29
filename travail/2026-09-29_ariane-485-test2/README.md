# Ariane 4.8.5 TEST — paquet test 2 (29/09/2026, D-062)

`ariane-4.8.5-test.2.zip`, SHA-256 dans `ariane-4.8.5-test.2.zip.sha256`
(`3b65f1d0…`), construit depuis `0d29e54` de `banane` (branche
`claude/friendly-gauss-1p9c6q`) par `git archive` + `tools/package.py` ;
deux constructions identiques. Manifeste `4.8.5.2`, nom « Ariane 4.8.5
TEST », affiché « 4.8.5 test 2 ». Applique la décision D-062 de la direction.
Le paquet test 1 (`../2026-09-29_ariane-485-test1/`, `0e7c8f8a…`) n'est pas
modifié. Version de test : ni merge, ni étiquette, ni publication.

## Pour toi (10 lignes)

1. Installe-la comme le test 1 (nouveau dossier, « Charger l'extension
   décompressée ») ; une seule Ariane active à la fois (4.8.0, test 1, test 2).
2. **Fin de partie** : à la reprise, le lot se ferme toujours. La fin n'est
   retenue que si ESV montre une partie supérieure et que le cut est le
   dernier (M−1, M lu dans « N on M treated »).
3. Sinon : « le cut N pourrait être le dernier de la partie ; saisis-le comme
   dernier cut si tu veux le retenir ».
4. **Autre Ariane pendant une pose** : la pose se termine, la validation est
   refusée, le lot se met en pause.
5. Dans ce cas, **contrôle la pose dans ESV avant tout F5** (valide-la toi-même
   si elle est juste), puis désactive l'autre Ariane, F5, « Archiver le
   résultat interrompu ».
6. Garde d'écartement bas inchangée : pose et valide chaque « refusé
   (écartement bas) » à la relecture Écho.
7. Rien à faire pour le relevé passif : il lit aussi un éventuel « M cuts »
   (dis-moi si ESV affiche un tel texte, et où).
8. Lot J2 sur une partie neuve, puis relecture : `consignes/operateur-suite.md`,
   étape 6.
9. Fin : **Tout télécharger pour l'analyse**, avant de revenir à la 4.8.0.
10. Retour à la stable : désactive « Ariane 4.8.5 TEST », active « Ariane », F5.

## Contrôles

- `node tools/verify.cjs` à 0 sur `0d29e54` : 972 essais, 0 échec, 2 ignorés
  (corpus natif absent du clone).
- Portes J1 (`tools/portes-j1.cjs`) sur `0d29e54` : toutes VERTES ; 633 cuts de
  validation inchangés ; 8 jeux : 707 et 711 refusés, 718 posé, 0 juste perdu.
- Revue de code du diff du test 2 (`0799841..0d29e54`) : constats corrigés
  dans `0d29e54` (`CHANGELOG.md`, section « 4.8.5 test 2 »).
- **Cohabitation dans Chromium** (`banane/tools/navigateur-cohabitation.cjs`,
  onglet ESV **synthétique**, aucun code ni contenu d'ESV) :
  - avec le paquet final 4.8.0 (`essai-cohabitation-chromium-480.json`) :
    refus dans les deux ordres ; le test 2 reste maître de l'onglet ;
  - avec le paquet test 1 (`essai-cohabitation-chromium-test1.json`) : idem,
    chacune nomme l'autre (« 4.8.5 test 1 », « 4.8.5 test 2 »).
  Aucune erreur de page. « Ouvre une coupe dans ESV 3D » : attendu sur cette
  page sans vue 3D.
- Essais nouveaux : fin de partie selon D-062 (b), 12 cas ; mise en sécurité
  pendant une pose (pose suspendue entre les deux clics), 3 cas ; P2 :
  entrelacement de deux installations (20 ordres, 6 entrelacements distincts)
  et reprise complète intrusion → F5 → reprise.
