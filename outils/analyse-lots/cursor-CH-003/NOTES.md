# Détail par cut du chantier CH-003 (vitesse de la relecture, mesure par phase)

Déposé par l'intégrateur le 28/10/2026, à partir de la branche `chantier/CH-003` du dépôt de code (commit 5c41b95), dossier de transit `depot-banane-data/CH-003/`. L'agent qui a produit la mesure n'a pas d'accès en écriture à ce dépôt : il a transmis les fichiers, l'intégrateur les a copiés.

- `cuts.jsonl` : une ligne par cut relu qui porte des durées (5 344 lignes), par phase.
- `attentes-adaptateur.jsonl` : les 6 attentes `ADAPTER_BUSY` du premier lancement de la partie 0 du 20/10.
- `passes.json` : une entrée par passe (22), sans les cuts.
- `NOTES-origine.md` : la note de l'agent (champs, commande, population), copiée telle quelle.
- `SHA256SUMS` : sommes de contrôle des trois fichiers de données.
- Population : 22 journaux de lots du 18 au 26 octobre 2026, tous en mode « corriger » (aucune passe en mode « ombre »).
- Contrôle d'identité à l'arrivée : aucun courriel, UUID, code de projet, adresse ni nom d'opérateur dans les quatre fichiers.
- Lecture : la synthèse est dans `fiches/VITESSE_RELECTURE_PAR_PHASE_2026-10-28.md` du dépôt de code.
