# Collecte 2026-10-23_cache-tests-18-19_export-18-volumes

Export allégé du cache de l'extension, 23/10/2026 à 13 h 42 min 22 s (heure de Paris), versions 4.9.5.18 et 4.9.5.19 (tests 18 et 19), demandé par l'orchestrateur pour la base d'autonomie, la part de cuts laissés sans pose et les durées par partie. **18 volumes, les 18 reçus** (le volume 17, 32 605 691 octets, trop gros pour le téléversement, est arrivé en deux parties de 20 Mio, recollées). Chaque volume est un zip complet, il faut les 18 pour l'export entier.

Période couverte : **depuis le 23/10/2026 09 h 05 min 45 s** ; Mic a vidé à la main les données précédentes avant cette journée (l'export ne contient donc pas les ~30 parties jouées avant). Lu dans le CONTENU.txt du volume 1 :

| Départ de la partie (heure de Paris) | Partie | Validés | Invalides | Total |
|---|---|---|---|---|
| 23/10 08 h 33 min 56 s | 29 | 9 362 | 85 | 9 447 |
| 23/10 09 h 07 min 05 s | 33 | 8 488 | 201 | 8 969 |
| 23/10 09 h 41 min 12 s | 32 | 9 017 | 14 | 9 031 |
| 23/10 10 h 03 min 38 s | 0 | 9 471 | 535 | 10 006 |
| 23/10 11 h 48 min 41 s | 5 | 9 967 | 61 | 10 028 |

(Le projet de rattachement de ces parties n'est pas précisé par Mic dans cet envoi.) Pour la partie 5, le CONTENU.txt du volume 1 donne : verts à contrôler 44 cuts en 11 plages (environ 2 min 43 s) ; relecture après le lot en mode « corriger » : passe finie, 281 cuts relus sur 281, 18 corrigés, 278 marqués « vu » par ESV. Choix du lot : « Comme avant » (tel quel), règle « grappe de différés » coupée. Rien d'autre n'est lu ni recoupé ici.

## Archivage

Archivé tel qu'envoyé le 23/10/2026 : les 18 zips d'origine, préfixe de téléversement retiré du nom ; le volume 17 est le recollage de ses deux parties (voir plus bas). Contrôles :

- SHA-256 recalculés après copie et comparés aux originaux téléversés : identiques (17 sur 17 pour les volumes envoyés entiers). Empreintes dans `export 13h42/SHA256SUMS`.
- CRC des 18 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

Rien n'est analysé ni jugé ici : Mic a demandé d'attendre son go.

## Volume 17 (recollé)

Le fichier de 32 605 691 octets (31 842 Ko d'après Mic) dépasse la limite de téléversement : il est arrivé en deux parties, recollées par concaténation (`part001` puis `part002`). SHA-256 des parties reçues : `part001` = `0aeb057141f91489b1c82b67b0b044322498437cc008914152a3ad452003a561` (20 971 520 octets), `part002` = `563d65b5b2f22edc85f31361ba1df2f82e3e3bdc89627dabba707ce7828a1f88` (11 634 171 octets). SHA-256 du zip recollé : `a9b4a61ef7d8d7bdc254820a15ba5e4b7248e8bb05dea95391f76769825ce2b2`. L'empreinte du fichier d'origine n'a pas été reçue : le contrôle repose sur la taille annoncée par Mic et sur le CRC du zip, valide. Les parties ne sont pas gardées, seul le zip recollé l'est.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `export 13h42` | 18 zips (volumes 1 à 18 sur 18), `SHA256SUMS` | 305,7 Mo (305 690 940 octets pour les zips) |
