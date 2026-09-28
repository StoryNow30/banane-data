#!/bin/bash
# Premiers passages (piste 4.8.5, garde de premier passage) : règles candidates de
# tools/first-pass-signal-study.cjs sur les sessions Écho (p24, p30, p2 7801, p11)
# et les lots relus des parties 11 et 12.
# Usage : run-premier-passage.sh DONNÉES_C5 KIT_EXTRAIT ECHO_P11 SORTIE
D=$1; K=$2; E=$3; O=$4; mkdir -p $O; cd ${BANANE:-/home/user/banane}
nice -n 10 node --max-old-space-size=13000 tools/first-pass-signal-study.cjs $O/premier-passage.json \
  --natif $D/natif-p24=natif-p24 --natif $D/natif-p30=natif-p30 --natif $D/natif-p2-7801=natif-p2-7801 --natif $E=natif-p11 \
  --lot "$K/p12-lot-4720=pilote-p12-4.7.20@$K/p12-relecture" --lot "$K/p11-lot-4720=pilote-p11-4.7.20@$E" > $O/premier-passage.log 2>&1
echo "$(date +%T) premier-passage.json FIN" >> $O/progress.log
