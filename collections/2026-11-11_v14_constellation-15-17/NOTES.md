# Constellation « Vision 14 » du 11/11/2026 (parties 15, 16, 17)

Build 5e8d305. Départs : partie 15 à 20:46 (8 211 lignes), 16 à 20:53 (8 213), 17 à 21:29 (6 115), heure de Paris. Heures ci-dessous en UTC.

## Mesuré (ÉTABLI, `tools/bilan-lot.cjs`, `chantiers/CH-107/outils/relecture-cuts-vides.cjs` du dépôt banane)
- Lots : 15 : 96 validés, 8 différés ; 16 : 378 validés, 42 différés ; 17 : 45 validés, 3 différés. Intervalle médian entre validations 1,2 s (P90 4,9 s).
- Relecture : 15 : 562 relus, 252 cuts sans point, 99 à moins de 100 points, 12 corrigés ; 16 : 654 relus, 125 sans point, 66 à moins de 100 points, 45 corrigés ; 17 : 45 relus, 4 corrigés.
- Aucune correction écrite sur un cut sans point ni à moins de 100 points (plus petit cut corrigé : 7 550 points en 15, 6 210 en 16).
- Cuts sans point : deux plages seulement, 19:51:40-19:53:32 et 20:26:53-20:27:51, toutes deux en relecture. Pendant ces plages, ESV ne télécharge AUCUN nœud de points.
- Les deux plages commencent à la 4e réponse 502 d'ESV depuis le chargement de la page (502 à 19:46:33, 19:48:05, 19:50:22, 19:51:40 ; puis, page rechargée au changement de partie, 19:56:16, 19:56:51, 19:57:23, 20:26:53). Potree garde un chargement « en cours » pour toujours après un échec (relevé de console du 10/11, collection vision12-essai) et n'en lance que 4 à la fois : au 4e échec, plus rien ne se charge jusqu'au rechargement de la page.
- Partie 16 : lot en pause 20:06:41 à 20:09:14 (capture en échec au cut 4925, « Lecture LiDAR instable : vue ESV non recentrée sur le rail left ») ; relecture arrêtée par un F5 de l'opérateur à 20:27:51 (reprise éteinte), changement de partie en échec (ESV muet, 20:28:04), Constellation arrêtée ; relancée à la main à 20:29:58 sur la partie 17.
- Partie 17 : relecture arrêtée à 20:33:32, cut 338 : correction refusée par la page (« vue ESV non recentrée ») et remise impossible ; Constellation arrêtée sur écriture incertaine.
- Relecture, temps par cut (médiane / P90) : cut sans point 174 / 215 ms ; cut chargé 596 ms / 2,7 s (navigation 14 ms, capture 362 ms / 2,2 s, calcul 146 ms).

## À suivre
- Réparer le compteur de Potree après un échec (écriture dans la page ESV : accord écrit de l'opérateur) ; en attendant, la garde CH-107 et la reprise allumée (D-341) rechargent et reprennent.
- Cut 338 de la partie 17 : à contrôler par l'opérateur dans ESV.
