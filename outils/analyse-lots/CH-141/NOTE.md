# CH-141, F2 — la confiance de la relecture garde-t-elle quelque chose ?

`mesure-confiance-relecture.cjs` lit un journal de lot et les Échos de la même session, et rend trois choses :

1. **les corrections de relecture à confiance nulle**, séparées en deux : celles dont le 0 est la sentinelle S1 (« rail repêché, confiance non calibrée ») et celles où A* publie réellement 0 ;
2. **le seul juge de terrain possible** : une visite humaine de l'Écho postérieure à l'écriture de la correction. Dit combien de corrections ne sont jamais revues, et pour les rares revues, si l'opérateur a validé tel quel ou redéplacé le rail (et de combien) ;
3. **l'effet des seuils du fichier de réglages par défaut** (PN 85, ADV 95, abords 80) sur les mêmes corrections : combien passeraient, combien seraient bloquées, par zone.

## Résultats mesurés le 19/11 (ÉTABLI)

| | Lot du 18/11 | Lot du 19/11 |
|---|---:|---:|
| Corrections de relecture | 267 | 437 |
| dont un rail à confiance 0 | 75 | 82 |
| dont sentinelle S1 | 30 | 37 |
| jamais revues par l'opérateur | 66 | 75 |
| revues avec une validation | 3 | 0 |
| bloquées par les seuils du défaut | 213 (80 %) | 345 (79 %) |
| dont ADV | 129 sur 129 | 273 sur 273 |

Les 3 cuts du 18/11 jugés : 9/1549 validé tel quel ; 11/1726 redéplacé de 10,0 mm ; 15/6463 redéplacé de 11,8 mm.

**Conclusion :** le terrain ne juge pas ces corrections (la relecture écrit après l'opérateur, qui ne revient presque jamais). Réarmer les seuils du défaut ne trie pas les cas douteux : il éteint 80 % des corrections, **toutes** celles de l'ADV. La question est une décision de conception (lot B), pas un correctif 5.0.x. Rejouer la mesure quand une partie déjà relue sera retravaillée.

## Usage

```
node outils/analyse-lots/CH-141/mesure-confiance-relecture.cjs \
  --journal <ariane-journal-v4-*.json> --echo <dossier de JSON d'Écho> [--sortie fichier.json]
```

Le dossier d'Écho se fabrique en décompactant les archives `ariane-echo-*.zip` de la collection (les segments se lisent indifféremment). Sortie : numéros de partie et de cut, comptes, seuils — aucune donnée de terrain.
