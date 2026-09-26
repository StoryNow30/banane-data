# Partie 9 — référence du 25/09/2026

Tous les exports Pilote de la partie 9 et leur relecture Natif, réunis pour y
revenir. Les archives restent dans leurs collectes (aucune copie) : dix
fichiers, 184 Mo au total.
Une archive unique dépasserait la limite de GitHub (100 Mo par fichier).

| Dossier | Version | Lot | Exports |
|---|---|---|---|
| `lot-4718` | 4.7.18 | 346 cuts, 0–8539, 262 appliqués | diagnostic + corpus (9 segments) |
| `lot-4719` | 4.7.19 | 85 cuts, 638–8541 (différés du précédent), 14 appliqués | journal, bilan, diagnostic, corpus |
| `relecture` | 4.7.19 | Natif, 25/09 14:49–15:07, 548 visites, 521 cuts (7–8550) ; relit 151 des 346 cuts du lot 4.7.18 (8066–8503 et 5151–5192 sautés) | 15 segments automatiques (4 vidages) |

Extraction, avec contrôle des empreintes (`pip install py7zr`) :

    python3 benchmarks/partie-9-2026-09-25/extraire.py /chemin/vers/dossier

Puis, dans banane (le diagnostic du lot 4.7.18 couvre aussi les lots des
parties 2 et 3 : `--batch` ne garde que celui de la partie 9) :

    node --max-old-space-size=13000 tools/acceptance-report.cjs \
      --lot DOSSIER/lot-4718=p9-4718 --batch 09d3c4f0-52c4-4245-959f-b180165ce951 --relecture DOSSIER/relecture \
      --lot DOSSIER/lot-4719=p9-4719 --relecture DOSSIER/relecture

La ligne « partie 9 » du rapport additionne les deux lots (431 cuts, 276 posés) ;
sur la partie, les cuts distincts sont 348 (0–8541), dont 276 posés par le Pilote.

**Rôle : validation.** La partie 9 n'a servi à régler aucun curseur. Elle
garde cette valeur tant qu'aucune règle n'est calée dessus ; tout réglage fait
sur elle la fait passer en « réglage » (rapport de sortie 4.8).

Relecture : ciblée de fait (D-048), 66 des 262 cuts appliqués du lot 4.7.18
jugés. Analyses : banane, `audit/lot-4718-p9-2026-09-25.md`,
`audit/lot-4719-p9-2026-09-25.md` et `audit/relecture-p9-2026-09-26.md` ;
scénarios : `travail/2026-09-26_relecture-p9/`.
