#!/bin/bash
# Balayage C5, règles 4.7.20 (= 4.7.19), un curseur déplacé à la fois. Jeux : a = Natif p24, p30, p2 7801 ;
# b = lots p31 (4.7.8, 4.7.9) ; c = lot p34 ; d = lots p2 et p3 (4.7.18). Chaque sortie écrite est gardée.
S=$1; D=$S/c5/data; O=$S/c5/out; mkdir -p $O; cd ${BANANE:-.}; T=tools/choice-anchor-study.cjs

[ -f $D/ok ] || { python3 $(dirname $0)/setup.py $D && touch $D/ok; }
run(){ local out=$1;shift; [ -s $out ] && return; nice -n 10 node "$@" > ${out%.json}.log 2>&1; }
for cfg in "base:" "gaugeGap5:--option gaugeGap=5" "gaugeGap15:--option gaugeGap=15" "gaugeCount2:--option gaugeCount=2" "gaugeCount5:--option gaugeCount=5" "crossingVoieMm5:--option crossingVoieMm=5" "crossingVoieMm15:--option crossingVoieMm=15"; do
  n=${cfg%%:*}; X=${cfg#*:}; echo "$(date +%T) $n début" >> $O/progress.log
  run $O/$n-a.json --max-old-space-size=4500 $T $O/$n-a.json $X --natif $D/natif-p24=natif-p24 --natif $D/natif-p30=natif-p30 --natif $D/natif-p2-7801=natif-p2-7801
  run $O/$n-b.json --max-old-space-size=6000 $T $O/$n-b.json $X --lot "$D/p31/lot=pilote-p31-4.7.8@$D/p31/rel" --lot "$D/p31fin/lot=pilote-p31-fin-4.7.9@$D/p31fin/rel"
  run $O/$n-c.json --max-old-space-size=12000 $T $O/$n-c.json $X --lot "$D/p34/lot=pilote-p34-4.7.11@$D/p34/rel"
  run $O/$n-d.json --max-old-space-size=6000 $T $O/$n-d.json $X --lot "$D/p2/lot=pilote-p2-4.7.18@$D/p2/rel" --lot "$D/p3/lot=pilote-p3-4.7.18@$D/p3/rel"
  echo "$(date +%T) $n fin" >> $O/progress.log
done
echo FIN >> $O/progress.log
