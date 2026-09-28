#!/bin/bash
# Calage de convention (src/placement-convention.js) : ajusté sur toutes les sessions
# Écho, validé en retenant chaque session à tour de rôle (tools/convention-fit.cjs).
# Usage : run-calage.sh DONNÉES_C5 ECHO_P11 SORTIE
D=$1; E=$2; O=$3; cd ${BANANE:-/home/user/banane}
nice -n 10 node --max-old-space-size=13000 tools/convention-fit.cjs --input $D/natif-p24=natif-p24 --input $D/natif-p30=natif-p30 --input $D/natif-p2-7801=natif-p2-7801 --input $E=natif-p11 --json $O/calage.json > $O/calage.log 2>&1
echo "$(date +%T) calage.json FIN" >> $O/progress.log
