# Archive finale Natif V4.6 — audit structurel

Archive : `banane-native-v4.6-2026-09-16-final.7z`

SHA-256 : `7cac220bd6e097f14ff1d39cbc431e7c6e918b819bdf521883bc33847ec12c66`

Cet audit porte sur l’intégrité, les sessions Natif, les références compactes et les segments. Il ne constitue pas un replay moteur et ne transforme aucune correction humaine en vérité d’entraînement.

## Contenu

L’archive contient 33 JSON : 31 exports Natif et 2 sidecars non Natif (`banane-bilan…` et `banane-journal…`) issus d’une session `automatic-test` distincte. Ces deux fichiers sont exclus des compteurs Natif.

Les 31 exports Natif reconstruisent 8 sessions distinctes, toutes terminées.

## Compteurs Natif

- visites : 1 486
- cibles exactes distinctes : 1 413
- événements sérialisés : 36 866
- objets LiDAR après union des segments : 4 252
  - chunks : 2 656
  - résumés de capture : 1 596
- références humaines `candidate-observed` : 1 308
- références `candidate-timing-uncertain` : 86
- références absentes : 92
- associations observationnelles fiables selon le critère strict déjà utilisé : 1 269
- cibles distinctes correspondantes : 1 268
- visites avec paire `comparable-candidate` : 57
- commandes envoyées par Banane : 0
- confirmations serveur : 0
- références marquées entraînables : 0

Les 1 269 associations restent des références observationnelles, pas des vérités d’entraînement.

## Intégrité des segments

1 412 988 références compactes `rails/views/coords/identities` ont été parcourues. Références invalides : 0.

Pour chacune des 8 sessions :
- la séquence canonique `eventSeq` est continue et sans trou ;
- les snapshots intermédiaires d’événements et de visites sont des sous-ensembles du snapshot final ;
- l’union des objets LiDAR des segments correspond exactement à `declaredCloudIds` ;
- aucun objet LiDAR n’est dupliqué entre deux segments de la même session.

## Session dégradée à isoler

La session `0c58c033-f2e7-4aa5-ad8c-80b081a83932` rapporte :
- `queueDepthMax = 512` ;
- `dropped = 65` ;
- pic de dégradation `METADATA_ONLY` ;
- 2 épisodes de dégradation et 2 récupérations.

Elle ne doit donc pas être décrite comme une session sans perte.

Un snapshot intermédiaire à `2026-09-16T13:18:13.793Z` contient 246 visites avec `dropped = 0`. À ce stade, les 18 paires comparables de la session étaient déjà présentes, avec 48 rails gauche et 41 rails droit comparables. Le snapshot final contient toujours 18 paires, 53 rails gauche et 43 rails droit comparables.

La tranche postérieure au dernier snapshot explicitement sans perte n’ajoute donc aucune nouvelle paire comparable ; elle ajoute seulement 5 rails gauche et 2 rails droit comparables. Pour les analyses causales de continuité, cette tranche doit être séparée ou exclue jusqu’à clarification des 65 événements perdus.

## Relation entre origines de profils

Sur les 1 269 associations observationnelles fiables :
- distance initiale médiane entre origines : `1.429276` unité de scène ;
- écart-type initial : `0.034746` ;
- distance humaine finale médiane : `1.437544` ;
- écart-type humain final : `0.003234`.

Ce résultat est descriptif. Cette distance n’est ni une cible physique, ni un écartement de voie, ni un seuil runtime. Aucune conversion en millimètres n’est faite sans calibration indépendante.

## Relation avec l’archive initiale du même jour

Archive initiale : 679 visites, 611 cibles exactes distinctes.

Archive finale : 1 486 visites, 1 413 cibles exactes distinctes.

Ensemble : 2 165 visites, 11 sessions et 2 024 cibles exactes distinctes. Aucune cible exacte n’est commune aux deux archives. En ignorant page et repère pour ne comparer que `(part, cut)`, un seul numéro se répète : `part 1 / cut 3`, ce qui ne suffit pas à conclure qu’il s’agit de la même cible physique.

## Suite

Le replay moteur gelé et le replay Flank Support Lab de cette archive sont des étapes séparées. Aucun seuil, moteur, Brain ou politique n’est modifié par cet audit.
