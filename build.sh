./node_modules/.bin/babel index.js > build/index.js
uglify -s build/index.js -o build/index.js
./node_modules/.bin/babel client.js > build/client.js
uglify -s build/client.js -o build/client.js
./node_modules/.bin/babel templates.js > build/templates.js
uglify -s build/templates.js -o build/templates.js
cp app.css build
uglify -c -s build/app.css -o build/app.css