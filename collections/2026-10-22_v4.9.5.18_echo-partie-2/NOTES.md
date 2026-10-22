# Collecte 2026-10-22_v4.9.5.18_echo-partie-2

Ariane 4.9.5.18 (test 18), **Écho de la partie 2 du troisième projet (3:2)**, 22 octobre 2026, après le premier lot de la test 18 sur cette partie (`2026-10-21_v4.9.5.18_partie-2`).

Session Écho `e4fc795d…` du 22/10/2026, de 08 h 35 min 12 s à 08 h 42 min 50 s (heure de Paris), **77 visites** au dernier export, une seule partie (2). Version déclarée par la session : 4.9.5.18.

Départ de la partie 2 vu par l'Écho : 08 h 35 min 23 s, 9 555 validés, 1 invalide, total 9 556. Liste d'ESV relue à 08 h 35 min 23 s (9 556 lignes) ; aucun cut d'Ariane mémorisé pour cette partie.

## Envois (trois zips, tels qu'envoyés)

| Fichier | Heure de Paris | Visites | Segments JSON |
|---|---|---|---|
| `…T06-39-13-auto.zip` | 08 h 39 | 41 | 1 |
| `…T06-42-49-auto.zip` | 08 h 42 | 77 | 2 et 3 |
| `…T06-42-57.zip` (final, « Terminer et télécharger ») | 08 h 42 | 77 | 1 |

Chaque zip porte la même liste d'ESV (`ariane-liste-partie2-20261022-063523Z.json`). La fusion des segments se fait avec `node tools/merge-segments.cjs`.

## Observation de terrain à garder

Au moment de lancer un nouvel Écho, le panneau refuse : « La session Écho précédente (77 visite(s)) n'a pas été téléchargée en entier : clique d'abord sur « Télécharger à nouveau la session », ou abandonne-la. » Mic dit rencontrer ce blocage souvent en fin d'Écho. Cause trouvée dans le code (sans correction dans cette collecte) : le panneau acquitte l'export final avec `final: true` mais la commande `native-export-ack` du service worker ne transmet pas ce champ à `ackExported`, donc `finalExportAt` n'est jamais noté. Présent depuis la 4.9.0.18, y compris dans la test 18.

## Archivage

Archivé tel qu'envoyé le 22/10/2026 : les trois zips d'origine, préfixe de téléversement retiré du nom. Contrôles :

- SHA-256 recalculés après copie et comparés aux originaux téléversés : identiques (3 sur 3). Empreintes dans `echo 08h42/SHA256SUMS`.
- CRC des 3 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

Rien n'est analysé ni jugé ici : Mic a demandé d'attendre son go.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo 08h42` | 3 zips, `SHA256SUMS` | 16,6 Mo (16 581 322 octets pour les zips) |
