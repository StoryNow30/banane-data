# Collecte du 24/09/2026 — Banane 4.7.14, partie 2 : décalage brutal de la pose ESV

Archive 7z de l'opérateur découpée en deux morceaux (`pilote p2 + relecture
ciblee/`), versés tels quels. Réassemblage :
`cat LOT_A_QUESTIONNER.7z.part00{1,2} > LOT_A_QUESTIONNER.7z`, SHA-256 dans
`manifest.json`. Contenu : trois lots Pilote de la partie 2 (cuts 20–138 :
journal, diagnostic GCV1, bilan, corpus LiDAR), une relecture Natif **ciblée**
(34 visites, cuts 110–138, D-048) et une capture d'ESV (cut 112).

**Cas documenté** : à partir du cut 113, la pose de départ d'ESV est décalée
d'environ 200 mm (visible dans la vue de gauche d'ESV). Le Pilote a repris
110–112 depuis la voie (justes), a appliqué **114 à 207,6 mm** (premier passage
sans appui, écartement 1431 mm admissible) et différé 115–126.

| Lot dfe095a5 (86–138), 42 cuts | Cuts |
|---|---|
| Appliqués | 25 (59,5 %) ; lot en pause par l'opérateur |
| Jugés (zone relue) | 11 : **2 faux** — 114 (207,6 mm), 137 (10,6 mm) |

Rejoué avec les règles de la 4.7.15 et la vue d'ESV : 114 est retiré par la
garde de continuité (199,9 mm de la voie) et différé ; 115 et 116 sont placés
(1,5 et 2,6 mm). Analyse : banane, `audit/cas-decalage-esv-p2-2026-09-24.md`.
