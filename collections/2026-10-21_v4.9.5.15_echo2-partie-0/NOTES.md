# Collecte 2026-10-21_v4.9.5.15_echo2-partie-0

Ariane 4.9.5.15 (test 15), **second Écho de la partie 0 du troisième projet** (confirmé par Mic le 21/10), 21 octobre 2026, après le lot Orbite du 20/10 (`2026-10-20_v4.9.5.15_partie-0`) et le premier Écho (`2026-10-21_v4.9.5.15_echo-partie-0`, fait sur les cuts restés rouges). Celui-ci est le passage sur **toute la partie** : verts posés compris.

Session Écho `d68f1c57…` du 21/10/2026, de 8 h 37 min 50 s à 9 h 05 min 49 s (heure de Paris), **543 visites** au dernier export, une seule partie (0). Départs vus : 20/10 à 19 h 07 (9 064 validés, 336 invalides) et 21/10 à 8 h 24 (9 372 validés, 28 invalides). Liste d'ESV relue à 8 h 37 min 51 s (9 400 lignes), aucun cut d'Ariane mémorisé.

## Envois (huit zips, tels qu'envoyés)

| Envoi | Heure (Paris) | Visites | Segments |
|---|---|---|---|
| `…T06-48-08-auto.zip` | 8 h 48 | 203 | 4 et 5 |
| `…T06-54-08-auto.zip` | 8 h 54 | 287 | 6 et 7 |
| `…T06-59-59-auto.zip` | 8 h 59 | 334 | 8 et 9 |
| `…T07-02-10-auto` (2 volumes) | 9 h 02 | 432 | 10 et 11 |
| `…T07-05-11-auto` (2 volumes) | 9 h 05 | 540 | 12 et 13 |
| `…T07-05-53.zip` (final, « Terminer et télécharger ») | 9 h 05 | 543 | 1 |

**Écart à signaler :** les segments **2 et 3** n'ont pas été reçus (la numérotation passe de 1 à 4). Les visites et événements sont dans le premier segment (final) ; si les segments 2 et 3 portent des enregistrements lourds, ils manquent peut-être. À vérifier avant toute jointure, et à demander à Mic s'il existe un export plus ancien de la séance.

## Notes de Mic (21/10, texte reçu avec l'envoi)

- Cuts **26, 146, 212, 250, 296, 602** : verts isolés, non visités par la relecture.
- Cut **2100** : vert isolé ; à faire avant et après.
- Cut **440** : rouge isolé, non vérifié une fois avant et une fois après.
- Cuts **463, 468, 473** : même défaut ; ce petit regroupement forme une grappe que Mic contrôle entièrement pour éviter de laisser trop de verts en trou.
- Défauts mineurs relevés jusqu'au cut 722 environ : Mic n'a pas tout signalé, seulement les cas les plus représentatifs des défauts de la relecture. Dans l'ensemble, « c'est bien, la relecture fonctionne bien », avec quelques lacunes (visibles dans ses visites).
- Beaucoup de visites sans modification : Mic les estimait très bonnes.
- Le reste est « impeccable » : Mic n'a pas visité tous les cuts validés, le seuil de confiance étant très élevé ; il voit sur la carte que c'est bien posé.
- Mic a donné son go à l'analyse avec cet envoi.

## Contrôles

- SHA-256 recalculés après copie et comparés aux originaux téléversés : identiques (8 sur 8). Empreintes dans `echo 09h05/SHA256SUMS`.
- CRC des 8 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo 09h05` | 8 zips, `SHA256SUMS` | 87,9 Mo (87 887 957 octets) |

## Suite (21/10/2026)

Joint au premier Écho et au lot pour la vérité de la partie 0 ; mis en apprentissage le 21/10 (décision D-224) après examen à réglages figés : voir `2026-10-21_v4.9.5.15_echo-partie-0/NOTES.md`. Segments 2 et 3 absents : les 543 visites sont toutes présentes, 641 nuages sur 2 234 manquent (91 des 113 premières visites) ; la vérité n'en dépend pas.
