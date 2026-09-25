#!/bin/bash
P=$(pgrep -f "^node .*wt-c5/tools"; pgrep -f "^/bin/bash /tmp/.*run10.sh")
[ -n "$P" ] && kill -STOP $P
cd /home/user/banane && node tools/verify.cjs > /tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad/verify.log 2>&1; echo "exit $?" >> /tmp/claude-0/-home-user/20187d67-418d-5913-8b2a-8111fae0ac4e/scratchpad/verify.log
[ -n "$P" ] && kill -CONT $P
