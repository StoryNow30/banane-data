#!/bin/bash
# C5 (suite de run10, interrompu) : chaque sortie déjà écrite est gardée.
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane
T=$S/wt-c5/tools/choice-anchor-study.cjs
run(){ local out=$1;shift; [ -s $out ] && return; nice -n 10 node "$@" > ${out%.json}.log 2>&1; }
for cfg in "gaugeGap5:--option gaugeGap=5" "gaugeGap15:--option gaugeGap=15" "gaugeCount2:--option gaugeCount=2" "gaugeCount5:--option gaugeCount=5"; do
  name=${cfg%%:*}; O="--option anchorRule=placed ${cfg#*:}"
  [ -f $S/sweep/$name-done ] && continue
  echo "$(date +%T) $name début" >> $S/sweep/progress11.log
  run $S/sweep/$name-a.json --max-old-space-size=4500 $T $S/sweep/$name-a.json $O --natif $S/c0923b/session.json=natif-p22 --natif $S/c0923/sess/natif-court=natif-court-p20 --natif $S/c0923/sess/relecture=relecture-p19 --natif $S/c0923c/sess=natif-p24 --natif $S/c0924=natif-p30
  run $S/sweep/$name-b.json --max-old-space-size=8000 $T $S/sweep/$name-b.json $O --natif $S/c0923/sess/natif-long=natif-long-p20
  run $S/sweep/$name-c.json --max-old-space-size=6000 $T $S/sweep/$name-c.json $O --lot "$S/p19=pilote-p19-4.7.6" --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel"
  run $S/sweep/$name-d.json --max-old-space-size=12000 $T $S/sweep/$name-d.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel"
  run $S/sweep/$name-e.json --max-old-space-size=8000 $T $S/sweep/$name-e.json $O --lot "$S/lotq/lot=pilote-p2-4.7.14@$S/lotq/rel"
  touch $S/sweep/$name-done; echo "$(date +%T) $name fin" >> $S/sweep/progress11.log
done
echo FIN >> $S/sweep/progress11.log
