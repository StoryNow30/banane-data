# Partie 9 — référence du 25/09/2026

Tous les exports Pilote de la partie 9, réunis pour y revenir. Les archives
restent dans leurs collectes (aucune copie) : cinq fichiers, 104 Mo au total.
Une archive unique dépasserait la limite de GitHub (100 Mo par fichier).

| Dossier | Version | Lot | Exports |
|---|---|---|---|
| `lot-4718` | 4.7.18 | 346 cuts, 0–8539, 262 appliqués | diagnostic + corpus (9 segments) |
| `lot-4719` | 4.7.19 | 85 cuts, 638–8541 (différés du précédent), 14 appliqués | journal, bilan, diagnostic, corpus |

Extraction, avec contrôle des empreintes (`pip install py7zr`) :

    python3 benchmarks/partie-9-2026-09-25/extraire.py /chemin/vers/dossier

Puis, dans banane : `node tools/acceptance-report.cjs --lot DOSSIER/lot-4718=p9-4718 --lot DOSSIER/lot-4719=p9-4719 [--relecture …]`.
La ligne « partie 9 » du rapport additionne les deux lots (431 cuts, 276 posés) ;
sur la partie, les cuts distincts sont 348 (0–8541), dont 276 posés par le Pilote.

**Rôle : validation.** La partie 9 n'a servi à régler aucun curseur. Elle
garde cette valeur tant qu'aucune règle n'est calée dessus ; tout réglage fait
sur elle la fait passer en « réglage » (rapport de sortie 4.8).

À venir : la relecture Natif de l'opérateur. Analyses : banane,
`audit/lot-4718-p9-2026-09-25.md` et `audit/lot-4719-p9-2026-09-25.md`.
