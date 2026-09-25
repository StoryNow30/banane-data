#!/bin/bash
# Reprise : appui posé, lots Pilote seulement, rejeu en mode « apply » pour la version courante (lots « observer » simulés).
S=/tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad; cd /home/user/banane
T=tools/choice-anchor-study.cjs; name=appui-pose; O="--option anchorRule=placed"
node --max-old-space-size=6000 $T $S/sweep/$name-c.json $O --lot "$S/p19=pilote-p19-4.7.6" --lot "$S/lot0924/lot=pilote-p31-4.7.8@$S/lot0924/rel" --lot "$S/lot0924b/lot=pilote-p31-fin-4.7.9@$S/lot0924b/rel" > $S/sweep/$name-c.log 2>&1
node --max-old-space-size=13500 $T $S/sweep/$name-d.json $O --lot "$S/lot0924e=pilote-p34-4.7.11@$S/lot0924e-rel" > $S/sweep/$name-d.log 2>&1
node --max-old-space-size=8000 $T $S/sweep/$name-e.json $O --lot "$S/lotq/lot=pilote-p2-4.7.14@$S/lotq/rel" > $S/sweep/$name-e.log 2>&1
node --max-old-space-size=13500 $T $S/sweep/$name-f.json $O --lot "$S/b418/p35=pilote-p35-4.7.12" > $S/sweep/$name-f.log 2>&1
echo FIN9
