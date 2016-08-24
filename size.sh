cd build
size=$(ls -lrt | egrep '(js|css)' | awk '{ total += $5 }; END { print total }')
if [ "$size" -lt "10240" ] ; then
    printf "GOOD"
else
    printf "TOO BIG"
fi 
echo " your size is $size bytes"