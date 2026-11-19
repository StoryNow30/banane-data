# Vision 21 (build `8e62c5dd`), 19/11 : lot des parties 34 à 36 et Échos des parties 28 à 33

Export du 19/11 à 10:46 (Paris), 42 archives, **vérifiées intègres** (`7z t`, 42 sur 42), aucun doublon entre elles.

## Ce que porte la collection

- **27 volumes de lot** (`ariane-lot-2026-11-19T10-46-34-…`, `raw/`) : le lot des parties **34, 35 et 36**, avec son journal (142 005 255 octets, 170 390 événements).
- **15 Échos** (`ariane-echo-…`, `raw/`) : parties **28 à 33**, de 10:02 à 10:32.

## Mesuré dans le journal (ÉTABLI)

| Partie | Cuts vus | Cuts posés | Corrections de relecture |
|---|---:|---:|---:|
| 28 | 80 | 79 | 55 |
| 29 | 282 | 275 | 139 |
| 30 | 235 | 224 | 58 |
| 31 | 152 | 151 | 35 |
| 32 | 108 | 105 | 73 |
| 33 | 72 | 70 | 12 |
| 34 | 207 | 169 | 4 |
| 35 | 48 | 47 | 61 |
| 36 | 6 | 1 | 0 |
| **total** | **1 190** | **1 121** | **437** |

- Lots clos pendant la session : 28, 29, 30, 31, 32, 33, 34, 35, 36 (partie 34 deux fois, deux lots).
- Dernier lot (34–36) : `closureSummary` = **STOPPED**, 1 terminé, 4 différés, 0 sauté, 0 en pause.
- Relecture : 4 522 événements, **437 corrections**, dont **82 (18,8 %)** avec un rail à confiance **0** — 47 en ADV, 17 en écartement, 12 en PN, 6 aux abords. Même ordre de grandeur que le lot du 18/11 (75 sur 267, 28 %), ce qui **confirme que le cas n'était pas isolé** (CH-141, F2).

## Ce qui n'est pas versé ici, et pourquoi

- **30 archives déjà présentes** dans `collections/2026-11-18_v20_lot-parties6-15/` : identiques octet pour octet (même SHA256). Elles n'ont pas été dupliquées.
- **Un export antérieur de la même session** (`ariane-lot-2026-11-19T10-34-26-…`, 27 volumes) : même session, journal de 142 007 122 octets, exporté 12 minutes plus tôt. Non retenu, le 10:46 le remplace ; ses empreintes sont dans `derive/export-10h34-non-retenu.txt`.

## Règles

- `raw/` est **immuable** : aucun fichier n'y est modifié ni renommé. Tout dérivé va dans `derive/`.
- `SHA256SUMS` couvre les 42 archives ; `sha256sum -c SHA256SUMS` **depuis la racine de la collection** (les chemins y sont écrits `raw/…`). Vérifié : 42 sur 42.
- Aucune donnée de terrain ne sort de ce dépôt : ni adresse, ni code projet, ni UUID dans `banane`.
