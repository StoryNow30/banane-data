# Collecte 2026-09-29 — Ariane 4.8.5 test 1 (version 4.8.5.1)

Lot de validation J2 sur la partie 25, exécuté par l'opérateur avec le paquet
« Ariane 4.8.5 TEST » (test 1), premier cut = 0, dernier cut = vide.

- `lot p25/LOT_25.7z` : export « Tout télécharger pour l'analyse » (journal du lot,
  ~2 100 événements, 81 cuts distincts). SHA-256 dans `lot p25/SHA256SUMS`.
- Aucune relecture Écho pour l'instant : C4 non évaluable.
- Analyse : `audit/lot-485-p25-2026-09-29.md` (dépôt banane).
- La partie 25 était déjà validée aux 99 % (8 450 cuts sur 8 530 au départ du lot) :
  le lot n'a eu que 81 cuts à traiter.
- Fin du lot : pause « Adaptateur ESV sans réponse » après la validation du cut 8338
  (dernier cut visité), sans perte de données ; il restait 12 cuts non validés,
  tous différés par Orbite.
