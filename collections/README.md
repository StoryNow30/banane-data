# Collections terrain

Une collecte correspond à une session ou à un ensemble cohérent de sessions Natif/Pilote servant à l'analyse hors ligne.

Convention de dossier :

`collections/YYYY-MM-DD_<banane-version>_<alias>/`

Chaque dossier doit contenir au minimum :

- `manifest.json` : identité, version Banane, fichiers, tailles, SHA-256, couverture et statut de qualification ;
- `NOTES.md` : observations opérateur et incidents utiles à l'interprétation.

Les exports bruts sont déposés compressés (`.7z`) dans le sous-dossier `raw/` de la collecte, directement dans Git (25 Mo au plus par fichier par le site GitHub ; au-delà, volumes de 24 Mo). Le manifest les désigne par leur chemin, leur taille et leur SHA-256. Les collectes antérieures au 23/09/2026 peuvent pointer vers un asset de Release.

Ne fusionner ni réécrire les exports bruts pour « simplifier » une collecte. Les dérivés doivent avoir leurs propres fichiers et leur propre provenance.
