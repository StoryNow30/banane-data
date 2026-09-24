# Collecte du 24/09/2026 — Banane 4.7.9, lot Pilote, fin de la partie 31

Archive de l'opérateur, inchangée : corpus LiDAR, diagnostic GCV1, bilan du lot.
Le journal, oublié dans l'archive, a été livré à part
(`banane-journal-v4-1790239609979.7z`, JSON compressé, contenu inchangé) : même
lot `a112f939…`, 47 cuts traités et 30 différés, cohérent avec le bilan ; les
chiffres ci-dessous sont identiques avec l'un ou l'autre. Lot 5062 → 9230,
arrêté ; fin difficile, nuage saccadé. L'interrupteur « cerveau de placement »
était éteint : sans effet sur un lot Pilote GCV1 (les 78 décisions sont du
moteur GCV1).

| 78 cuts distincts (D-038) | Cuts |
|---|---|
| Pilote, appliqués | 47 (60,3 %) ; différés 14, refusés par l'écartement 16 |
| Décision sur le lot, consignée par la 4.7.9 | 72 (92,3 %) — premier passage 48, fenêtre 14, choix 10 |

Parité entre la décision consignée et le rejeu hors ligne : **78/78** (KI-048
corrigé, vérifié sur le terrain).

## Relecture Natif (4.7.9)

Dossier `relecture p31 fin/` : deux archives de l'opérateur, inchangées
(10 segments, 236 visites, 234 cuts, 122 validés, 1 968 nuages, aucun
manquant). Jugement aux règles D-038 et D-040 :

| | Cuts | Faux / jugés |
|---|---|---|
| Pilote 4.7.9, appliqués | 47 / 78 | **0 / 45** (14 validés, 31 acceptés sans retouche) |
| Décision sur le lot | 72 / 78 | **1 / 69** — cut 7026, rail droit à 20 mm |

Le cut 7026 est un CHOIX fait avec un seul appui (7023) : la voie prédit
bien le rail (3 mm), mais le moteur n'a aucun minimum à cet endroit ; le seul
minimum à moins de 15 mm est à 17 mm du rail validé. La condition de la
4.7.10 (D-041 : 0 faux) n'est pas remplie.
