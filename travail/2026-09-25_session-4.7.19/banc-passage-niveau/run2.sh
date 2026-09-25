#!/bin/bash
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane; T=tools/choice-anchor-study.cjs
for cfg in "on2:"; do
  n=${cfg%%:*}; O=${cfg#*:}
  node --max-old-space-size=4500 $T $S/pnb/$n-a.json $O --natif $S/c0923c/sess=natif-p24 --natif $S/c0924=natif-p30 --natif $S/pn-natif/banane-native-v4-2026-09-25T06-55-23-seg01.json=natif-p2-7801 > $S/pnb/$n-a.log 2>&1 &
  node --max-old-space-size=6000 $T $S/pnb/$n-b.json $O --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/pnb/$n-b.log 2>&1
  wait
done
for cfg in "on2:"; do
  n=${cfg%%:*}; O=${cfg#*:}
  node --max-old-space-size=12000 $T $S/pnb/$n-c.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/pnb/$n-c.log 2>&1
  node --max-old-space-size=6000 $T $S/pnb/$n-d.json $O --lot "$S/pnb/l2=pilote-p2-4.7.18@$S/lot4718-rel" --lot "$S/pnb/l3=pilote-p3-4.7.18@$S/lot4718b-rel" > $S/pnb/$n-d.log 2>&1
done
echo FIN > $S/pnb/done2
