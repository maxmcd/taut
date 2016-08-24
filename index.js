(function() {
	const http = require('http');
	const url = require('url');
	const fs = require('fs');
	const querystring = require('querystring');
	const crypto = require('crypto');

	const tmpl = require('./templates')

	const port = 8125

	const waiting = [];
	const ppl = {};
	const messages = [{sender: "max", content: "default"}];


	let getNic = (req) => {
		var parts =  ("; " + req.headers.cookie).split("; nic=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	}
	let nicResponse = (nic, resp, params, taken) => {
		if (nic) {
			ppl[nic] = new Date().getTime()
			resp.end(tmpl.index(params.noscript, Object.keys(ppl).length), 'utf-8');
		} else {
			resp.end(tmpl.form(taken), 'utf-8');
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

	let serveAsset = (resp, filename) => {
		fs.readFile(`./${filename}.gz`, function(error, content) {
			if (error) {
				fs.readFile(`./${filename}`, function(error, content) {
	        		resp.writeHead(200, { 'Content-Type': "text/css" });
	        		resp.end(content, 'utf-8');
	    		});
			} else {
				resp.writeHead(200, { 
					'Content-Type': "text/css",
					'content-encoding':'gzip',
				});
	    		resp.end(content, 'utf-8');
			}
		})
	}
	http.createServer(function (req, resp) {

		let urlParts = url.parse(req.url, true);
		let path = urlParts.pathname;
		let params = urlParts.query;

		if (path === "/") {

			if (req.method == "POST") {
				req.on('data', (body) => {
					let nic = decodeURIComponent(body.toString('utf8').replace("nic=", ""))
					resp.writeHead(302, {
						'Content-Type': 'text/html',
						'Set-Cookie':`nic=${nic}`,
						'Location':'/',
					});
					nicResponse(nic, resp, params)
				})
			} else {
				resp.writeHead(200, {'Content-Type': 'text/html'});
				let nic = getNic(req)
				nicResponse(nic, resp, params)
			}

		} else if (path === "/client.js") {
			serveAsset(resp, 'client.js')
		} else if (path === "/app.css") {
			serveAsset(resp, 'app.css')
		} else if (path === "/messages") {

			waiting.push([(message) => {
				resp.end(tmpl.message(message));
			}, getNic(req)]);

			resp.writeHead(200, {
				'Content-Type': 'text/html;',
			});
			resp.write(tmpl.messages(messages, true), 'utf-8');

		} else if (path === "/messages.json") {

			resp.writeHead(200, {
				'Content-Type': 'application/json;',
			});
			let data = {
				msgs: tmpl.messagesArray(messages),
				people: tmpl.ppls(people()),
			}
			
			resp.end(JSON.stringify(data), 'utf-8');

		} else if (path === "/is-new-message") {

			waiting.push([() => {
				resp.end("yes");
			}, getNic(req)]);

		} else if (path === "/message") {

			req.on('data', (body) => {

				let bodyParams = querystring.parse(body.toString('utf8'))

				ppl[getNic(req)] = new Date().getTime()

				let msg = {
					sender: getNic(req),
					content: bodyParams.message,
				}

				messages.push(msg)

				while (waiting.length) {
					waiting.pop()[0](msg)
				}

				if (params.ajax) {
					resp.writeHead(200);
				} else {
					resp.writeHead(302, {
						'Location':'/messages'
					});
				}

				resp.end('');
	  		})

		} else {
			resp.writeHead(404);
			resp.end("404", 'utf-8');
		}
	}).listen(port);
	console.log(`Server running on port ${port}`);
})()
