#!/bin/bash
# Bilan des curseurs : chaque configuration sur 6 sessions Natif et 4 lots Pilote relus.
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane
T=tools/choice-anchor-study.cjs
for cfg in "base:" "guardMm20:guardMm=20" "guardMm40:guardMm=40" "chooseMm10:chooseMm=10" "chooseMm20:chooseMm=20" "chainMm5:chainMm=5" "chainMm15:chainMm=15" "gap2:gap=2" "gap4:gap=4" "anchors3:anchors=3"; do
  name=${cfg%%:*}; opt=${cfg#*:}; O=""; [ -n "$opt" ] && O="--option $opt"
  [ -f $S/sweep/$name-done ] && continue
  echo "$(date +%T) $name début" >> $S/sweep/progress.log
  node --max-old-space-size=5500 $T $S/sweep/$name-a.json $O --natif $S/c0923b/session.json=natif-p22 --natif $S/c0923/sess/natif-court=natif-court-p20 --natif $S/c0923/sess/relecture=relecture-p19 --natif $S/c0923c/sess=natif-p24 --natif $S/c0924=natif-p30 > $S/sweep/$name-a.log 2>&1 &
  node --max-old-space-size=8500 $T $S/sweep/$name-b.json $O --natif $S/c0923/sess/natif-long=natif-long-p20 > $S/sweep/$name-b.log 2>&1
  wait
  node --max-old-space-size=6000 $T $S/sweep/$name-c.json $O --lot "$S/p19=pilote-p19-4.7.6" --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/sweep/$name-c.log 2>&1
  node --max-old-space-size=13500 $T $S/sweep/$name-d.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/sweep/$name-d.log 2>&1
  touch $S/sweep/$name-done; echo "$(date +%T) $name fin" >> $S/sweep/progress.log
done
echo FIN >> $S/sweep/progress.log
