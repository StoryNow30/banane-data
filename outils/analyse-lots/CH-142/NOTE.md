# CH-142 — l'ancre de trajectoire muette sur le terrain (mesure seule)

Mesure du 19/11/2026, lot A2 d'Ariane 6. Aucun code d'Ariane n'est livré : le script lit les exports et
applique les règles du module de décision tel qu'il est.

## Question

Sur les lots de terrain des Visions 18, 19, 19.1 et 20 — et la Vision 15 comme comparaison —, pour chaque
**lot-partie exporté** et chaque cut visité ou posé, l'ancre de trajectoire rend-elle un axe (`etablie`) ou
`{muet}`, et par laquelle des quatre causes du ticket :

1. `liste-absente` — la partie n'a pas de liste d'ESV dans **son propre export de lot** ;
2. `liste-courte` — moins de `minLignesListe` = 100 lignes utilisables ;
3. `cut-hors-liste` — ligne absente ou bout de liste ;
4. `voie-courante-insuffisante` — pas assez de lignes de voie courante intactes, ou sens non établi.

Une cause par cut, la première qui s'applique, dans cet ordre (ticket CH-142). Le pourcentage principal porte
sur les **cuts posés**, parce que c'est là que l'ancre doit s'établir pour protéger une pose ; les cuts visités
sont donnés à côté.

## Populations

- **visité** : cut présent dans un événement `before-captured` ou `proposed` du journal du lot (Ariane l'a ouvert et lu) ;
- **posé** : cut présent dans un événement `validation-accepted` (Ariane l'a validé) ;
- **écriture observée** : sous-ensemble des posés avec `validation-ecriture-observee` de statut 2xx ;
- **posé sans écriture observée** : accepté sans écriture 2xx vue (compté à part, jamais fondu dans les posés).

Contrôle de cohérence ÉTABLI : les posés ainsi comptés retombent exactement sur les « validés » des NOTES de
lots — V18 1 361, V19.1 750, V15 784. V20 fait exception à ce contrôle : sa NOTE cite 211 « validés complets »
(une autre mesure, confirmation serveur), alors que le journal porte 791 cuts acceptés ; c'est ce dernier
chiffre qui est utilisé, comme pour les autres lots.

## Méthode

- Chaque liste d'ESV est lue **dans le même export de lot** que le journal, par son nom `ariane-liste-partieN-*.json`.
  Une liste absente n'est jamais comblée par une autre collection : elle donne `liste-absente`, et c'est dit.
- La liste est décompactée par `src/liste-memoire.js` (`decompacter`), puis mesurée par `src/ancre-trajectoire.js` :
  `lignes()` pour le nombre de lignes utilisables, `preparer()` pour le modèle de partie, `axe()` pour la cause du cut.
  Aucun seuil n'est recopié : `minLignesListe: 100`, `minLignes: 30`, fenêtres 200/400/800/1600,
  `sensRapportMin: 1.10`, `sensFaibleMaxMm: 20`, `margeM: 2`, `a: 4`, `w: 14` viennent du module.
- Le journal est lu par `unzip -p`, sans extraction sur disque ; une archive à la fois. Le JSON est découpé
  événement par événement (le journal porte un tableau `events` imbriqué dans un compteur : le script garde le
  plus long des tableaux homonymes). Mémoire mesurée : 0,55 Go au maximum pour le plus gros journal, sous la
  limite de `--max-old-space-size=2048`.
- Aucun dossier `examen-vierge-*-RESERVE` n'est ouvert par le script : il ne lit que `collections/<lot>/raw/`.
- Sorties sans donnée de terrain : le lot est nommé par sa version (V18, V19, V19.1, V20, V15), le lot-partie par
  `lot pN`, le cut par son numéro. Le texte des listes et le journal ne sont jamais recopiés.

## Rejouer en trois commandes

Depuis `/home/opencode/banane-data` (adapter les chemins si le dépôt est ailleurs) :

```
git -C /home/opencode/banane-data sparse-checkout add collections/2026-11-16_v18_constellation-25-32 collections/2026-11-17_v191_lot-et-echo collections/2026-11-17_v19_constellation-p2-3 collections/2026-11-18_v20_lot-parties6-15 collections/2026-11-12_v15_constellations-21-23_0-4
```

```
BANANE=/home/opencode/banane node --max-old-space-size=2048 outils/analyse-lots/CH-142/mesure-ancre-muette.cjs --sortie outils/analyse-lots/CH-142/sorties
```

```
node -e "const r=require('./outils/analyse-lots/CH-142/sorties/resume.json');console.log(r.principal)"
```

La première commande ne sert que si les collections ne sont pas déjà matérialisées. Le script accepte
`--donnees`, `--banane`, `--sortie` et `--lots V18,V19.1,V19,V20,V15` (V15 est hors total principal).

## Résultat (ÉTABLI)

Total principal, V18 à V20 : **86 cuts muets sur 3 025 posés (2,8 %)** ; 92 sur 3 187 visités (2,9 %).
Par cause sur les posés : `liste-absente` 1, `liste-courte` 0, `cut-hors-liste` 35, `voie-courante-insuffisante` 50.

| lot | posés | muets | % | hors-liste | voie-courante | absente |
|---|---|---|---|---|---|---|
| V18 | 1 361 | 13 | 1,0 | 13 | 0 | 0 |
| V19.1 | 750 | 18 | 2,4 | 11 | 7 | 0 |
| V19 | 123 | 46 | 37,4 | 2 | 43 | 1 |
| V20 | 791 | 9 | 1,1 | 9 | 0 | 0 |
| V15 (comparaison) | 784 | 10 | 1,3 | 10 | 0 | 0 |

Lectures utiles :

- **Les listes sont là** : 39 des 40 lots-parties portent leur liste ; 0 des 5 lots n'en porte aucune. Le seul
  lot-partie sans liste est `V19 p1`, et il ne pèse qu'un cut (le cut 1, en tête de lot). Aucune liste de moins
  de 100 lignes : `liste-courte` ne se déclenche jamais dans cet échantillon.
- **Les extrémités de liste** expliquent tout `cut-hors-liste` : sur les 58 cuts `cut-hors-liste` (population
  visitée), 43 ont un cut ≤ 5 et les 15 autres sont à 60 lignes ou moins de la fin de la liste ; aucun n'est au
  milieu (le module exige `a + w + margeM` = 20 m de part et d'autre). C'est structurel, pas un défaut de terrain.
- **Le sens est le seul vrai trou** : les 50 `voie-courante-insuffisante` sont toutes des mutes `sens`
  (`rapportSens` 1,031 en V19 p3 ; 1,032 en V19.1 p4), jamais un manque de lignes de voie courante.
  Elles sont concentrées : 43 cuts en V19 p3 (cuts 2485–2502, 2583–2593, 2632–2645), 7 en V19.1 p4
  (cuts 8645–8651), et **tous ces cuts ont été posés et écrits** malgré l'ancre muette.
- **Le total masque le lot V19** : sans lui, 40 muets sur 2 902 posés (1,4 %). Le lot V19 (arrêté tôt en p3)
  porte à lui seul 46 des 86 mutes principaux.

## Ce que la mesure ne dit pas

- Elle ne mesure pas les causes de mutisme **hors liste** : `calage-ligne`, `calage-lot` et `pose` du module
  (la pose de départ de la capture ne se cale pas). Elles demandent les captures et l'ordre du lot, pas seulement
  la liste. Sur V18, la NOTE du lot compte 66 décisions non jugées sur 1 418 ; appliquées aux mêmes
  1 418 cuts, les quatre causes ci-dessus en déclarent 14 muets. L'écart (52) relève d'autres motifs
  (calage, pose, absence de décision) et n'est pas ventilé ici.
- La liste de l'export est le **dernier instantané** de la partie, pas nécessairement celle chargée au moment du
  cut. Une liste absente de l'export ne prouve pas que la page ne l'avait pas (PROBABLE) ; elle prouve que
  l'export ne la porte pas.
- Les Échos ne servent pas de population : seuls les journaux de lot comptent. Les cuts jamais visités du lot
  ne sont pas comptés.
- La Vision 21 n'existe pas encore dans `collections/` : non mesurée. Aucune archive `.7z` de lot dans les cinq
  collections lues ; le script le signale si elle en rencontre une.
- Le calage et la justesse des poses ne sont pas jugés ici : c'est A1/CH-139 et le banc, pas A2.

## Fichiers

- `mesure-ancre-muette.cjs` — le script (aucune dépendance hors `unzip` et les deux modules lus dans `banane`) ;
- `sorties/detail.csv` — un cut par ligne : lot, partie, cut, populations, état de la liste, motif d'axe, cause ;
- `sorties/tableau.md` — tableaux par lot, par lot-partie, totaux et causes ;
- `sorties/resume.json` — les mêmes chiffres en JSON, avec les seuils et les anomalies de lecture.
