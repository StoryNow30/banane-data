# Ariane 4.8.5 — candidat stable corrigé (29/09/2026, D-063)

`ariane-v4.8.5.zip`, SHA-256 dans `ariane-v4.8.5.zip.sha256`
(`cf4401bf003d3a3ba7902c65062b84ef9a853ff3a60f2e7f84f0c47ff304484d`,
1 109 303 octets), construit depuis `323356c` de `banane` (branche
`claude/friendly-gauss-1p9c6q`) par `git archive` + `tools/package.py` ;
**trois constructions identiques**. Manifeste `4.8.5`, nom « Ariane », titre
« Ouvrir Ariane 4.8.5 », sans `version_name` (comme la 4.8.0).

**Code** : celui du test 2 (`0d29e54`), à deux choses près : la version et le
nom (`5176887`), et un texte de fin de partie corrigé sur la relecture
indépendante de D-062 (`323356c`, texte seul) : partie supérieure affichée, M
connu, cut N ≠ M−1 → « la partie compte M cuts, son dernier cut est le M−1 ;
le cut N n'est pas le dernier. Rien n'est retenu », sans inviter à saisir N.

**Remplace le premier candidat** (`8911282`, `ac931b5d…`), qui n'a été ni
étiqueté ni publié. **Candidat seulement : ni merge, ni étiquette, ni
publication** sans le feu vert de la direction.

## Contrôles

- `node tools/verify.cjs` à 0 sur `323356c` : 972 essais, 0 échec, 2 ignorés
  (corpus natif absent du clone). Essai du texte corrigé rouge sans le
  correctif.
- Portes J1 (`tools/portes-j1.cjs`) sur `5176887` : toutes VERTES ; 633 cuts de
  validation inchangés ; 8 jeux : 707 et 711 refusés, 718 posé, 0 juste perdu.
  Elles valent pour `323356c` : `git diff` vide sur `src/lot-decision.js`,
  `src/engine.js` et `src/gauge.js` entre `5176887`, `8911282` et `323356c`
  (`banane/audit/portes-j1/README.md`).
- Cohabitation dans Chromium (`banane/tools/navigateur-cohabitation.cjs`,
  onglet ESV **synthétique**, aucun code ni contenu d'ESV) avec le paquet final
  4.8.0 (`essai-cohabitation-chromium-480.json`) : refus dans les deux
  ordres, chacune nomme l'autre ; aucune erreur de page.
- Cible de retour (4.8.0, `fabd77e`) reconstruite à l'identique :
  `38aa29a2…` (`RETOUR_ARRIERE.md`).

## Mesure

`banane/audit/rapport-sortie-4.8.5.md` : lots 25 et 33, **tous deux sous le
test 1** ; C1 85,2 % et 84,0 % ; C3 0 ; C4 sur la partie 25 : 2 faux sur 62
jugés, **validé sur l'expertise de la direction** sans mesure conforme à la
lettre (moins de 100 jugés, D-063). Le code de fin de partie du test 2
(D-062) n'a pas été exercé en réel. Problème connu accepté : KI-068.

## Installation

`banane/consignes/installation-4.8.5.md` : dans le dossier de la 4.8.0,
« Recharger », versions de test désactivées, F5 sur ESV.
