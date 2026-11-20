# Vision 21 (build `8e62c5dd`), 19/11 après-midi : lot de la partie 1 (et historique cumulé des parties 28 à 36)

Export du 19/11 à 15:51 (Paris, `14-51-13` UTC), 35 archives (`ariane-lot-2026-11-19T14-51-13-volume01-sur35.zip` à `volume35-sur35.zip`), **vérifiées intègres** (`7z t`, 35 sur 35).

## Ce que porte la collection

- **35 volumes de lot** (`raw/`) : export cumulé de la session (cache non vidé depuis le matin), incluant :
  - `volume01` : les 10 instantanés de la liste d'ESV (parties 28 à 36 + **partie 1**, 8 852 lignes, `ariane-liste-partie1-20261119-143327Z.json`) et la liste des verts à contrôler de la partie 1 (114 cuts en 22 plages) ;
  - `volume02` : le journal complet (`ariane-journal-v4-1795099874329.json`, 204 646 événements, 1 674 records, 12 lots dans `finsLot`) ;
  - `volume03` à `volume34` : le diagnostic GCV1 (`ariane-gcv1-diagnostic-1795100047581.json`) et les 32 segments de nuages (`ariane-gcv1-corpus-2026-11-19T14-54-08-seg01.json` à `seg32.json`) ;
  - `volume35` : le bilan (`ariane-bilan-v4-2026-11-19T14-55-38-seg01.json`).

## Mesuré sur la partie 1 (19/11 après-midi, ÉTABLI)

| Lot (`batchId`) | Plage | Cuts vus | Cuts posés | Différés (1re passe) | Écrits 2e passe | Durée lot | Issue |
|---|---|---:|---:|---:|---:|---:|---|
| `4972d7b1-…` | 14:12:25 → 14:16:03 UTC | 31 | 23 | 8 | — | 217,7 s | `ERROR` au cut 1/35 (`apply` : `deplacerVue` `gestes-epuises` sur rail droit après pose du rail gauche, `ndcApres = [0.337, -10.32]`, `gain = 38.984`) |
| `ddc24bd4-…` | 14:16:49 → 14:32:18 UTC | 332 | 300 | 31 | 6 | 928,6 s | `STOPPED` (`complete`, `dernier-cut-valide`) |
| **Total partie 1** | **363 invalides au départ** | **363** | **323** | **39** | **6** | **1 146,3 s (19,1 min)** | **329 posés au total (90,6 %), 33 différés restants (9,1 %)** |

- **Deuxième passe (`ddc24bd4`)** : 20 différés évalués en ombre en 68,4 s, **6 poses décidées et 6 écrites** (cuts 41, 42, 186, 267, 306, 309), 0 refus.
- **Relecture (`ddc24bd4`, mode `corriger`)** : **640 cuts relus** en 743,8 s (12,4 min mural ; 642,1 s actif), **62 corrigés** (9,7 %, médiane 2 124,5 ms), **578 visites sans correction** (90,3 %, médiane 591,5 ms), 0 refusé, 584 marqués « vu ».
- **Calcul géométrique (`phase-timing`, 363 cuts)** : `analysis-envelope` = **711,4 s (11,9 min)** dont **309,6 s** pour V4.6 (`v46-pair-complete` 78,3 s + `v46-scientific` 231,3 s pour 2 112 appels, jusqu'à 48 appels/cut) ; `command:capture` = 179,4 s (médiane 262,8 ms) ; `command:amenerDansLaVue` (`preVol`) = 44,4 s (25 appels, médiane 1 779 ms).
- **Ancre et ombres sur la partie 1** : l'ancre N a jugé 308 poses conformes, été muette en bout de liste sur 16 cuts, et **refusé 11 poses hors axe (> 75 mm)** ; `voie-b1-ecart-ombre` juge 21 différés posables sur 51 ; `garde-voie-ombre` signale **9 coupes à écartement > 15 mm des voisins** (cuts 7, 246, 278 et grappe 310–317 jusqu'à 1 468,6 mm).

## Règles

- `raw/` est **immuable** ; `SHA256SUMS` couvre les 35 archives (`sha256sum -c SHA256SUMS`).
- Aucune donnée de terrain ne sort de ce dépôt vers `banane`.
