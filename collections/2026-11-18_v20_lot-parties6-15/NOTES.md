# Vision 20 (build a19c5ed5), 18/11 : lot des parties 6 à 15 et séance Écho en deltas

Lot : export « mode allégé » en **20 volumes** (les 20 sont nécessaires ; les listes d'ESV des 10 parties sont répétées dans chaque volume, le journal, le bilan, le corpus GCV1 et le diagnostic sont répartis). Export du 18/11 10:57 Paris.
Écho : **10 exports automatiques en delta** (séance en cours, pas d'export final), de 08:50 à 09:55 UTC, parties 6 à 15.
Intégrité : 30 archives, `unzip -t` sans erreur sur les 30, SHA-256 dans `SHA256SUMS` (aucune archive en double).

## Mesuré (ÉTABLI)
- **Écho** : **451 cuts** vus au moins une fois, union par cut en gardant le dernier état observé (parties 6 à 15 : 1, 80, 6, 124, 27, 46, 48, 10, 57, 52).
- **96 cuts corrigés** (dont 67 de plus de 5 mm, 27 de plus de 10 mm), **50 validés tels quels**, **232 visités sans action** d'au moins 0,6 s → **378 cuts apprenables** ; 1 SKIP (non compté), 72 sans référence exploitable. Compté par `tools/compteur-gcv2.cjs` (banane), sources `lot18-p6` à `lot18-p15`.
- **Toutes les références de ce lot sont `candidate-observed`** : `usableForTraining: false`, motif `native-reference-requires-explicit-review` (451 sur 451). Les corrections sont donc **candidates**, pas encore des références d'entraînement : elles vont en file, comme le veut le compteur.
- **Listes d'ESV** : « corrections constatées 0 » sur les 10 parties, y compris celles dont les cuts avaient été mémorisés (parties 7, 9, 12, 13, 14, 15). Les corrections du lot ne se voient donc **pas** par la comparaison de listes ; c'est l'Écho qui les porte. Écart à comprendre, pas à corriger ici.
- Journal : 104 346 événements, 65 types ; `closureSummary` = STOPPED, 211 validés complets, 8 différés ; build `a19c5ed5` (Vision 20), Chrome 157 sur Windows, 14 cœurs, mémoire JS du panneau 518 Mo pour une limite de 4 192 Mo. Analyse des défauts : rapport séparé, hors de ce dossier.

## Ce que ce dossier ne contient pas
- Aucune analyse de la justesse des poses de ce lot (pas d'Écho final, pas de jugement) : les 96 corrections disent ce que l'opérateur a déplacé, pas ce qu'Ariane aurait dû poser.
- Aucune donnée de terrain dans les fichiers ajoutés par l'analyse : les dérivés restent ici, jamais dans `banane`.
- **D-379 (19/11)** : les parties 6 à 15 restent **réservées** ; le manifeste des parties n'est pas modifié. Les 96 corrections sont comptées et restent **en file** : elles ne servent pas à entraîner, elles servent à juger (rappel atteignable 78,6 % sur les corrections de plus de 10 mm).
- Revue par critères (`banane/chantiers/CH-140/revue-references.cjs`) : **59 corrections sur 92 acceptées** ; `derive/revue-corrections.csv` porte les 92 avec le critère qui échoue pour chacune.
