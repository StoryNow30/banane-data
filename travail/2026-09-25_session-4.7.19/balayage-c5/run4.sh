#!/bin/bash
# Garde d'écartement voisin : garde seule (10, 12, 15, 20 mm) et aide au choix (12, 15 mm), règles 4.7.15, 6 sessions Natif et 5 lots Pilote relus.
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane
T=tools/choice-anchor-study.cjs
E="--lot $S/lotq/lot=pilote-p2-4.7.14@$S/lotq/rel"
if [ ! -f $S/sweep/g-base-done ]; then echo "$(date +%T) g-base (p2) début" >> $S/sweep/progress4.log
  node --max-old-space-size=8000 $T $S/sweep/g-base-e.json $E > $S/sweep/g-base-e.log 2>&1; touch $S/sweep/g-base-done; echo "$(date +%T) g-base fin" >> $S/sweep/progress4.log; fi
for cfg in "g15:--option gaugeGuardMm=15" "g15c:--option gaugeGuardMm=15 --option gaugeChoice=true" "g20:--option gaugeGuardMm=20" "g12:--option gaugeGuardMm=12" "g12c:--option gaugeGuardMm=12 --option gaugeChoice=true" "g10:--option gaugeGuardMm=10"; do
  name=${cfg%%:*}; O=${cfg#*:}
  [ -f $S/sweep/$name-done ] && continue
  echo "$(date +%T) $name début" >> $S/sweep/progress4.log
  node --max-old-space-size=5500 $T $S/sweep/$name-a.json $O --natif $S/c0923b/session.json=natif-p22 --natif $S/c0923/sess/natif-court=natif-court-p20 --natif $S/c0923/sess/relecture=relecture-p19 --natif $S/c0923c/sess=natif-p24 --natif $S/c0924=natif-p30 > $S/sweep/$name-a.log 2>&1 &
  node --max-old-space-size=8500 $T $S/sweep/$name-b.json $O --natif $S/c0923/sess/natif-long=natif-long-p20 > $S/sweep/$name-b.log 2>&1
  wait
  node --max-old-space-size=6000 $T $S/sweep/$name-c.json $O --lot "$S/p19=pilote-p19-4.7.6" --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/sweep/$name-c.log 2>&1
  node --max-old-space-size=13500 $T $S/sweep/$name-d.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/sweep/$name-d.log 2>&1
  node --max-old-space-size=8000 $T $S/sweep/$name-e.json $O $E > $S/sweep/$name-e.log 2>&1
  touch $S/sweep/$name-done; echo "$(date +%T) $name fin" >> $S/sweep/progress4.log
done
echo FIN >> $S/sweep/progress4.log
