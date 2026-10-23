# Collecte 2026-10-23_cache-tests-18-19_export-18-volumes

Export allégé du cache de l'extension, 23/10/2026 à 13 h 42 min 22 s (heure de Paris), versions 4.9.5.18 et 4.9.5.19 (tests 18 et 19), demandé par l'orchestrateur pour la base d'autonomie, la part de cuts laissés sans pose et les durées par partie. **18 volumes, 17 reçus** : il manque le **volume 17** (31 842 Ko d'après Mic, trop gros pour le téléversement ; à envoyer en parties de 20 Mio, voir plus bas). Chaque volume est un zip complet, il faut les 18 pour l'export entier.

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

Archivé tel qu'envoyé le 23/10/2026 : les 17 zips d'origine, préfixe de téléversement retiré du nom. Contrôles :

- SHA-256 recalculés après copie et comparés aux originaux téléversés : identiques (17 sur 17). Empreintes dans `export 13h42/SHA256SUMS`.
- CRC des 17 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

Rien n'est analysé ni jugé ici : Mic a demandé d'attendre son go.

## Volume 17 manquant

Le fichier fait 31 842 Ko, au-dessus de la limite de téléversement. Les parties de 20 Mio (`.part001`, `.part002`) se recollent par concaténation ; Mic envoie aussi le SHA-256 du fichier entier (`Get-FileHash`) pour vérifier le recollage.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `export 13h42` | 17 zips (volumes 1 à 16 et 18 sur 18), `SHA256SUMS` | 273,1 Mo (273 087 221 octets pour les zips) |
