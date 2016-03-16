#!/usr/bin/env bash

for n in `seq 100000 100000 100000`
do
    for p in `seq 6 13`
    do
        #node index.js -n $n -p $p > output/input-$n-$p.xml
        node --max-old-space-size=16384 index.js /opt/files/input-$n-$p.xml -n /root/person -a bst-ua -jst > /opt/files/result-bst-$n-$p.json
    done
done

#node index.js /opt/files/input01.xml -n /bookstore/book -a bst-ua -j > /opt/files/input01.json