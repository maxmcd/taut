#! /bin/bash
set -e
gulp build
./bin/size.sh
scp -r dist/*.gz root@104.131.126.76:~/taut/
scp -r dist/*.js root@104.131.126.76:~/taut/
ssh root@104.131.126.76 "forever restartall"