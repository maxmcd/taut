const http = require('http');
const url = require('url');

const templates = require('./templates')

const waiting = [];
const messages = ["default"];

http.createServer(function (request, response) {
	console.log('request starting...');

	let urlParts = url.parse(request.url);
	let path = urlParts.pathname;

	if (path === "/") {
		
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(templates.index(), 'utf-8');

	} else if (path === "/messages") {
		
		response.writeHead(200, {
			'Content-Type': 'text/html;',
		});
		response.write(templates.messages(messages), 'utf-8');
		waiting.push((message) => {
			response.end(`<br>${message}`);
		});
	
	} else if (path === "/message") {
		request.on('data', (body) => {

			messages.push(body)
			
			while (waiting.length > 0) {
				waiting.pop()(body);
			}

			response.writeHead(302, {
				'Location':'/'
			});

			response.end('');    		
  		})
	} else {
		response.writeHead(404);
		response.end("404", 'utf-8');
	}
}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');