# Collecte 2026-10-19_v4.9.5.8_echo-partie-7

Ariane 4.9.5.8 (test 8), **Écho de la partie 7 du second projet**, 19 octobre 2026, session de 09 h 21 à 11 h 54 (heure de Paris) : **1 106 visites**.

Départs :
- 09 h 21 : 9 770 validés, 21 invalides, total 9 791 ;
- 11 h 42 : 9 769 validés, 19 invalides, total 9 791.

Aucun cut mémorisé d'Ariane dans cette session. Écart à noter : 9 769 + 19 = 9 788, et non 9 791 (écart de 3, non expliqué).

**Pas de lot Orbite** de cette partie dans cette collecte. Le lot Orbite de cette partie date du 16/10 (Ariane 4.9.5.3) et se trouve dans `2026-10-16_v4.9.5.3_projet2-parties-2-3-4-6-7`, où la partie 7 est notée « partie 7 · validés 9 640 · invalides 151 · total 9 791 ». Le projet 2 est confirmé par le total de 9 791 cuts, identique à celui de ce lot.

Notes de Mic : `notes-de-mic-partie-7.txt` (même dossier), texte tel qu'envoyé. Plusieurs lignes sont incomplètes (« Pn du cut 1975 au », « début zone adv » sans cut avant « aiguille cut 3149 ») ; elles sont recopiées telles quelles. Une question est posée à Mic à ce sujet.

Exports envoyés par Mic et archivés le 19/10/2026, **tels qu'envoyés** (zips d'origine, préfixe de téléversement retiré du nom). Leurs empreintes sont dans `SHA256SUMS` ; les 31 copies téléversées ont la même empreinte que leur original.

Horaires : les noms de fichiers sont en UTC. Les deux sauvegardes de 07 h 25 et 07 h 29 UTC correspondent à 09 h 25 et 09 h 29 à Paris. La session commence à 09 h 21 à Paris, soit 07 h 21 UTC : ces deux sauvegardes sont donc postérieures au départ, et non antérieures comme indiqué dans la demande. Aucune conclusion n'est tirée ici.

Deux volumes trop gros pour l'envoi ont été coupés en morceaux de 20 Mo par Mic, puis recollés et vérifiés (CRC). Empreintes SHA-256 :
- `ariane-echo-partie7-2026-10-19T09-53-23-auto-volume02-sur03.zip` : `9c8ac147fe5105673c61818da5cff57c302d341ae61fb629437e372d8035ec8c`
- `ariane-echo-partie7-2026-10-19T09-54-25-volume02-sur02.zip` : `6cf324e4cf6080c70520f81fcd20339a7ca60b15b5960c9dd8f2481113a43ca2`

Contrôles avant dépôt :
- **Identité** (`scan_identite.py`, tout le contenu des 33 zips, JSON compris) : 0 courriel, 0 adresse web, 0 identifiant de projet ESV, 0 nom d'opérateur (sortie vide, `{}`).
- **CRC** : 33 zips sur 33 valides (`zipfile.testzip`).
- **Volumes** : les 10 sauvegardes en plusieurs volumes sont complètes (01 à MM présents).

## Contenu

Dossier `echo p7 09h21` : 33 zips, 371,6 Mo.

| Session (UTC) | Heure (Paris) | Fichiers | Taille |
|---|---|---|---|
| 07 h 25 (auto) | 09 h 25 | 1 | 5,8 Mo |
| 07 h 29 (auto) | 09 h 29 | 1 | 8,8 Mo |
| 09 h 02 (auto) | 11 h 02 | 1 | 12,5 Mo |
| 09 h 05 (auto) | 11 h 05 | 1 | 12,8 Mo |
| 09 h 08 (auto) | 11 h 08 | 1 | 14,6 Mo |
| 09 h 11 (auto) | 11 h 11 | 1 | 16,5 Mo |
| 09 h 14 (auto) | 11 h 14 | 2 volumes | 19,1 Mo |
| 09 h 18 (auto) | 11 h 18 | 2 volumes | 20,2 Mo |
| 09 h 21 (auto) | 11 h 21 | 3 volumes | 24,1 Mo |
| 09 h 25 (auto) | 11 h 25 | 3 volumes | 28,1 Mo |
| 09 h 29 (auto) | 11 h 29 | 3 volumes | 30,1 Mo |
| 09 h 33 (auto) | 11 h 33 | 3 volumes | 33,1 Mo |
| 09 h 44 (auto) | 11 h 44 | 3 volumes | 34,6 Mo |
| 09 h 49 (auto) | 11 h 49 | 3 volumes | 37,4 Mo |
| 09 h 53 (auto) | 11 h 53 | 3 volumes | 40,4 Mo |
| 09 h 54 (export final) | 11 h 54 | 2 volumes | 33,6 Mo |

Les zips se lisent tels quels avec `node tools/merge-segments.cjs --out SESSION.json --dir DOSSIER` (voir `CONTENU.txt` dans chaque zip).

`SHA256SUMS` : empreintes SHA-256 des 33 zips.
