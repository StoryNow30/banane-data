# Collecte 2026-10-18_v4.9.5.7_partie-11

Ariane 4.9.5.7 (test 7), partie 11, 18 octobre 2026. **Deuxième export de terrain de la test 7.** Lot Orbite parti à 9 h 39 (heure de Paris) sur le cut 1 jusqu'à la fin de la partie, exporté à 9 h 50 en deux volumes zip. Départ de la partie : 9 661 validés, 131 invalides, total 9 792 cuts (taille proche de celle du second projet ; le projet est à confirmer par Mic).

L'export est **cumulatif depuis le début de la session** : il contient aussi le lot de la partie 10 du premier export (`2026-10-18_v4.9.5.7_partie-10`).

Choix du lot : clic « Tout recentré, comme un humain » ; règle « grappe de différés » **coupée** ; relecture après le lot : **corriger** (verts sûrs du PN, de l'ADV et des abords, validés par Maj+Espace).

Exports envoyés par Mic et archivés le 18/10/2026, **tels qu'envoyés** (zips d'origine). Leurs empreintes sont dans `SHA256SUMS`. Vérifié avant dépôt : aucune identité d'opérateur, aucune adresse (pas de courriel, pas d'adresse web ; seulement des champs génériques comme `operatorDecision` et l'agent de navigation).

**Particularité** : le volume 1 contient, comme fichier, une copie exacte du volume 2 (même SHA-256). Le volume 1 pèse donc 27,8 Mo, au lieu des 17 Mo attendus. Les deux volumes sont gardés tels quels.

## Ce que dit le journal

- **Lot de la partie 11** : 6,4 min (9 h 39 à 9 h 45). **131 cuts décidés : 119 posés, 12 différés** (6455, 6456, 6457, 7130, 7320, 7419, 8283 à 8286, 8290, 8292). Le dernier cut (9583) est validé en place par Ctrl+Entrée (chemin existant de fin de partie, D-065). Aucune erreur, aucune pause.
- **Relecture automatique, mode corriger** : partie seule juste après le lot, **4 min 20 s** (estimation affichée : 8 min 42 s). **144 cuts relus** : PN 67, ADV 40, abords 32, écartement 4, vert hors zone 1. **17 corrigés** (11 en PN, 6 en ADV), 0 refusé, **139 cuts marqués « vu »** par ESV ; les 5 autres relus sont des différés du lot (visités, sans écriture). Durée par cut : médiane 1,0 s, P90 4,2 s, maximum 7,5 s.
- **Les 17 corrections** : de 9 à 44 mm sur le pire rail (le rail gauche en latéral dans 13 cas sur 17) ; aucune de 50 mm ou plus. Cuts : 4561, 5535, 6429 à 6434, 8375 à 8377, 8379, 9569, 9570, 9573, 9581, 9582. Quatorze sont dans la liste « À contrôler », trois (6430, 6431, 6432) n'y sont pas. 15 des 17 sont à l'étage « premier passage ».
- **Liste « À contrôler »** : 409 candidats, 63 à contrôler en 18 plages, environ 3 min 53 s.
- **Écritures** : 437 écritures PUT dans le journal cumulé, toutes en 204. Contrat ESV inchangé pendant la séance.
- **Pas d'Écho** pour l'instant : les 17 corrections ne sont pas encore jugées contre la pose de Mic.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `lots 09h50` | 2 zips (volume 1 sur 2, volume 2 sur 2) | 45,5 Mo |
