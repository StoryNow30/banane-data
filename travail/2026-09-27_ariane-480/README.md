# Ariane 4.8.0 — le menu, pour la confirmation de la direction (27/09)

Rejoué dans Chromium sans écran, API Chrome simulée, sur le vrai lot 4.7.20
de la partie 12 (journal du 26/09) ; Écho sur 42 visites simulées.

| Fichier | Contenu |
|---|---|
| `1-accueil-{sombre,clair}.png` | Accueil : Écho, Orbite |
| `2-echo-{sombre,clair}.png` | Écho en collecte |
| `3-orbite-{sombre,clair}.png` | Orbite en cours (cut 7787) |
| `4-orbite-details-{sombre,clair}.png` | Détails : « Tout télécharger pour l'analyse », exports, réglages |
| `5-parcours-du-menu.{webm,mp4}` | Parcours (MP4 H.264 pour iPhone) : accueil → Écho → Orbite en mouvement → détails → thème clair → accueil |
| `6-bouton-esv-{sombre,clair}.png` | Bouton d'ouverture au bas d'ESV |

Contrôle dans Chromium : « Tout télécharger pour l'analyse » produit quatre
fichiers (journal, bilan, diagnostic, corpus). Paquet `ariane-v4.8.0.zip`
chargé comme extension : service worker 4.8.0, onglets Écho et Orbite, aucune
erreur.

    node demo.cjs JOURNAL.json SORTIE/   (ARIANE=/chemin/vers/banane)

## Paquet validé (28/09)

`ariane-v4.8.0.zip` (SHA-256 dans `ariane-v4.8.0.zip.sha256`), construit
depuis `a68201a` de `banane` (branche `claude/banane-48-cahier`), deux
constructions identiques. Voir `banane/PASSATION_4.8.0.md`.
