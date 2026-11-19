# CH-139 — lot A1 : « la deuxième passe ne pose plus sur branche » (mesure, 19/11/2026)

Mesure seule, aucun comportement livré ne change : le dépôt `banane` n'est pas modifié ; la variante est un
patch appliqué à une **copie hors dépôt** du code (méthode du banc de CH-116, `banc.cjs --patch`), derrière le
levier `BANC_PASSE_SANS_BRANCHE=1`, **éteint par défaut** (patch sans la variable = rejeu octet à octet identique
au livré, vérifié sur 0811a, 116 cuts).

## Question
Que donnerait « la deuxième passe ne pose plus quand son motif est `branche` » sur les 4 016 cuts du corpus de
CH-116 (24 lots-parties) ? Définition mesurée : dans la boucle de la passe du banc, une décision `valider` de
motif `branche` est traitée comme « rien » : le cut reste différé, sans commande, sans garde des appuis, sans
transport (voisin des poses suivantes), sans place au plafond de 10 ; la passe suivante peut le redécider.
La première passe (GCV2 sur les différés, qui produit aussi le motif `branche`) n'est pas touchée.

## Rejouer en trois commandes
Prérequis (une fois) : le dossier de travail `CH116_TRAVAIL` (défaut `/home/opencode/.ariane/tmp-CH-139/travail`),
préparé depuis `banane` et `banane-data` :
```
DONNEES=<clone banane-data> CH116_TRAVAIL=<T> bash chantiers/CH-116/outils/extraire.sh
CH116_TRAVAIL=<T> node --max-old-space-size=8192 chantiers/CH-116/outils/preparer.cjs --effacer-segments
git -C <banane-data> show HEAD:outils/analyse-lots/CH-116/sorties/corpus.jsonl > <T>/corpus.jsonl
```
(les collections `2026-11-04_v5_lot-orbite-parties-6-15-et-echo`, `2026-11-11_v14_constellation-15-17`,
`2026-11-12_v15_constellations-21-23_0-4` doivent être matérialisées : `git sparse-checkout add …` ;
les examens vierges ne sont ni extraits ni lus.)

Puis, depuis n'importe quel dossier :
```
CH116_TRAVAIL=<T> bash outils/analyse-lots/CH-139/rejeux.sh <dossier banane>        # les 3 rejeux du livré d'aujourd'hui (~17 min chacun, 3 tâches)
CH116_TRAVAIL=<T> bash outils/analyse-lots/CH-139/rejeux-v18.sh <dossier banane>    # les 3 mêmes, écriture de la passe d'avant D-363 (contrôle publié)
CH116_TRAVAIL=<T> node outils/analyse-lots/CH-139/mesure.cjs --noms ch139-livre-zjp,ch139-N-zjp,ch139-sans-branche,ch139-livre-zjp-v18,ch139-N-zjp-v18,ch139-sans-branche-v18 --avant ch139-N-zjp --apres ch139-sans-branche --sortie outils/analyse-lots/CH-139/sorties
```
**Pourquoi deux jeux de rejeux.** Les chiffres publiés le 14/11 (D-357 : 571 → 603 différés, 29 → 0, 501 → 503)
l'ont été avec l'écriture de la passe d'alors : **arrêt au premier refus visible** (cible hors de la vue).
D-363 (17/11, Vision 19) a changé cela : un refus avant écriture n'arrête plus la passe, il prend sa place
parmi les 10. Le banc actuel rejoue D-363 ; `rejeux.sh` mesure donc le livré d'aujourd'hui (564 → 596 différés,
29 → 0, 506 → 508 : 7 poses de la passe écrites en plus, mêmes décisions). `rejeux-v18.sh` restaure l'ancienne
écriture (patch `plafond-arret-v18.patch`, copie hors dépôt) et reproduit les quatre chiffres publiés à l'identique.
`verifie-plafond-v18.cjs <nom>` recalcule hors ligne l'ancien plafond sur un rejeu actuel (contrôle croisé :
mêmes tableaux que `rejeux-v18.sh`, l'écriture ne changeant aucune décision).
`rejeux.sh` rejoue, avec le banc fidèle (`BANC_ZONES=journal`, `BANC_PASSE_PLAFOND=10`,
`BANC_LEVIERS={"deuxiemePasse":2,"passe2Leviers":{"sansVoieRien":true}}`, profil L1-se) :
1. `ch139-livre-zjp` : `ancre:false` — le livré avant le levier N (référence du « 29 → 0 ») ;
2. `ch139-N-zjp` : `ancre:true` — le contrôle de départ (603 différés, 0 pose > 50 mm, 503 ≤ 10 mm) ;
3. `ch139-sans-branche` : `ancre:true` + patch `sans-branche.patch` + `BANC_PASSE_SANS_BRANCHE=1` — la variante.

`mesure.cjs` rend dans `sorties/` : le tableau standard par lot de chaque rejeu (`<nom>-tableau.md`), les poses
de la passe **par motif** (`motifs-<nom>.md`), le **différentiel** avant/après ventilé par lot-partie et par lot
(`differentiel.md`, `differentiel.csv`), et `resume.json`. Juge unique de CH-116/CH-113 : pire rail, 3D, contre
la pose finale de l'opérateur ; juste ≤ 10 mm ; fausse > 10 mm ; mauvaise voie > 50 mm ; cuts `exclu` (D-285)
non jugés. Les rejeux bruts (`<T>/rejeux/`) ne sont pas versés ici : ils se rejouent.

## Ce que le banc ne voit pas
- Le banc n'est pas le terrain : la passe réelle a des raisons de ne pas écrire que le banc ignore (1312v 6/463,
  NOTE de CH-116) ; le plafond et l'arrêt y sont rejoués, pas les refus d'ESV.
- Les poses de la passe refusées par l'ancre perdent leur motif dans la ligne du banc (`l1` non consigné) :
  comptées à part, motif inconnu.
- Une décision de la passe refusée par la commande (cible hors vue avant décision d'écriture) n'est pas annotée :
  elle n'apparaît dans aucune catégorie.
- Le corpus s'arrête au 12/11 : le terrain des 16 et 17/11 (6 poses `branche` jugées, 4 fausses ; `recherche-adv`
  7 sur 7 justes, `collections/2026-11-17_v191_lot-et-echo/NOTES.md`) n'y est pas ; ses chiffres ne sont pas
  reproduits ici, seulement rappelés.
- Tous les lots du corpus sont « vus » : chiffres ÉTABLI au banc, PROBABLE pour le terrain jusqu'à un Écho neuf.
