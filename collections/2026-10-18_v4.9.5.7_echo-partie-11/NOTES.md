# Collecte 2026-10-18_v4.9.5.7_echo-partie-11

Ariane 4.9.5.7 (test 7), **Écho de la partie 11**, 18 octobre 2026, de 12 h 32 à 12 h 54 (heure de Paris) : **731 visites**. C'est la relecture par Mic de la partie 11 après le lot Orbite et la relecture automatique en mode « corriger » de 9 h 39 à 9 h 50 (collection `2026-10-18_v4.9.5.7_partie-11`). Départ de l'Écho : 9 780 validés, 12 invalides (les 12 différés du lot), total 9 792. Au départ de l'Écho, l'instantané de la liste d'ESV compare 118 cuts d'Ariane mémorisés : **0 correction constatée** (rien n'avait été touché avant l'Écho).

Exports envoyés par Mic et archivés le 18/10/2026, **tels qu'envoyés** (zips d'origine). Leurs empreintes sont dans `SHA256SUMS`. Vérifié avant dépôt : aucune identité d'opérateur, aucune adresse (pas de courriel, pas d'adresse web ; seulement des champs génériques comme `operatorIntent` et l'agent de navigation).

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo p11 12h32` | 11 zips : 8 sauvegardes automatiques (heure UTC dans le nom : 10 h 35, 10 h 38, 10 h 40, 10 h 42, 10 h 45, 10 h 48, 10 h 50, 10 h 52 en 2 volumes) et l'export final de 10 h 54 UTC (12 h 54 à Paris) en 2 volumes | 113 Mo |

Les sauvegardes automatiques sont cumulatives (segments 01 à 15). L'export final (`…10-54-08-seg01` et `seg02`, 2 volumes) contient l'ensemble ; recoller avec `node tools/merge-segments.cjs`.

## Notes de Mic sur la partie 11 (message du 18/10/2026)

Zones et marges telles que Mic les a contrôlées, à comparer avec ce qu'Ariane a relu (zones d'ADV d'Ariane : 6425–6488, 7288–7350, 7388–7470, 8223–8290 ; PN d'Ariane : 4558–4581, 5528–5551, 7476–7488, 8369–8391, 8785–8805, 9176–9196, 9568–9586) :

- Premier PN « commençant à 4458 » (à lire probablement 4558, le PN détecté est 4558–4581) : très bien.
- Second PN à 5528 : très bien, **seul le cut 5546 est à revoir**.
- **Cut 6391, dans un cœur d'ADV : la pose est mauvaise, et la vérification avec la marge n'a pas été faite.** Mic a commencé ce contrôle au cut 6362 et a vérifié tous les cuts jusqu'au 6424, car la deuxième zone d'ADV était proche.
- Deuxième zone d'ADV contrôlée jusqu'au cut 6480 ; **aiguille au cut 6456**.
- **Cut isolé 7177 : Ariane a oublié de contrôler le cut d'avant et le cut d'après** cet isolé.
- Zone d'ADV commencée au cut 7299, **sans aiguille** (on reste sur la même voie). Mic contrôle jusqu'au cut 7385, car une autre zone d'ADV est proche ; **aiguille au cut 7390** ; fin de marge des zones d'ADV successives au cut **7456**.
- Nouvel ADV avec marge commencé au cut **8229** ; **fin d'aiguille au cut 8257** ; fin du contrôle de marge d'ADV au cut **8309**.
- « Le reste c'est très bien, j'ai contrôlé tous les cuts demandés. »
- **Rappel de Mic : un cut corrigé = un cut appris pour GCV2.**
