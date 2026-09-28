# Kit de l'audit qualité 4.8 (28/09/2026)

Matériel de l'audit qualité globale d'Ariane 4.8.0 (code, performances,
données, UX/UI). Consigne de l'auditeur : `banane/consignes/chantier-8-auditeur.md`.
Session réelle demandée à l'opérateur : `banane/consignes/chantier-8-operateur.md`.

## 1. L'extension

- Paquet audité (retiré depuis, remplacé après l'audit par
  `../2026-09-28_ariane-480-final/`) : `ariane-v4.8.0.zip` du matin, SHA-256
  `d38742903b9ecaf3910ec34846cdc72b6ba1646586a1b549fad54c6e1b1fe58f`
  (construit depuis `a68201a` de `banane`, reproductible). Chargeable dans Chromium ou Edge (« Charger l'extension
  non empaquetée » sur le dossier décompressé).
- Sans ESV (application web privée, accès authentifié), le panneau s'ouvre
  mais aucun lot ne tourne. Le comportement dans ESV se lit dans les exports
  ci-dessous, et se rejoue avec l'ESV simulé des essais
  (`banane/tests/fixtures.cjs`, `tests/helpers/`).
- Parcours du menu : `../2026-09-27_ariane-480/` : 6 captures (clair et
  sombre) et une vidéo MP4. **États simulés** à partir du vrai journal du lot
  de la partie 12, affichés dans le vrai panneau (script `demo.cjs`) ; ce
  n'est pas une session dans ESV.

## 2. Les lots représentatifs

| Nom | Version | Ce que le lot montre | Relu | Fichiers légers ici | Complet |
|---|---|---|---|---|---|
| `p12-lot-4720` | 4.7.20 | lot complet sur une partie neuve (1–8144, 106 cuts), mené à sa borne | oui, complet (`p12-relecture`) | journal, diagnostic | 207 Mo |
| `p12-relecture` | 4.7.21 | relecture Écho (ex-Natif) du lot ci-dessus : la référence humaine | — | — | 69 Mo |
| `p11-lot-4720` | 4.7.20 | lot interrompu par l'opérateur (deux pauses, retours en arrière, Arrêter) | non | journal, diagnostic | 292 Mo |
| `p9-lot-4718` | 4.7.18 | long lot (348 cuts avec le suivant), partie de validation | ciblée (`p9-relecture`) | diagnostic (pas de journal exporté) | 565 Mo |
| `p9-lot-4719` | 4.7.19 | reprise des différés du lot ci-dessus | ciblée | journal, diagnostic | 203 Mo |
| `p9-relecture` | 4.7.19 | relecture Écho partielle de la partie 9 | — | — | 732 Mo |
| `p6-lot-4719` | 4.7.19 | reliquat (cuts laissés par d'autres), fin sur « adaptateur sans réponse » | non | journal, diagnostic | 433 Mo |
| `p13-4721` | 4.7.21 | bilan de 15:47 : cinq lots des parties 13 et 14, ESV lent, arrêts (KI-063) | non | bilan sans nuages | 214 Mo |
| `p14-4721` | 4.7.21 | bilan de 19:36 : les mêmes lots et la suite (contient `p13-4721`) | non | bilan sans nuages, diagnostic | 538 Mo |

Aucun lot n'a encore tourné sous la 4.8.0 : elle vient d'être validée.

**Fichiers légers** (`lots/`, 7 Mo) : journaux et diagnostics tels
qu'exportés, compressés en `.json.gz` (`zcat`, ou `zlib` de Node).
Les bilans 4.7.21 sont fusionnés (`tools/merge-segments.cjs`) et **sans les
nuages** (champ `kitNote`) ; tout le reste y est tel quel.

**Complet** : `python3 extraire.py DESTINATION [NOM …]` sort les archives de
l'opérateur de `collections/` (3,2 Go en tout ; `pip install py7zr` ou
`7z`). `python3 extraire.py --liste` donne la correspondance nom → archives.
Les grosses sessions demandent `node --max-old-space-size=12000`.

Les exports : **journal** (état et événements), **bilan** (journal et nuages
LiDAR, en segments), **diagnostic** (décisions d'Orbite, cut par cut),
**corpus** (captures LiDAR pour le banc), **natif** (session Écho). Formats :
`banane/DATA_REGISTRY.md`, `banane/NATIVE_MODE.md`.

## 3. Mesures de temps sur le terrain

`mesures/` : un rapport par lot, produit par `banane/tools/perf-lot.cjs` à
partir des fichiers légers ci-dessus. Reproduire :

    node tools/perf-lot.cjs KIT/lots/p12-lot-4720/banane-journal-v4-1790404362008.json.gz --md sortie.md
    node tools/perf-lot.cjs KIT/lots/p14-4721/bilan-p14-4721-sans-nuages.json.gz --tous --md sortie.md

| Lot | Cycle par cut (médiane / p90) | Lecture LiDAR (médiane / p90 / max) | GCV1, capture → proposition (médiane / p90) |
|---|---|---|---|
| p12, 4.7.20 | 8,3 / 9,8 s | 5,7 / 6,4 / 10,1 s | 372 / 593 ms |
| p11, 4.7.20 | 8,5 / 9,7 s | 6,1 / 6,8 / 7,5 s | 592 / 889 ms |
| p9, 4.7.19 | 9,8 / 11,8 s | 5,7 / 7,7 / 9,1 s | 587 / 819 ms |
| p6, 4.7.19 | 13,3 / 33,0 s | 5,2 / 6,7 / 8,2 s | 935 ms / 3,5 s |
| p13–p14, 4.7.21 | 9,9 / 17,4 s | 4,6 / 9,0 / 30,0 s | 742 ms / 1,9 s |

Ce que ces exports **ne mesurent pas** : la mémoire, le fil principal de la
page ESV, la réactivité du panneau, le coût des écouteurs DOM. Il faut la
session réelle (`chantier-8-operateur.md`) ou une mesure de l'auditeur.

## 4. Jugements et rapports déjà établis (dépôt `banane`)

Reproduire le jugement de la partie 12 (vérifié le 28/09 depuis ce kit :
C1 84/106 = 79,2 %, 2 faux sur 84 jugés, 0 paire hors contrat) :

    python3 extraire.py X p12-lot-4720 p12-relecture
    node --max-old-space-size=12000 tools/acceptance-report.cjs --lot X/p12-lot-4720=p12 --relecture X/p12-relecture

- Relecture de la partie 12 : `audit/relecture-p12-2026-09-26.md`,
  `audit/acceptance-p12-2026-09-26-4720-relecture.json`.
- Partie 9 : `audit/relecture-p9-2026-09-26.md`.
- Interruptions 4.7.21 : `audit/interruptions-4721-2026-09-26.md`.
- Rapport de sortie : `audit/rapport-sortie-4.8.md` (`tools/sortie-report.cjs`).
- Audits indépendants précédents : `audit/mi-parcours/AUDIT_ASTRA.md`,
  `audit/chantiers/relecture-478.md`, `audit/chantiers/relecture-4716.md`.
