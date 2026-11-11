# Constellation « Vision 14 » du 11/11/2026 (parties 18, 19, 20)

Build 5e8d305. Heures en UTC.

## Mesuré (ÉTABLI, `tools/bilan-lot.cjs`, `chantiers/CH-107/outils/relecture-cuts-vides.cjs`)
- Lots : 18 : 60 validés, 4 différés ; 19 : 45, 1 ; 20 : 89, 3 (lot relancé à la main après l'erreur). Intervalle médian 1,2 s (P90 2,5 s) ; capture au cut suivant 213 ms (P90 807 ms).
- Relecture : 18 : 391 relus, 1 cut sans point, 46 corrigés ; 19 : 324, 0, 31 ; 20 : 205, 0, 15. Aucune correction sur un cut sans point ni peu dense.
- Huit réponses 502 d'ESV, mais au plus 3 par vie de page (la page se recharge à chaque changement de partie) : Potree ne s'est jamais bloqué. Confirme D-342 : le blocage vient au 4e échec.
- Partie 20, 21:13:10, cut 89 : capture en échec « La caméra a changé pendant l'export. Garde la vue immobile et réessaie. », lot en ERREUR, Constellation arrêtée (refus-lot). Aucun geste de l'opérateur au journal dans les 20 s d'avant. Lot relancé à la main à 21:13:51, fini à 21:16:02 ; relecture finie.
