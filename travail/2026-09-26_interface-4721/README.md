# Interface 4.7.21 — captures et vidéo du mouvement (26/09/2026)

`demo.cjs JOURNAL.json SORTIE/` rejoue le vrai lot 4.7.20 de la partie 12
(journal de `collections/2026-09-26_v4.7.20_/`) dans le panneau 4.7.21, sous
Chromium sans écran, API Chrome simulée : le lot avance d'un cut toutes les
1,4 s, l'étape passe capture → pose → validation. Depuis la racine de `banane`
(ou `BANANE=/chemin/vers/banane`).

- `pilote-mouvement.webm` : 12 s du Pilote en mouvement (numéro qui roule,
  étapes, ligne qui glisse, curseur, tuiles, activité).
- `pilote-sombre.png`, `pilote-sombre-apres.png`, `pilote-clair.png` : Pilote
  en cours (captures prises en plein mouvement : un chiffre peut être flou).
- `pilote-nouveau-lot.png` : après un lot arrêté, « Nouveau lot » : bornes
  remplies par Banane (715 → 8146), « Démarrer » en bouton plein (KI-062).
- `accueil-sombre.png`, `natif-sombre.png` : sans l'Assisté.

Aucune erreur de page sur les cinq vues.
