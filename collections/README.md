# Collections terrain

Une collecte correspond à une session ou à un ensemble cohérent de sessions Natif/Pilote servant à l'analyse hors ligne.

Convention de dossier :

`collections/YYYY-MM-DD_<banane-version>_<alias>/`

Chaque dossier doit contenir au minimum :

- `manifest.json` : identité, version Banane, fichiers, tailles, SHA-256, couverture et statut de qualification ;
- `NOTES.md` : observations opérateur et incidents utiles à l'interprétation.

Les grosses archives brutes restent hors de Git classique. Le manifest pointe vers leur asset de Release ou leur objet LFS.

Ne fusionner ni réécrire les exports bruts pour « simplifier » une collecte. Les dérivés doivent avoir leurs propres fichiers et leur propre provenance.
