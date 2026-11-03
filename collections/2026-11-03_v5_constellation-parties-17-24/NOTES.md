# Constellation parties 17-24 (version 5.0.0), export du 03/11/2026

- Parties 18 à 24 menées par la file ; fin normale de chaque partie (7 bilans).
- ÉTABLI : à 11:23:34-11:25:21 UTC, trois captures durent 41, 90 et 90 s ; pendant ce temps la navigation de la relecture puis de la file est refusée « occupé » (6 essais, 11,75 s) et la file s'arrête à 11:25:26 sur la partie 18.
- ÉTABLI : la demande d'éveil (niveau system) était tenue de 10:45:45 à 11:25:30 puis de 11:28:00 à 14:29:50 ; le PC est pourtant tombé en veille (témoignage de l'opérateur) : captures figées, pause de 74 min à 12:50:07 (« Lecture LiDAR instable… F5 »), reprise manuelle à 14:03:54.
- PROBABLE : le niveau system ne retient pas la veille moderne de Windows écran éteint ; correction CH-045 : niveau display, attente occupé ~106 s, événement veille-detectee.
