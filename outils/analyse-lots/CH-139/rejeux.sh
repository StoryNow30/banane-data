#!/usr/bin/env bash
# CH-139 (lot A1 d'Ariane 6) : les trois rejeux de la mesure, sur le corpus de CH-116 (24 lots-parties, 4 016 cuts).
# Banc fidèle : zones du journal (BANC_ZONES=journal), passe livrée fidèle (BANC_PASSE_PLAFOND=10, deuxiemePasse:2, sansVoieRien:true).
#   ch139-livre-zjp    : le livré AVANT le levier N (ancre:false) — référence du contrôle « 29 → 0 ».
#   ch139-N-zjp        : le livré AVEC le levier N (ancre:true, recette v7) — le contrôle de départ (603 / 0 / 503).
#   ch139-sans-branche : N + la variante de mesure « la passe ne pose pas sur branche » (patch hors dépôt, levier BANC_PASSE_SANS_BRANCHE=1).
# Prérequis : CH116_TRAVAIL préparé (extraire.sh, preparer.cjs, corpus.jsonl ; voir NOTE.md).
# Usage : CH116_TRAVAIL=<dossier> bash rejeux.sh [<dossier du dépôt banane>]
set -euo pipefail
ICI="$(cd "$(dirname "$0")" && pwd)"
BANANE="${1:-${BANANE:-/home/opencode/banane}}"
export CH116_TRAVAIL="${CH116_TRAVAIL:-/home/opencode/.ariane/tmp-CH-139/travail}"
BANC="$BANANE/chantiers/CH-116/outils/banc.cjs"
LEV='{"deuxiemePasse":2,"passe2Leviers":{"sansVoieRien":true}'
node "$BANC" rejouer --nom ch139-livre-zjp --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":false}"
node "$BANC" rejouer --nom ch139-N-zjp --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":true}"
node "$BANC" rejouer --nom ch139-sans-branche --patch "$ICI/sans-branche.patch" --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":true}" --env BANC_PASSE_SANS_BRANCHE=1
