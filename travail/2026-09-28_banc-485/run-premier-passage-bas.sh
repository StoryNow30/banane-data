#!/bin/bash
# Premiers passages sans appui, garde d’écartement BAS seulement (règles « sans-appui-ecart-bas-… »
# de tools/first-pass-signal-study.cjs), sur tous les jeux du banc 4.8.5, un jeu
# à la fois (mémoire). Mêmes arguments que run.sh.
D=$1; K=$2; P9R=$3; E=$4; O=$5; mkdir -p $O; cd ${BANANE:-/home/user/banane}; T=tools/first-pass-signal-study.cjs
run(){ local out=$1;shift; [ -s $out ] && return; nice -n 10 node --max-old-space-size=13000 $T $out "$@" --regles sans-appui-ecart-bas-1420,sans-appui-ecart-bas-1425 > ${out%.json}.log 2>&1; echo "$(date +%T) $(basename $out)" >> $O/progress.log; }
run $O/pb-a.json --natif $D/natif-p24=natif-p24 --natif $D/natif-p30=natif-p30 --natif $D/natif-p2-7801=natif-p2-7801
run $O/pb-b.json --lot "$D/p31/lot=pilote-p31-4.7.8@$D/p31/rel" --lot "$D/p31fin/lot=pilote-p31-fin-4.7.9@$D/p31fin/rel"
run $O/pb-c.json --lot "$D/p34/lot=pilote-p34-4.7.11@$D/p34/rel"
run $O/pb-d.json --lot "$D/p2/lot=pilote-p2-4.7.18@$D/p2/rel" --lot "$D/p3/lot=pilote-p3-4.7.18@$D/p3/rel"
run $O/pb-e.json --lot "$P9R=pilote-p9-4.7.18@$K/p9-relecture" --lot "$K/p9-lot-4719=pilote-p9-4.7.19@$K/p9-relecture"
run $O/pb-f.json --lot "$K/p12-lot-4720=pilote-p12-4.7.20@$K/p12-relecture"
run $O/pb-g.json --natif $E=natif-p11
run $O/pb-h.json --lot "$K/p11-lot-4720=pilote-p11-4.7.20@$E"
echo "$(date +%T) pb FIN" >> $O/progress.log
