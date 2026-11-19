#!/usr/bin/env bash
# CH-139 : les trois mêmes rejeux, mais avec l'écriture de la passe D'AVANT D-363 (arrêt au premier refus visible),
# celle des chiffres publiés le 14/11 (D-357). Patch de mesure `plafond-arret-v18.patch` (copie hors dépôt),
# qui restaure le bloc plafond du banc tel qu'à la Vision 18. Sert au CONTRÔLE DE DÉPART : 571 → 603 différés,
# 29 → 0 poses > 50 mm, 501 → 503 poses ≤ 10 mm. Le livré d'aujourd'hui (D-363, 17/11) est mesuré par rejeux.sh.
# Usage : CH116_TRAVAIL=<dossier> bash rejeux-v18.sh [<dossier du dépôt banane>]
set -euo pipefail
ICI="$(cd "$(dirname "$0")" && pwd)"
BANANE="${1:-${BANANE:-/home/opencode/banane}}"
export CH116_TRAVAIL="${CH116_TRAVAIL:-/home/opencode/.ariane/tmp-CH-139/travail}"
BANC="$BANANE/chantiers/CH-116/outils/banc.cjs"
LEV='{"deuxiemePasse":2,"passe2Leviers":{"sansVoieRien":true}'
node "$BANC" rejouer --nom ch139-livre-zjp-v18 --patch "$ICI/plafond-arret-v18.patch" --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":false}"
node "$BANC" rejouer --nom ch139-N-zjp-v18 --patch "$ICI/plafond-arret-v18.patch" --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":true}"
node "$BANC" rejouer --nom ch139-sans-branche-v18 --patch "$ICI/plafond-arret-v18.patch" --patch "$ICI/sans-branche.patch" --env BANC_ZONES=journal --env BANC_PASSE_PLAFOND=10 --env BANC_LEVIERS="$LEV,\"ancre\":true}" --env BANC_PASSE_SANS_BRANCHE=1
