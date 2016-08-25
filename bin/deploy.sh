#! /bin/bash
set -e
gulp build
./bin/size.sh
scp -r build/* root@104.131.126.76:~/taut/
ssh root@104.131.126.76 "forever restartall"