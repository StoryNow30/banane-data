# Ariane 4.8.0 — paquet final (28/09/2026, après l'audit qualité)

`ariane-v4.8.0.zip`, SHA-256 dans `ariane-v4.8.0.zip.sha256`
(`38aa29a2…`), construit depuis `fabd77e` de `banane` (branche
`claude/banane-48-cahier`) par `git archive` + `tools/package.py` ; deux
constructions identiques. Il inclut la pose au pixel près (KI-065, essai
terrain du 28/09) ; il remplace le paquet `76e435e9…` (depuis `c21636c`). Il
**remplace** le paquet du matin (`d3874290…`, depuis `a68201a`, retiré de
`../2026-09-27_ariane-480/`) : la version reste 4.8.0 (direction), avec les
corrections de l'audit qualité d'Astra (D-059, KI-064).

Contrôles sur ce paquet, chargé dans Chromium comme extension :
- service worker 4.8.0, cerveau actif, `lot-decision-v6`, vues sans erreur ;
- « Tout télécharger pour l'analyse » : 4 fichiers confirmés quand le
  navigateur accepte ; « Export incomplet — … non enregistré » quand il
  refuse (`banane/tools/navigateur-telechargements.cjs`).

Captures (clair, sombre) et vidéo MP4 du menu, rendues par `demo.cjs` du
dossier du 27/09 sur ce paquet : mêmes états simulés que le 27/09, plus
`4b-orbite-fin-*` (lot de la partie 12 arrêté à sa borne : couverture
84 sur 106, « Tout télécharger » en bouton principal).
