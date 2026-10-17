# Second projet, parties 2, 3, 4, 6 et 7 : lot Orbite 4.9.5.3 (test 3), bilan et prédictions figées avant l'Écho

17 octobre 2026. Lot exporté le 16/10 à 16 h 42 (heure de Paris). Outils : `origin/claude/50-base`, commit `2d60d046d0fa9f9293f4fb6ff3b0b2b55c848d48`, worktree détaché `scratchpad/wt/A2P`. Aucun dépôt modifié, aucun réglage changé. Chiffres agrégés, numéros de partie et de cut seulement. Heures en heure de Paris.

Ces cinq parties ne sont pas dans la liste d'apprentissage de `datasets/manifeste-parties.json` : elles sont **réservées**. Les outils les ont lues avec `--juger-partie-reservee` (« jugée sans réglage »). **Il n'y a pas encore d'Écho de Mic** : rien ici n'est jugé. Ce qui est jugeable plus tard est figé dans `PREDICTIONS.json`.

Vocabulaire : **posé** = Ariane a posé et validé le cut ; **différé** = Ariane s'est abstenue ; **invalide restant** = cut encore non traité dans ESV à la fin du lot ; **verts** = cuts qu'ESV a laissés valides et qu'Orbite ne visite pas.

## 0. L'essentiel

- **416 cuts décidés en 22 min de lot, 348 posés, 68 différés (16 %)**. Aucune erreur d'adaptateur, aucune pause, aucun arrêt, une seule page ESV par lot. Chaque lot s'arrête seul au dernier invalide. Il reste exactement les 68 différés comme invalides.
- **Partie 2 à part** : 28 différés sur 89 (31 %). Les autres parties : 3 % (partie 3), 13 à 14 % (parties 4, 6, 7). En partie 1 : 36 %.
- **La voie n'est pas décalée dans son ensemble comme en partie 1.** Ariane déplace ses poses de 35 à 56 mm de côté (médiane par partie), ce qui est surtout l'écart du gabarit d'ESV (1 500 mm) au vrai écartement. En partie 1 : 117 mm, et 69 poses à plus de 150 mm ; ici aucune. Il y a des **décalages locaux de 80 à 130 mm, juste autour des séries de différés**, dans les zones d'ADV reconnues.
- **Prédictions figées** (réglages de `datasets/reglages-figes.json` tels quels, SHA-256 `bff4c5bae262a3bcd2bd54bca41f6d9fc35b2e7aacf35cb57c91fe6e9a4d9ef6`) :
  - **règle prudente de voie prédite : 0 différé posable sur 68**, aucun geste de vue, aucune pose d'origine changée ;
  - **règles métier : 18 zones de PN, 15 zones d'ADV, 123 cuts posés qui seraient mis en attente** (108 en zone de PN, 15 en grappe de différés) ;
  - **hauteur apprise : 41 cuts changés d'au moins 0,5 mm**, dont **5 changés de 5 mm** (le plafond) ; **faux vert « hauteur ambiguë » : 0 cut** ;
  - **verts à contrôler : au moins 103 verts (6,4 min), environ 214 estimés (13,2 min)**.
- **Empreinte de `PREDICTIONS.json`** : `9deaa9a17cc273e20a5a42d72a17cb629d49cb66c57df9f702a90878387d7196` (fichier en lecture seule, empreinte aussi dans `PREDICTIONS.json.sha256`).
- **Le rejeu est fidèle** : sur les 416 cuts, il retrouve l'issue (posé ou différé) et l'étage du journal à chaque fois, et la pose d'Ariane à 0,53 mm au plus.

## 1. Bilan par partie

### 1.1 Cuts, posés, différés, débit

| | partie 1 (rappel) | **partie 2** | **partie 3** | **partie 4** | **partie 6** | **partie 7** |
|---|---:|---:|---:|---:|---:|---:|
| lot (heure de Paris) | 10:52–11:10 | 13:20–13:24 | 13:34–13:37 | 15:27–15:30 | 15:36–15:41 | 15:42–15:50 |
| invalides au départ / total de la partie | 351 / 9 864 | 88 / 9 911 | 38 / 9 906 | 55 / 9 827 | 83 / 9 884 | 151 / 9 791 |
| cuts visités | 352 | 88 | 37 | 54 | 82 | 150 |
| cuts décidés | 351 | 89 | 38 | 55 | 83 | 151 |
| **posés** | 224 (63,6 %) | **61 (68,5 %)** | **37 (97,4 %)** | **48 (87,3 %)** | **72 (86,7 %)** | **130 (86,1 %)** |
| **différés** | 127 (36,1 %) | **28 (31,5 %)** | **1 (2,6 %)** | **7 (12,7 %)** | **11 (13,3 %)** | **21 (13,9 %)** |
| invalides restants à la fin | – | 28 | 1 | 7 | 11 | 21 |
| durée du lot | 17,7 min | 4,4 min | 2,3 min | 2,9 min | 4,5 min | 7,9 min |
| **débit (cuts décidés par heure)** | 1 185 | **1 225** | **997** | **1 147** | **1 097** | **1 142** |
| **cycle médian par cut** (P90) | – | **2,4 s** (5,4) | **2,4 s** (5,8) | **2,4 s** (5,6) | **2,6 s** (6,2) | **2,5 s** (5,8) |
| capture ESV : médiane / P90 | – | 0,45 / 3,6 s | 0,49 / 4,2 s | 0,47 / 4,0 s | 0,47 / 4,0 s | 0,46 / 3,6 s |

- Le débit brut est aussi le débit actif : aucune pause de plus de 60 s dans un lot. Le lot de la partie 3 est court (38 cuts), d'où un débit plus bas.
- Les « cuts visités » sont un de moins que les cuts décidés : le premier cut est capturé sans changement de cible.
- Partie 2 : 89 décidés pour 88 invalides au départ. Le lot commence au cut 0, et un des 61 cuts posés était déjà valide (le compteur d'ESV ne monte que de 60), probablement le cut 0.
- Le compteur d'ESV confirme les invalides restants : à la fin de chaque lot, le nombre de cuts non traités est égal au nombre de différés.

### 1.2 Différés et leurs raisons

« Aucun voisin posé » : la décision de lot n'a pas d'ancre pour prédire la voie. « Aucun minimum près de la prédiction » : il y a une voie prédite, mais pas de candidat qualifié près d'elle. Le motif du moteur est celui du rail refusé le plus grave.

| partie | différés | raison (décision de lot) | motif du moteur, par cut | séries (cuts qui se suivent, trou ≤ 10) |
|---|---:|---|---|---|
| 2 | 28 | aucun voisin 25 ; aucun minimum près de la prédiction 3 (dont 1 bloqué par la garde de lot) | écartement de paire hors contrat 17, flanc 4, ambiguïté 4, pente 2, aucun rail refusé 1 | **2336–2348 (13)**, 2370–2374 (5), 3080–3083 (3), 2415–2416, 3098–3099 ; isolés 1970, 2192, 2223 |
| 3 | 1 | aucun voisin | entrée insuffisante | cut 0 |
| 4 | 7 | aucun minimum 5 ; aucun voisin 2 | écartement 3, flanc 2, ambiguïté 2 | 8345–8349 (4) ; isolés 1228, 6327, 8325 |
| 6 | 11 | aucun voisin 8 ; aucun minimum 2 ; garde de paire 1 | écartement 7, ambiguïté 2, flanc 1, aucun rail refusé 1 | 3399–3400, 4653–4654, 4725–4726 ; isolés 3433, 3480, 3505, 3722, 4756 |
| 7 | 21 | aucun voisin 12 ; aucun minimum 8 (dont 3 par garde de lot, 1 par garde d'écartement) ; écartement trop haut 1 | écartement 10, ambiguïté 5, flanc 2, aucun rail refusé 4 | 5818–5821 (3), 4413–4414, 5638–5639 ; 13 isolés |

- La seule longue série est celle de la partie 2 (2336–2348, 13 cuts). Ailleurs, les différés sont isolés ou en paires : pas d'avalanche comme en partie 1 (trois séries de plus de 20 cuts).
- Le motif « écartement hors contrat » domine (37 cuts sur 68). En partie 1, c'était aussi le signe d'un rail pris sur le mauvais objet quand la voie glisse.
- 53 des 68 différés sont dans une zone d'ADV reconnue par les règles métier (section 2.2) : 21 sur 28 en partie 2, 5 sur 7 en partie 4, 9 sur 11 en partie 6, 18 sur 21 en partie 7.
- Les **cuts 0 et 1 sont posés** : cut 0 en partie 2, cut 1 dans les cinq parties. En partie 1, Mic avait ignoré les cuts 0 à 3 (SKIP obligatoire, points manquants). Le cut 0 de la partie 3 est différé.

### 1.3 Voie décalée ou non (comparaison avec la partie 1)

Mesure sans Écho : le déplacement latéral qu'Ariane a donné à ses poses, depuis la pose de départ d'ESV. On prend le plus grand des deux rails, dans le repère du profil.

| | partie 1 | 2 | 3 | 4 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|
| posés mesurés | 224 | 61 | 37 | 48 | 72 | 130 |
| déplacement latéral, médiane (mm) | **117** | 45 | 35 | 39 | 56 | 52 |
| P90 / maximum (mm) | 173 / 193 | 97 / 129 | 42 / 59 | 84 / 92 | 85 / 113 | 84 / 105 |
| poses à plus de 80 mm | **153** | 10 | 0 | 6 | 17 | 18 |
| poses à plus de 150 mm | **69** | 0 | 0 | 0 | 0 | 0 |
| deux rails à plus de 30 mm, même sens | 152 / 154 | 10 / 10 | 0 / 4 | 2 / 3 | 1 / 1 | 11 / 22 |

- **Pas de voie décalée d'ensemble.** Un déplacement de 35 à 45 mm par rail, en sens opposés, est l'écart attendu entre le gabarit d'ESV (1 500 mm exactement : c'est la pose de départ de 16 des 28 différés de la partie 2 et de 17 des 21 de la partie 7) et l'écartement réel.
- **Décalages locaux** de 80 à 130 mm, les deux rails dans le même sens, juste à côté des différés : partie 2, cuts 2378–2382 et 3102–3104 ; partie 4, 8321–8328 ; partie 6, 3675–3683 et 3721–3726 ; partie 7, 4410–4412, 4440–4443 et 5839–5842. Ce sont des zones d'aiguillage probables : la voie bifurque, comme aux cuts 568–569 de la partie 1.
- **Part des différés : 16 % sur les cinq parties contre 36 % en partie 1.** Seule la partie 2 s'en approche (31 %).

### 1.4 Signaux S6

| | partie 1 | 2 | 3 | 4 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|
| fenêtres de ressources avec relevé | 624/624 | 191/191 | 96/96 | 133/133 | 164/164 | 255/255 |
| nœuds de points lus (tous en statut 200) | 883 | 270 | 146 | 197 | 269 | 433 |
| échecs, sans statut | 0, 0 | 0, 0 | 0, 0 | 0, 0 | 0, 0 | 0, 0 |
| durée moyenne par nœud (ms) | 136 | 111 | 105 | 149 | 133 | 137 |
| durée max d'une fenêtre : médiane / P99 / max (ms) | 119 / 326 / 618 | 106 / 248 / 466 | 107 / 226 / 273 | 142 / 350 / 507 | 132 / 253 / 280 | 127 / 298 / 393 |
| événements ESV par minute, perdus | 64,7, 0 | 69,2, 0 | 66,2, 0 | 71,5, 0 | 68,2, 0 | 70,8, 0 |
| validations avec événement ESV | 224/224 | 61/61 | 37/37 | 48/48 | 72/72 | 130/130 |
| écritures serveur (toutes 204, une tentative) | 575 | 150 | 75 | 103 | 155 | 281 |
| `tDepart` calibré, écart à la T actuelle | 0 mm | 0 mm (88/89) | 0 mm (36/38) | 0 mm | 0 mm | 0 mm |
| niveau d'octree maximal | 11–12 | 11 | 10–11 | 11 | 11 | 11 |
| points visibles par cut, médiane | 653 000 | 424 000 | 530 000 | 561 000 | 562 000 | 565 000 |
| budget 2 M, part maximale utilisée | 51,6 % | 48,6 % | 38,5 % | 43,4 % | 37,3 % | 44,1 % |
| mémoire JS au pic de capture, médiane / max (Mo) | 454 / 631 | 295 / 373 | 250 / 309 | 272 / 332 | 295 / 353 | 325 / 424 |
| `flushPct` ≥ 50 (cuts) | 19 | **32** | **30** | **38** | 13 | 16 |

- Toutes les lectures de points sont réussies et rapides. Aucun échec, aucun événement ESV perdu. Toutes les validations sont confirmées par un événement d'ESV.
- Les nuages sont un peu moins denses qu'en partie 1 (niveau 11 au lieu de 12, 424 000 à 565 000 points), sans effet visible sur les décisions : la partie 3, la plus pauvre au départ, a 1 seul différé.
- **`flushPct` à 76–100 sur des suites de 3 à 11 cuts posés**, l'allure des passages à niveau de la partie 29 (section 2.2). En partie 1, ce signal était plus diffus et sans PN déclaré.
- Trois relevés « compteur bloqué » (valeur 1 ou 2, sur 3 cuts) : partie 2, cut 2430 ; partie 4, cut 2658 ; partie 6, cut 1054. Sans suite dans le lot.

### 1.5 Avis de contrat ESV

- **Un seul avis**, à 13:20:04, **2,5 s avant le départ du lot de la partie 2**. Message : « ESV n'a plus le même contrat qu'à la dernière connexion ». Seules changent les classes des deux boutons de rail (`rails.0`, `rails.1`). Les boutons de navigation et les écouteurs sont inchangés. Le lot est parti quand même.
- Les cinq relevés de contrat suivants (avant chaque lot) donnent **la même empreinte, sans changement**.
- Probablement une fausse alerte : les classes des boutons de rail disent quel rail est sélectionné (un rail « S », l'autre « US »). C'est un état de la page, pas un nouveau contrat. **À vérifier** : l'empreinte précédente n'est dans aucun export de ce lot.

### 1.6 Incidents

- **Aucun incident de lot** : 0 erreur d'adaptateur, 0 pause, 0 reprise, 0 arrêt, 0 interruption, 0 page perdue. La capture fait toujours 2 essais (fonctionnement normal du mode rapide). La fin est normale : le dernier invalide est validé sur place (ctrl-entrée), puis « dernier cut validé ».
- **À signaler** :
  - cuts 0 et 1 posés et validés (section 1.2) ;
  - avis de contrat juste avant la partie 2 (section 1.5) ;
  - à 15:26, sur la page de la partie 3, quelqu'un a navigué à la main sur les cuts 8252 à 8258, entre deux lots (hors lot, aucune écriture d'Ariane).

## 2. Prédictions figées, avant toute Écho

Toutes les pièces en ombre sont rejouées hors ligne. Elles utilisent le code de l'extension et les réglages figés, sans aucune modification. Les entrées sont le journal et le corpus de chaque partie (lot découpé par partie). La jointure a été faite avec une Écho vide : aucune référence humaine n'entre nulle part. Tout est dans `PREDICTIONS.json` : empreintes des réglages, du manifeste, de chaque outil et module, et de chaque fichier d'entrée.

### 2.1 Règle prudente de voie prédite (D-147, `regle-wc-e10-p10`)

| partie | différés | posables | geste de vue | poses d'origine changées |
|---|---:|---:|---|---:|
| 2 | 28 | **0** | – | 0 / 61 |
| 3 | 1 | **0** | – | 0 / 37 |
| 4 | 7 | **0** | – | 0 / 48 |
| 6 | 11 | **0** | – | 0 / 72 |
| 7 | 21 | **0** | – | 0 / 130 |

- Deux mesures concordent : l'ombre d'Orbite (`voie-predite-ombre`, le code du service worker) et le rejeu « en série » de la variante. Elles donnent **0 pose sur 68 différés**.
- Pourquoi : aucun de ces différés n'a de voie prédite refusée par la vue. En partie 1, il y en avait 11 : les têtes de série, qui ouvraient tout le gain de la règle. Ici, la décision de lot n'avait soit pas d'ancre, soit pas de minimum près de la voie. Sans pose de l'ombre, il n'y a pas d'ancre nouvelle, donc rien à relancer.
- À juger : si Mic pose ces 68 cuts loin de la pose de départ, la règle les a manqués. Si les écarts sont locaux et autour des ADV, l'abstention est la bonne réponse.

### 2.2 Règles métier : PN, ADV, grappes, cuts mis en attente

Aucune liste de PN ni d'ADV de Mic n'était disponible : ce sont des détections brutes.

| partie | zones de PN reconnues (cœur) | zones d'ADV reconnues | cuts mis en attente : PN / grappe / total |
|---|---|---|---:|
| 2 | 363–368, 4779–4784, 7617–7622, 8508–8514, 9742–9748 | 2340–2476, 3050–3112 | 26 / 7 / **33** |
| 3 | 3447–3452, 4633–4641, 5805–5812, 8244–8252 | 1446–1508 | 27 / 0 / **27** |
| 4 | 39–46, 545–550, 2658–2666, 6325–6331, 8631–8641 | 8293–8355 | 32 / 0 / **32** |
| 6 | 7940–7950 | 3366–3433, 3652–3755, 4422–4484, 4619–4683, 4695–4788 | 11 / 5 / **16** |
| 7 | 1068–1075, 1961–1967, 5361–5363 | 3118–3295, 3514–3576, 4376–4536, 4712–4776, 5493–5715, 5787–5851 | 12 / 3 / **15** |
| **total** | **18 zones** | **15 zones** | **108 / 15 / 123** |

- **Mis en attente** = cuts qu'Ariane a posés et validés et qu'une règle aurait différés. La liste exacte est dans `PREDICTIONS.json`.
  - Grappes : partie 2, 2375, 2376, 2417, 3084, 3085, 3100, 3101 ; partie 6, 3401, 3402, 4656, 4727, 4728 ; partie 7, 4415, 5640, 5822.
  - Règle « validation en place » : 0 cut.
  - Coût pour Mic : 2,6 à 8,4 min de pose en plus selon le barème de l'outil.
- Cœurs de PN isolés, non confirmés : partie 2, cut 1814 ; partie 6, cut 3439.
- Quatre zones de PN sont **au bout du lot** (dernier invalide) : partie 2 (9742–9748), partie 3 (8244–8252), partie 4 (8631–8641), partie 6 (7940–7950).
- Le seul différé dans une zone de PN est le cut 6327 (partie 4). **Tous les autres cuts des zones de PN ont été posés.**
- **Prudence** : en partie 1, `flushPct` signalait 51 cuts sans aucun PN déclaré (précision nulle). Ici, les signaux forment des blocs nets à 76–100, plus proches de la partie 29. Seule la liste de Mic tranchera.
- Alertes ADV hors de toute zone de Mic (aucune liste) : 21 cuts en partie 2, 4 en partie 3, 3 en partie 4, 42 en partie 6, 66 en partie 7.

### 2.3 Hauteur apprise et faux vert « hauteur ambiguë »

| partie | posés évalués | cuts changés ≥ 0,5 mm | dont ≥ 2 mm | cuts au plafond (5 mm) | vers le haut / bas (rails) | « hauteur ambiguë » : à différer |
|---|---:|---:|---:|---|---|---:|
| 2 | 61 | 10 | 1 | **9745** (rail droit +5) | 8 / 2 | 0 |
| 3 | 37 | 2 | 0 | – | 2 / 0 | 0 |
| 4 | 48 | 3 | 1 | **7057** (gauche +5) | 3 / 0 | 0 |
| 6 | 72 | 11 | 1 | **4488** (gauche +5) | 11 / 1 | 0 |
| 7 | 130 | 15 | 2 | **3286** (droit +5), **4438** (deux rails +5) | 15 / 1 | 0 |
| **total** | **348** | **41** | **5** | 5 cuts | 39 / 4 | **0** |

- Hors des 5 cuts au plafond, les corrections sont minimes : 0,5 à 1,1 mm, sous le bruit de la référence (environ 2 mm).
- Les 5 cuts à +5 mm ont tous au moins un rail dont le calage de convention a été **refusé** (décalage hors domaine, 5,9 à 9,2 mm de haut).
- La preuve « l'ombre est sans effet » passe sur les cinq parties : décisions et commandes identiques, 416 sur 416.
- Faux vert « hauteur ambiguë » : aucun rail n'a un décalage de calage d'au moins 11 mm (maximum 9,4 mm). La règle ne différerait **aucun** cut.

### 2.4 Verts à contrôler

L'export ne contient pas les bords des verts (la liste d'ESV) : les signaux de forme sont inconnus. Ce qui est sûr, c'est le contexte (cuts du lot, différés, zones de PN et d'ADV). Comme la forme ne peut qu'ajouter des points, la **liste certaine** est une borne basse. L'**estimation** utilise comme référence les verts justes de la partie 1 du même projet.

| partie | candidats (fenêtre + PN + ADV) | liste certaine | liste estimée | temps estimé (3,7 s par vert) |
|---|---:|---:|---:|---|
| 2 | 271 | 27 | 48 | 1,7 à 2,9 min |
| 3 | 120 | 8 | 16 | 0,5 à 1,0 min |
| 4 | 144 | 17 | 27 | 1,1 à 1,7 min |
| 6 | 448 | 14 | 37 | 0,9 à 2,3 min |
| 7 | 735 | 37 | 86 | 2,3 à 5,3 min |
| **total** | **1 718** | **103** | **214** | **6,4 à 13,2 min** |

- **Mic aurait reçu** les plages suivantes (liste certaine, détail dans `PREDICTIONS.json`) :
  - les verts au bord de chaque PN ;
  - les verts de part et d'autre des séries de différés (par exemple 2334–2335, 2349–2350, 2368–2369 en partie 2 ; 4467–4471, 5521–5525 en partie 7) ;
  - quelques verts dans les zones d'ADV (huit dans 3118–3295 en partie 7).
- Borne haute : si l'on prend tous les verts de la partie 1 comme référence (et pas seulement les justes), l'estimation monte à 352 verts. Les zones d'ADV reconnues sont larges : elles gonflent les candidats (1 230 sur 1 718), mais leur poids dans le score est nul.

## 3. Ce qu'il faudrait que Mic fasse en Écho

Ordre de priorité, pour juger le plus de prédictions avec le moins de temps :

1. **Noter les PN et les zones d'ADV de chaque partie** (début, fin, aiguilles), comme pour la partie 29. Sans ces listes, ni les 18 zones de PN ni les 15 zones d'ADV ne peuvent être jugées. En priorité :
   - les quatre zones de PN en bout de lot (2:9742–9748, 3:8244–8252, 4:8631–8641, 6:7940–7950) ;
   - les 108 cuts posés en zone de PN.
2. **Partie 2 d'abord, en entier** : c'est la partie la plus difficile (31 % de différés) et la plus proche de la partie 1. Zones 2330–2480 (la série 2336–2348 et la grappe 2370–2376) et 3075–3110. Poser les 28 différés et valider ou corriger cut par cut les posés voisins. Ce sont les cuts qui jugent la voie prédite (0 pose prédite) et les grappes.
3. **Parties 6 et 7, zones d'ADV** : 3360–3760 et 4420–4790 (partie 6) ; 3118–3295, 4376–4536, 5493–5715 et 5787–5851 (partie 7). Ce sont les plus nombreuses alertes ADV et la plupart des différés.
4. **Corriger précisément la hauteur des 5 cuts à +5 mm** : 2:9745, 4:7057, 6:4488, 7:3286, 7:4438. Valider (même sans correction) les 36 autres cuts changés de 0,5 à 1,1 mm. On saura si la hauteur apprise rapproche ou éloigne.
5. **Relire tous les verts d'au moins une partie courte** (partie 3 ou 4) sur ±10 cuts autour du lot et dans les zones de PN, en notant le temps. On juge ainsi la liste des verts sur une partie complète.
6. **Cuts 0 à 3 de chaque partie** : dire s'ils doivent être ignorés (SKIP), comme en partie 1. Ariane a posé le cut 1 partout et le cut 0 en partie 2.
7. Garder l'export Écho final complet (et les sauvegardes) et ne pas recharger la page pendant une série. Laisser chaque visite durer au moins 0,8 s quand une pose est juste : la règle « visité sans action = bon » en dépend.

## 4. Limites

- **Aucune vérité terrain** : tout est prédiction ou mesure du journal. Le taux de faux verts de ces parties est inconnu.
- La « voie décalée » est mesurée sur les poses d'Ariane, pas sur celles de Mic. Un décalage qu'Ariane n'a pas suivi (sur les différés) ne se voit pas avant l'Écho.
- Verts : signaux de forme inconnus. La liste certaine est une borne basse. L'estimation suppose que les verts de ces parties ressemblent à ceux de la partie 1. On suppose aussi qu'aucun vert n'a déjà été traité par un opérateur, ce qui ne se voit pas dans l'export.
- Règles métier : détection sans liste de Mic. Le détecteur de PN n'a jamais été jugé à l'aveugle (il avait échoué en partie 1).
- Les cuts mis en attente sont un effet du premier ordre : les décisions suivantes ne sont pas recalculées.
- Avis de contrat : l'interprétation (classe du rail sélectionné) n'est pas vérifiée.

## 5. Fichiers et commandes

Dans `scratchpad/lot1442/` :
- `RAPPORT.md` (ce fichier) ;
- `PREDICTIONS.json` (lecture seule) et `PREDICTIONS.json.sha256` ;
- `out/bilan-parties.json` (bilan et S6 par partie), `out/voie-decalee.json`, `out/fidelite-temoin.json`, `out/hauteur-fauxvert.json`, `out/verts.json` ;
- `out/parts/pN/` : jointure sans Écho, jeu sans étiquette, sorties du rejeu de voie, des règles métier, de la hauteur et des faux verts ;
- `sc/` : scripts (`split.cjs`, `jeu-sans-echo.cjs`, `bilan.cjs`, `voie-decalee.cjs`, `verts.cjs`, `haut-resume.cjs`, `predictions.cjs`, `run-voie.sh`, `run-haut.sh`).

Les copies découpées du journal et du corpus et les mémoires du moteur sont supprimées (on les refait avec `sc/split.cjs`). Le lot reçu `x/` n'est pas touché.

```
W=scratchpad/wt/A2P ; D=out/parts/pN
node sc/split.cjs x out/parts
node $W/tools/jointure-echo-orbite.cjs --echo out/echo-vide/ariane-echo-vide.json --journal $D/journal-pN.json --partie N --sans-poses --sortie $D/jointure-pN.json
node sc/jeu-sans-echo.cjs $W $D/jointure-pN.json $D/jeu-pN.jsonl
node $W/tools/rejeu-voie-predite.cjs --partie 2:N --juger-partie-reservee --corpus $D/corpus-pN.json --journal $D/journal-pN.json \
     --jointure $D/jointure-pN.json --variantes temoin,regle-wc-e10-p10 --sortie … --detail … --ombre …
node $W/tools/regles-metier.cjs lot --partie 2:N --juger-partie-reservee --journal … --corpus … --jeu … --sortie …
node $W/tools/hauteur-apprise.cjs extraire|preuve --partie 2:N --juger-partie-reservee --jeu … --journal … --corpus …
node $W/tools/faux-verts.cjs extraire --partie 2:N --juger-partie-reservee --jeu … --journal … --corpus …
node sc/verts.cjs $W out/parts scratchpad/vac/tables/t-2-1.json out/verts.json
```
