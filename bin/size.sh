#! /bin/bash
cd dist
size=$(ls -lrt | egrep '(js|css|gz)$' | awk '{ total += $5 }; END { print total }')
if [ "$size" -lt "10240" ] ; then
    printf "GOOD"
else
    printf "TOO BIG"
fi 
echo " your size is $size bytes"