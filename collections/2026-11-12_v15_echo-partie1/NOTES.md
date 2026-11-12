# Séance Écho du 12/11/2026 : partie 1 (coupée par une panne de la page ESV)

111 visites, 105 cuts, 14:46:16 à 14:53:12 (Paris). Table : `derive/jointure-echo-lot-p1.csv`.

## Mesuré (ÉTABLI)
- Lot : 42 posés, 28 revus : 25 sans action, 3 retouchés (le pire à 39 mm). Pas de différé.
- 13:52:50 UTC : `native-page-lost` (« page-reloaded ») ; la page rechargée affiche « Potree Encountered An Error — Error creating WebGL context » (capture de l'opérateur) ; séance finie à 13:53:12, 108 visites incomplètes.
- L'Écho n'envoie aucune commande à ESV ; qui a déclenché le rechargement n'est pas au journal.

## Lecture (SUPPOSÉ)
- « Error creating WebGL context » : Chrome refuse un nouveau contexte WebGL à la page (processus graphique saturé ou planté, souvent après une longue séance ou un plantage du pilote). Rien dans Ariane ne crée de contexte WebGL ; un lien avec le préchauffage (mémoire graphique de Potree) n'est ni établi ni exclu.

## Suite (14:54 à 14:59, après redémarrage), les deux séances jointes ensemble
- 41 des 42 posés du lot revus : 34 sans action, 7 retouchés (médiane 8 mm, 2 au-delà de 10 mm, le pire à 39 mm). Aucune mauvaise voie.
