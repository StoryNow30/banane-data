#!/bin/bash
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane; T=tools/choice-anchor-study.cjs
cp $S/pnb/on2-a.json $S/pnb/on3-a.json
node --max-old-space-size=6000 $T $S/pnb/on3-d.json --lot "$S/pnb/l2=pilote-p2-4.7.18@$S/lot4718-rel" --lot "$S/pnb/l3=pilote-p3-4.7.18@$S/lot4718b-rel" > $S/pnb/on3-d.log 2>&1 &
node --max-old-space-size=6000 $T $S/pnb/on3-b.json --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/pnb/on3-b.log 2>&1
wait
node --max-old-space-size=12000 $T $S/pnb/on3-c.json --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/pnb/on3-c.log 2>&1
echo FIN > $S/pnb/done3
