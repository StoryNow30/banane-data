# Collecte 2026-10-23_v4.9.5.19_echo-partie-0

Ariane 4.9.5.19 (test 19), **deux sessions Écho sur la partie 0** (projet non précisé par Mic), 23 octobre 2026, après le lot de la partie 0 du même jour (cache `2026-10-23_cache-tests-18-19_export-18-volumes`, 91 différés). Mic corrige les cuts restés rouges.

## Les deux sessions

| Session | Heures de Paris | Visites (dernier export) | Fichiers reçus | Export final |
|---|---|---|---|---|
| `2ba76db8…` | 13 h 49 à 14 h 41 | 110 | 5 zips | oui (`…T12-41-17.zip`) |
| `25fee01e…` | environ 14 h 54 à 16 h 04 | 977 | 52 zips (segments automatiques, volumes sur 2 et 3, export final en trois volumes `…T14-04-04-volume0N-sur03.zip`) | oui |

Départs de la partie 0 lus dans les CONTENU.txt : 10 h 03 (535 invalides, lot du matin) ; **13 h 49 min 40 s : 9 915 validés, 91 invalides** ; 14 h 26 min 57 s : 9 911 validés, 90 invalides ; 14 h 41 min 33 s : 9 911 validés, 90 invalides (juste avant le second lot de la partie 0, voir `2026-10-23_v4.9.5.19_partie-0-lot-2`). Aucun cut d'Ariane mémorisé pour la partie 0 dans la liste relue de l'Écho.

Les segments se fusionnent avec `node tools/merge-segments.cjs` (les visites et les événements sont dans le premier segment). Le nombre de visites de chaque fichier est dans son CONTENU.txt. Je n'ai pas vérifié ici que les segments de la session `25fee01e…` se recollent sans trou : à contrôler avant analyse.

## Archivage

Archivé tel qu'envoyé du 23/10/2026 : les 57 zips d'origine, préfixe de téléversement retiré du nom (quatre zips reçus en double ont le même contenu, un seul gardé). Contrôles :

- SHA-256 de chaque copie comparé à l'original téléversé avant suppression de l'original : identiques. Empreintes dans `echo 14h41/SHA256SUMS`.
- CRC des 57 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

Rien n'est analysé ni jugé ici : Mic a demandé d'attendre son go.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo 14h41` | 57 zips, `SHA256SUMS` | 537,9 Mo (537 928 935 octets) |
