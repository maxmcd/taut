const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const crypto = require('crypto');

const templates = require('./templates')

const waiting = [];
const ppl = {};
const messages = [{sender: "max", content: "default"}];


let getNic = (request) => {
	var parts =  ("; " + request.headers.cookie).split("; nic=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
let nicResponse = (nic, response, paramsm, taken) => {
	if (nic) {
		ppl[nic] = new Date().getTime()
		response.end(templates.index(params.noscript), 'utf-8');
	} else {
		response.end(templates.form(taken), 'utf-8');
	}
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

let people = () => {
	let nPpl = [];
	let d = new Date().getTime() - 300000 //5min
	for (let key in ppl) {
		if (ppl[key] > d) {
			nPpl.push(key)
		} else {
			delete ppl[key]
		}
	}
	return nPpl
}
http.createServer(function (request, response) {
	console.log('request starting...');

	let urlParts = url.parse(request.url, true);
	let path = urlParts.pathname;
	let params = urlParts.query;


	if (path === "/") {

		if (request.method == "POST") {
			request.on('data', (body) => {
				let nic = body.toString('utf8').replace("nic=", "")
				response.writeHead(200, {
					'Content-Type': 'text/html',
					'Set-Cookie':`nic=${nic}`,
				});
				nicResponse(nic, response, params)
			})
		} else {
			response.writeHead(200, {'Content-Type': 'text/html'});
			let nic = getNic(request)
			nicResponse(nic, response, params)
		}

	} else if (path === "/client.js") {

		fs.readFile('./client.js', function(error, content) {
            response.writeHead(200, { 'Content-Type': "text/javascript" });
            response.end(content, 'utf-8');
        });

	} else if (path === "/app.css") {

		fs.readFile('./app.css', function(error, content) {
            response.writeHead(200, { 'Content-Type': "text/css" });
            response.end(content, 'utf-8');
        });

	} else if (path === "/messages") {

		waiting.push([(message) => {
			response.end(`<br>${message}`);
		}, getNic(request)]);

		response.writeHead(200, {
			'Content-Type': 'text/html;',
		});
		response.write(templates.messages(messages), 'utf-8');

	} else if (path === "/messages.json") {

		response.writeHead(200, {
			'Content-Type': 'application/json;',
		});
		let data = {
			msgs: templates.messagesArray(messages),
			people: templates.ppls(people()),
		}
		response.end(JSON.stringify(data), 'utf-8');

	} else if (path === "/is-new-message") {
		console.log("is-new-message")
		waiting.push([() => {
			response.end("yes");
		}, getNic(request)]);
		console.log(waiting)

	} else if (path === "/message") {
		request.on('data', (body) => {

			let bodyParams = querystring.parse(body.toString('utf8'))

			ppl[getNic(request)] = new Date().getTime()

			messages.push({
				sender: getNic(request),
				content: bodyParams.message,
			})

			console.log(waiting)
			while (waiting.length) {
				waiting.pop()[0](body)
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