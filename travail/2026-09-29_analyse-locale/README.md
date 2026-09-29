# Kit d'analyse locale des exports (29/09/2026)

`ariane-analyse-locale.zip`, SHA-256 dans `ariane-analyse-locale.zip.sha256`
(`a38aae31…`), construit depuis la branche `claude/banane-48-cahier` de `banane`
par `tools/kit-analyse-locale.py` (reproductible : deux constructions
identiques). Mode d'emploi pas à pas dans le zip : `LISEZMOI.txt`.

**Pourquoi.** Un export de lot pèse ≈ 1,2 Mo par cut visité (nuages de points) et
celui d'une relecture autant par visite : quelques milliers de cuts se comptent en
Go. Ni la session (4 Go de disque, dépôts de 100 Mo par fichier) ni l'envoi de
fichiers ne peuvent les recevoir. Le kit lance sur l'ordinateur de l'opérateur le
même rapport d'acceptation et les mêmes temps que d'habitude, en **mode léger**
(les points bruts sont écartés dès la lecture), et ne renvoie qu'un fichier de
quelques centaines de Ko.

**Ce qui change dans les outils** (`banane`, `tools/`) : option `--leger` de
`acceptance-report.cjs` (et `mergeFiles(files, {leger})` de `merge-segments.cjs`),
nouvel outil `analyse-locale.cjs`, essais `tests/analyse-locale.test.cjs`.

**Contrôles.**
- Mode léger contre mode complet : rapports JSON identiques, à l'indicateur
  `leger` près, sur le lot 25 (4.8.5.1) et sur la partie 12 avec relecture
  (4.7.20) ; 2,6 fois plus rapide avec relecture.
- Charge : un corpus de 1,4 Go (15 segments) échoue en mode complet avec 1,2 Go de
  mémoire (dépassement) et passe en mode léger.
- Kit décompressé seul, hors du dépôt : mêmes résultats.
- Le rejeu hors ligne (`--rejeu-lot`, études de règles) exige les points bruts :
  il reste possible sur un échantillon envoyé à part, jamais en mode léger.
