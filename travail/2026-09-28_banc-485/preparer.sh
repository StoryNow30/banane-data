#!/bin/bash
# Entrées du banc 4.8.5, reconstruites depuis une session neuve (PREPARER.md, étapes 1 à 5).
# Usage : preparer.sh S   (S = dossier de travail, hors dépôt ; ~9 Go)
# Idempotent : une étape déjà faite est sautée. Sortie : les cinq dossiers à
# passer à run.sh, run-premier-passage-*.sh ou banane/tools/portes-j1.cjs,
# écrits dans $S/entrees.env.
set -euo pipefail
S=${1:?usage: preparer.sh DOSSIER_DE_TRAVAIL}; mkdir -p "$S"; S=$(cd "$S" && pwd)
ICI=$(cd "$(dirname "$0")" && pwd); DATA=$(cd "$ICI/../.." && pwd); BANANE=${BANANE:-$DATA/../banane}
python3 -c 'import py7zr' 2>/dev/null || { echo "py7zr requis : pip install py7zr" >&2; exit 1; }
# 1. DONNÉES_C5 (jeux a à d)
[ -d "$S/c5/data/p34" ] || python3 "$ICI/../2026-09-25_c5-4720/setup.py" "$S/c5/data"
# 2. KIT_EXTRAIT (jeux e, f, h)
[ -d "$S/kitx/p11-lot-4720" ] || python3 "$ICI/../2026-09-28_kit-audit-480/extraire.py" "$S/kitx" \
  p9-lot-4718 p9-lot-4719 p9-relecture p12-lot-4720 p12-relecture p11-lot-4720
# 3. P9_4718R : liens vers les corpus du lot 4.7.18, diagnostic filtré sur son lot
LOT=09d3c4f0-52c4-4245-959f-b180165ce951
if [ ! -s "$S/p9r/diagnostic-$LOT.json" ]; then mkdir -p "$S/p9r"
  for f in "$S"/kitx/p9-lot-4718/*corpus*.json; do ln -sf "$f" "$S/p9r/$(basename "$f")"; done
  node -e '
    const fs=require("fs"),[src,out,lot]=process.argv.slice(1);
    const d=JSON.parse(fs.readFileSync(src));d.observations=d.observations.filter(o=>o.batchId===lot);
    d.observationCount=d.observations.length;fs.writeFileSync(out,JSON.stringify(d));
    console.log("p9r : "+d.observationCount+" observations du lot "+lot);' \
    "$(ls "$S"/kitx/p9-lot-4718/*diagnostic*.json)" "$S/p9r/diagnostic-$LOT.json" "$LOT"
fi
# 4. ECHO_P11 : Echo_1 recollé, session 1bf9fe0e fusionnée sans le faux départ 08-02-51
if [ ! -s "$S/echo1/session-1bf9.json" ]; then mkdir -p "$S/echo1/brut"
  cat "$DATA/collections/2026-09-28_v4.8.0_/relecture p11/"Echo_1.ZIP.part00{1,2,3,4,5,6} > "$S/echo1/Echo_1.zip"
  python3 -c 'import sys,zipfile;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])' "$S/echo1/Echo_1.zip" "$S/echo1/brut"
  mapfile -t F < <(ls "$S"/echo1/brut/ariane-native-v4-*.json | grep -v 'T08-02-51')
  node --max-old-space-size=12000 "$BANANE/tools/merge-segments.cjs" --out "$S/echo1/session-1bf9.json" "${F[@]}"
  rm -rf "$S/echo1/brut" "$S/echo1/Echo_1.zip"
fi
mkdir -p "$S/echo-p11"; ln -sf "$S/echo1/session-1bf9.json" "$S/echo-p11/session-1bf9.json"
# 5. SORTIE : un dossier vide
mkdir -p "$S/sortie"
cat > "$S/entrees.env" <<EOF
DONNEES_C5=$S/c5/data
KIT_EXTRAIT=$S/kitx
P9_4718R=$S/p9r
ECHO_P11=$S/echo-p11
SORTIE=$S/sortie
EOF
echo "Entrées prêtes : $S/entrees.env"; cat "$S/entrees.env"
