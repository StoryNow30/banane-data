# Constellation (4.9.5.31), parties 0 puis 1, 02/11/2026 (UTC ; Paris = UTC + 1)

Mesuré (ÉTABLI, journal) :
- Partie 0 : lot 08:06:38 à 08:18:48 (`batch-stopped-at-end` « dernier-cut-valide », dernier cut 9663, décidé 111 ms AVANT la validation de ce cut) ; Rattrapage 08:19:15 à 08:19:52 : 10 cuts écrits (122 à 125, 169, 329 à 331, 346, 347) ; relecture 08:19:52 à 08:28:44 ; changement vers la partie 1 par la file (08:28:45 à 08:28:55).
- Partie 1, premier lot : erreur « Délai dépassé dans ESV à l'étape capture-wait » au cut 535 (08:39:01), file arrêtée. Relancé à 09:02:00 (nouvelle file d'une partie, lot du cut 535 à la fin de la partie).
- Partie 1, second lot : à 09:09:25,101 la validation du cut 3080 (`validateAndNext`) est acceptée ; ESV émet aussitôt `railPairUpdated 3080 valid`, `railPairSelected 10027` puis `newPart 2` : ESV quitte la partie 1 pour la partie 2 (rechargement de la page, port de l'adaptateur fermé) ; la capture du cut 10027 échoue (« page ESV rechargée ou fermée ») ; `batch-error` ; le lot s'arrête sans Rattrapage ni relecture de la partie 1. L'opérateur arrête la file à 09:13:39.
- Contraste avec la partie 0 : le moteur y a reconnu le dernier cut (« dernier-cut-valide ») avant sa validation ; ici il attendait encore le cut 10027.
