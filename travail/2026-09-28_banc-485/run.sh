#!/bin/bash
# Banc de réglage 4.8.5 (28/09) — règles 4.8.0 (lot-decision-v6), un réglage à la fois.
# Jeux : a = Natif p24, p30, p2 7801 ; b = lots p31 ; c = lot p34 ; d = lots p2, p3 (4.7.18)
#        (données du banc C5 du 25/09, ../2026-09-25_c5-4720/setup.py) ;
#        e = lots p9 (4.7.18, 4.7.19) + relecture p9 ; f = lot p12 (4.7.20) + relecture p12
#        (parties de validation de la 4.8, passées au réglage, D-057) ;
#        g = Écho p11 du 28/09 (natif) ; h = lot p11 (4.7.20) + relecture Écho p11 du 28/09.
# Usage : run.sh DONNÉES_C5 KIT_EXTRAIT P9_4718R ECHO_P11 SORTIE
D=$1; K=$2; P9R=$3; E=$4; O=$5; mkdir -p $O; cd ${BANANE:-/home/user/banane}; T=tools/choice-anchor-study.cjs
run(){ local out=$1;shift; [ -s $out ] && return; nice -n 10 node "$@" > ${out%.json}.log 2>&1; echo "$(date +%T) $(basename $out)" >> $O/progress.log; }
for cfg in "base:" "guardMm20:--option guardMm=20"; do n=${cfg%%:*}; X=${cfg#*:}
  run $O/$n-a.json --max-old-space-size=6000 $T $O/$n-a.json $X --natif $D/natif-p24=natif-p24 --natif $D/natif-p30=natif-p30 --natif $D/natif-p2-7801=natif-p2-7801
  run $O/$n-b.json --max-old-space-size=8000 $T $O/$n-b.json $X --lot "$D/p31/lot=pilote-p31-4.7.8@$D/p31/rel" --lot "$D/p31fin/lot=pilote-p31-fin-4.7.9@$D/p31fin/rel"
  run $O/$n-c.json --max-old-space-size=13000 $T $O/$n-c.json $X --lot "$D/p34/lot=pilote-p34-4.7.11@$D/p34/rel"
  run $O/$n-d.json --max-old-space-size=8000 $T $O/$n-d.json $X --lot "$D/p2/lot=pilote-p2-4.7.18@$D/p2/rel" --lot "$D/p3/lot=pilote-p3-4.7.18@$D/p3/rel"
  run $O/$n-e.json --max-old-space-size=13000 $T $O/$n-e.json $X --lot "$P9R=pilote-p9-4.7.18@$K/p9-relecture" --lot "$K/p9-lot-4719=pilote-p9-4.7.19@$K/p9-relecture"
  run $O/$n-f.json --max-old-space-size=13000 $T $O/$n-f.json $X --lot "$K/p12-lot-4720=pilote-p12-4.7.20@$K/p12-relecture"
  run $O/$n-g.json --max-old-space-size=13000 $T $O/$n-g.json $X --natif $E=natif-p11
  run $O/$n-h.json --max-old-space-size=13000 $T $O/$n-h.json $X --lot "$K/p11-lot-4720=pilote-p11-4.7.20@$E"
done
echo FIN >> $O/progress.log
