#!/bin/bash
# minTop du choix : où la baisse casse-t-elle (3, 1) ; combinaison candidate 4.7.16 (garde d'écartement 20 mm + minTop 5), avec la partie 2.
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane
T=tools/choice-anchor-study.cjs
E="--lot $S/lotq/lot=pilote-p2-4.7.14@$S/lotq/rel"
for cfg in "g20-minTop5:--option gaugeGuardMm=20 --option minTop=5" "c15-minTop3:--option chainMm=15 --option minTop=3" "c15-minTop1:--option chainMm=15 --option minTop=1"; do
  name=${cfg%%:*}; O=${cfg#*:}
  [ -f $S/sweep/$name-done ] && continue
  echo "$(date +%T) $name début" >> $S/sweep/progress7.log
  node --max-old-space-size=5500 $T $S/sweep/$name-a.json $O --natif $S/c0923b/session.json=natif-p22 --natif $S/c0923/sess/natif-court=natif-court-p20 --natif $S/c0923/sess/relecture=relecture-p19 --natif $S/c0923c/sess=natif-p24 --natif $S/c0924=natif-p30 > $S/sweep/$name-a.log 2>&1 &
  node --max-old-space-size=8500 $T $S/sweep/$name-b.json $O --natif $S/c0923/sess/natif-long=natif-long-p20 > $S/sweep/$name-b.log 2>&1
  wait
  node --max-old-space-size=6000 $T $S/sweep/$name-c.json $O --lot "$S/p19=pilote-p19-4.7.6" --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/sweep/$name-c.log 2>&1
  node --max-old-space-size=13500 $T $S/sweep/$name-d.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/sweep/$name-d.log 2>&1
  case $name in g20-*) node --max-old-space-size=8000 $T $S/sweep/$name-e.json $O $E > $S/sweep/$name-e.log 2>&1;; esac
  touch $S/sweep/$name-done; echo "$(date +%T) $name fin" >> $S/sweep/progress7.log
done
echo FIN >> $S/sweep/progress7.log
