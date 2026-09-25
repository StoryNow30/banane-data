# Interface H — contrôle de rendu (4.7.20, 25/09/2026)

Captures du panneau Banane 4.7.20 (piste H) dans Chromium, fenêtre 420 × 880,
rendu × 2 : `panel.html` réel, API Chrome simulée, sans ESV. Ce n'est pas le
contrôle visuel §14 H dans Edge (à faire par l'opérateur sur le terrain), mais
il montre le rendu de chaque vue, sans erreur JavaScript.

| Fichier | Vue | État montré |
|---|---|---|
| `pilote-sombre.png`, `pilote-clair.png` | Pilote | lot réel de la partie 6 (journal 4.7.19), remis « en cours » au cut 7501 |
| `natif-sombre.png` | Natif | 42 visites synthétiques, temps par cut et activité |
| `assiste-sombre.png` | Assisté | proposition et écartement synthétiques |
| `accueil-sombre.png` | Accueil | — |

`captures.cjs DOSSIER` refait les captures (Playwright, Chromium dans
`/opt/pw-browsers`) ; il lit `DOSSIER/shots/pilote.json`, l'état du lot, tiré du
journal de la partie 6 (`collections/2026-09-25_v4.7.19_/pilote p6 reliquat/`) :
séquence coupée au cut 7501, état `RUNNING`, étape `capture`.
