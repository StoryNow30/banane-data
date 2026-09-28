# Préparer les entrées du banc 4.8.5 (depuis une session neuve)

**En une commande** (D5) : `bash preparer.sh S` fait les cinq étapes
ci-dessous (idempotent, ~9 Go, une vingtaine de minutes) et écrit
`S/entrees.env`, que lit `banane/tools/portes-j1.cjs --entrees S/entrees.env`.
Vérifié le 28/09 : Écho p11 fusionné, 1 730 nuages, 0 manquant ; lot 4.7.18
de la partie 9 réduit à 346 observations.

`run.sh`, `run-premier-passage-*.sh` et `run-calage.sh` prennent cinq
dossiers : `DONNÉES_C5 KIT_EXTRAIT P9_4718R ECHO_P11 SORTIE`. Ils se
reconstruisent ainsi (py7zr requis ; `S` = un dossier de travail, hors dépôt) :

1. **DONNÉES_C5** (jeux a à d) :
   `python3 ../2026-09-25_c5-4720/setup.py $S/c5/data`
2. **KIT_EXTRAIT** (jeux e, f, h) :
   `python3 ../2026-09-28_kit-audit-480/extraire.py $S/kitx p9-lot-4718 p9-lot-4719 p9-relecture p12-lot-4720 p12-relecture p11-lot-4720`
3. **P9_4718R** (lot 4.7.18 de la partie 9, réduit à son lot) : un dossier qui
   contient les liens vers les corpus de `$S/kitx/p9-lot-4718/`, et une copie
   du diagnostic filtrée sur le lot `09d3c4f0-52c4-4245-959f-b180165ce951`
   (`observations` filtrées sur `batchId`, `observationCount` recalculé).
4. **ECHO_P11** (jeux g, h) : recoller
   `collections/2026-09-28_v4.8.0_/relecture p11/Echo_1.ZIP.part001…006` dans
   l'ordre, dézipper, puis fusionner la session `1bf9fe0e` (tous les fichiers
   sauf le faux départ `…08-02-51…`) :
   `node tools/merge-segments.cjs --out $S/echo1/session-1bf9.json FICHIERS…` ;
   le dossier `ECHO_P11` contient ce seul fichier (`session-1bf9.json`).
5. **SORTIE** : un dossier vide.

Contrôles attendus (28/09) : base 1 029 poses appliquées, 646 jugées, 10 faux
(`bilan-premier-passage-bas.json`) ; garde bas à 1 420 mm : 9 faux, 0 juste
perdu. Contre-calcul Python : banane,
`audit/chantiers/orchestration-485/garde_1420.py`.
