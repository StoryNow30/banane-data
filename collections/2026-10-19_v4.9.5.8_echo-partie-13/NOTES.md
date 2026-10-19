# Collecte 2026-10-19_v4.9.5.8_echo-partie-13

Ariane 4.9.5.8 (test 8), **Écho de la partie 13 du second projet**, 19 octobre 2026, de 12 h 46 à 13 h 07 (heure de Paris) : **267 visites**. Départ : 12 h 40, 9 751 validés, 21 invalides, total 9 772.

L'Écho suit le **premier lot Orbite de la test 8** sur cette partie, archivé dans `2026-10-19_v4.9.5.8_partie-13`. L'export de ce lot avait été pris pendant la relecture « corriger » en cours (78 cuts sur 118 relus).

Mic signale qu'Ariane « n'a rien lu » et qu'il a revisité en Écho les cuts qu'il avait corrigés, en corrigeant d'autres pendant la revisite. Ce point est **à analyser** ; rien n'en est conclu ici. Le CONTENU.txt de l'export final indique « cuts d'Ariane mémorisés 18 » à l'instantané de 12 h 40, à rapprocher du lot ; pas encore comparé.

Notes de Mic : `notes-de-mic-partie-13.txt` (même dossier), texte tel qu'envoyé.

Exports envoyés par Mic et archivés le 19/10/2026 (heures de Paris), **tels qu'envoyés** (zips d'origine, préfixe de téléversement retiré du nom). Leurs empreintes sont dans `SHA256SUMS` ; chaque copie a la même empreinte que son original téléversé, et le CRC de chaque zip est valide (`zipfile.testzip`, Python en mode isolé).

Contrôle d'identité avant dépôt (`scan_identite.py`, tout le contenu des 5 zips) : **0 courriel, 0 adresse web, 0 identifiant de projet ESV, 0 nom** (décompte vide).

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo p13 12h46` | 5 zips : 4 sauvegardes automatiques (11 h 00 à 11 h 07 UTC, soit 13 h 00 à 13 h 07 à Paris ; la dernière en 3 fichiers JSON) et l'export final de 11 h 07 UTC (13 h 07 à Paris, 267 visites), `SHA256SUMS` | 46,9 Mo (49 152 926 octets) |

Les segments JSON de chaque zip se recollent avec `node tools/merge-segments.cjs` (voir CONTENU.txt de chaque zip).
