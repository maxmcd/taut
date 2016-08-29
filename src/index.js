"use strict";
(function() {
	const http = require('http');
	const url = require('url');
	const fs = require('fs');
	const querystring = require('querystring');
	const crypto = require('crypto');

	const templates = require('./templates')

	const port = 8125

	const waiting = [];
	const onlinePeople = {};

	const messages = (function() {
		try {
			return JSON.parse(fs.readFileSync(`${__dirname}/messages.json`));
		} catch(e) {
			return [{
				sender: "max",
				content: "default",
				ts: new Date(8675309).getTime()
			}]
		}
	})()

	let getNic = (req) => {
		var parts =  ("; " + req.headers.cookie).split("; nic=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	}

	let nicResponse = (nic, resp, params, taken) => {
		if (nic) {
			onlinePeople[nic] = new Date().getTime()
			resp.end(templates.index(Object.keys(onlinePeople).length), 'utf-8');
		} else {
			resp.end(templates.form(taken), 'utf-8');
		}
	}

	let people = () => {
		let newPeople = [];
		let d = new Date().getTime() - 300000 //5min
		for (let key in onlinePeople) {
			if (onlinePeople[key] > d) {
				newPeople.push(key)
			} else {
				delete onlinePeople[key]
			}
		}
		return newPeople

	}

	let serveAsset = (resp, filename) => {
		fs.readFile(`${__dirname}/${filename}.gz`, function(error, content) {
			if (error) {
				fs.readFile(`${__dirname}/${filename}`, function(error, content) {
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

			resp.writeHead(200, {
				'Content-Type': 'text/html;',
			});

			let littleLessThanOneMin = 58000;
			resp.setTimeout(littleLessThanOneMin, function(hm) {
				resp.end(templates.messages(messages, false, lastTs), 'utf-8');
			})

			let ts = params.ts

			let lastTs = messages[messages.length-1].ts

			if (ts && ts == lastTs) {
				waiting.push([(message) => {
					resp.end(templates.messages(messages, false, message.ts), 'utf-8');
				}, getNic(req)]);
			} else {
				resp.end(templates.messages(messages, false, lastTs), 'utf-8');
			}
		} else if (path === "/messages.json") {

			resp.writeHead(200, {
				'Content-Type': 'application/json;',
			});
			let data = {
				msgs: templates.messagesArray(messages),
				people: templates.ppls(people()),
			}

			resp.end(JSON.stringify(data), 'utf-8');

		} else if (path === "/ping") {
			resp.writeHead(200, {
				'Content-Type': 'text/plain;',
			});
			resp.end("pong")
		} else if (path === "/is-new-message") {

			let littleLessThanOneMin = 58000;
			resp.setTimeout(littleLessThanOneMin, function(hm) {
				resp.end("yes");
			})

			waiting.push([() => {
				resp.end("yes");
			}, getNic(req)]);

		} else if (path === "/message") {

			req.on('data', (body) => {

				let bodyParams = querystring.parse(body.toString('utf8'))
				onlinePeople[getNic(req)] = new Date().getTime()

				let msg = {
					sender: getNic(req).replace(/</g, '&lt;').replace(/>/g, '&gt;'),
					content: templates.formatMessage(bodyParams.message),
					ts: new Date().getTime(),
				}

				messages.push(msg)

				if (messages.length > 50) {
					messages.shift()
				}

				while (waiting.length) {
					waiting.pop()[0](msg)
				}

				if (params.ajax) {
					resp.writeHead(200);
				} else {
					resp.writeHead(302, {
						'Location':'/'
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

	process.stdin.resume();
	let save = () => {
		fs.writeFileSync(`${__dirname}/messages.json`, JSON.stringify(messages))
		console.log(`${messages.length} messages saved`);
	}
	process.on('exit', function () {
		save()
	});
	process.on('SIGINT', function () {
		process.exit(0);
		console.log('sigint')
	});

	process.on('SIGTERM', function() {
    	process.exit(0);
	});

	process.once('SIGUSR2', function() {
		console.log('SIGUSR2')
		save()
    	process.kill(process.pid, 'SIGUSR2');
	});

})()
