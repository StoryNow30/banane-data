# Collecte 2026-09-26 — Banane 4.7.21 TEST : interruptions du Pilote

Exports de l'opérateur, parties 13 et 14, sans journal ni relecture Natif :

- `interruptions p13-p14/INTERRUPTION_A_VOIR.7z` : bilan exporté à 15:47 ;
- `interruptions p13-p14/LOT_14_INTERRUPTION.zip.part001` à `part005` :
  bilan, diagnostic et corpus exportés à 19:36 (sur-ensemble du précédent).
  Recoller : `cat LOT_14_INTERRUPTION.zip.part00* > LOT_14.zip`.

| Lot | Cuts | Posés | Fin |
|---|---|---|---|
| p13 dès 0, 07:39 | 46 | 33 (71,7 %) | erreur « Vue ESV non recentrée » (326) |
| p13 dès 101, 15:08 | 85 | 69 (81,2 %) | erreur « Vue ESV non recentrée » (536, pose) |
| p13 reprise des différés, 15:30 | 75 | 40 (53,3 %) | clos à tort : ESV muet après 6629, 6758 annoncé |
| p14 dès 1, 15:43 | 1 | 1 | erreur « Export interrompu. » (410) : annulation tardive |
| p14 dès 410, 15:48 | 63 | 57 (90,5 %) | erreur « Vue ESV non recentrée » (6098, pose) |

Aucun arrêt n'a posé de rail faux ni de paire hors contrat. Trois causes,
corrigées en 4.8.0 (KI-063) : banane, `audit/interruptions-4721-2026-09-26.md`.
