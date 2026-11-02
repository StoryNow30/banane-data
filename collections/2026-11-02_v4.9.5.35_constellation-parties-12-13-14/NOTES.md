# Test 35 : première Constellation de trois parties (12, 13, 14), 02/11/2026

Mesuré (ÉTABLI, journal Orbite `ariane-journal-v4`, `tools/juger-lot.cjs` avec l'Écho fusionné par `tools/merge-segments.cjs`, un seul dossier Écho) :
- **Constellation menée jusqu'au bout** : 3 lots (`batch-started` ×3, `batch-stopped-at-end` ×3 « dernier-cut-valide »), 3 changements de partie (`file-parties-changement`, 12→13→14), 3 Rattrapages (`passe-differes-ombre-fin`, mode écriture), 3 relectures (`relecture-fin`, 650 relus, 11 corrigés), aucune erreur de lot (aucun `batch-error`, aucun arrêt `vue-non-restituee-arret`), 4 reconnexions automatiques réussies.
- **Posé** : 233 cuts posés sur 234 cibles (partie 12 : 63/64, partie 13 : 57/57, partie 14 : 113/113), 1 différé.
- **Aurore entre parties par le lien** : 3 passages (`correction-partie`, 14→12, 12→13, 13→14, mode `lien`, 1 tentative chacun), 28 ouvertures de cut (`correction-ouvrir`, toutes `ok`).
- **Qualité jugée** : l'Écho ne couvre que les cuts visités par l'Aurore, 24 jugés sur 233 posés (11 + 9 + 4) : écart pire rail 3D max 9,06 mm, 0 faute, 0 mauvaise voie ; partie 12 médiane 2,97 mm, partie 13 médiane 0,05 mm (1 acceptation, 8 fines), partie 14 médiane 3,2 mm. Budget D-223 : non tranchable (couverture 10 à 17 %, 3,5 % sur la partie 14).
- Le lot « verts à contrôler » de la partie 14 (142 cuts en 60 plages) est dans le volume 1.
- Non établi : le comportement d'ESV à la sortie d'une partie vu sur poste est sain ici (3 passages réussis) ; le retour de la file après rechargement et le passage pendant Écho ne sont pas exercés par cette séance.
