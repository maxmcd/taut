const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

const templates = require('./templates')

const waiting = [];
const messages = [{sender: "max", content: "default"}];

http.createServer(function (request, response) {
	console.log('request starting...');

	let urlParts = url.parse(request.url, true);
	let path = urlParts.pathname;
	let params = urlParts.query;

	if (path === "/") {

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(templates.index(params.noscript), 'utf-8');

	} else if (path === "/client.js") {

		fs.readFile('./client.js', function(error, content) {
            response.writeHead(200, { 'Content-Type': "text/javascript" });
            response.end(content, 'utf-8');
        });

	} else if (path === "/messages") {

		waiting.push((message) => {
			response.end(`<br>${message}`);
		});

		response.writeHead(200, {
			'Content-Type': 'text/html;',
		});
		response.write(templates.messages(messages), 'utf-8');

	} else if (path === "/messages.json") {

		response.writeHead(200, {
			'Content-Type': 'application/json;',
		});
		response.end(JSON.stringify(messages), 'utf-8');

	} else if (path === "/is-new-message") {
		console.log("is-new-message")
		waiting.push(() => {
			response.end("yes");
		});
		console.log(waiting)

	} else if (path === "/message") {
		request.on('data', (body) => {

			let bodyParams = querystring.parse(body.toString('utf8'))
			console.log(bodyParams)
			messages.push({
				sender: "max",
				content: bodyParams.message,
			})

			console.log(waiting)
			while (waiting.length) {
				waiting.pop()(body)
				console.log('triggered')
			}

			if (params.ajax) {
				response.writeHead(200);
			} else {
				response.writeHead(302, {
					'Location':'/'
				});
			}

			response.end('');
  		})
	} else {
		response.writeHead(404);
		response.end("404", 'utf-8');
	}
}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');