"use strict";
(function() {
	const http = require('http');
	const url = require('url');
	const fs = require('fs');
	const querystring = require('querystring');
	const crypto = require('crypto');

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

	const getHtml = (body, header) => {
		if (!header)
			header = "";

		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Taut</title>
			${header}
		</head>
		${body}
		`
	}

	// 26 three char hex color codes
	const colorKey = "32a719e6355e88f1c782e5415053c056c2a2929b25d45b5755b439d2c01c131005299c03415719"
	const colors = {}
	for (let i=97;i<123;i++) {
		let colorIndex = (i-97)*3
		colors[String.fromCharCode(i)] = colorKey.substring(colorIndex, colorIndex+3)
	}

	const templateIndex = function (members) {
		if (!members) members=0;

		let header = `<link rel="stylesheet" href="/app.css" />`

		let inputAttributes = `
			autofocus
			id="message-input"
			placeholder="Message #general"
			autocorrect="off"
			autocomplete="off"
			spellcheck="true"
		`

		let body = `
			<body>
			<div id="client-ui">
				<header>
					<div id="team_menu">
						<span id="team_name">Taut</span>
						<li class="usr">
							<span class="presence active"></span>
							max
						</li>
					</div>
					<div id="ch">
						<div id="ct">#general</div>
						<div id="chi">${members} members</div>
					</div>
				</header>
				<div id="footer">
					<div id="footer_msgs">
						<div id="mic">
							<form action="/message" method="post" target="" id="message-form" onsubmit="newMessage();return false;">
								<noscript>
									<input name="message" ${inputAttributes}/>
								</noscript>
								<textarea ${inputAttributes} /></textarea>
							</form>
						</div>
					</div>
				</div>
				<div id="client_body">
					<div id="col_messages">
						<div class="row-fluid">
							<div id="ccb"></div>
							<div id="cc">
								<ul id="im-list">
									<li class="usr active">
										# general
									</li>
									<div id="ili"></div>
								</ul>
							</div>
							<noscript>
								<iframe name="mc" src="/messages?id=${Math.random()}#l" frameborder="0"></iframe>
							</noscript>
							<div id="mc">
								<div id="connection_div">Connection lost. Reconnecting...</div>
								<div id="msd">
									<div id="msg_div">
										<div id="dc">
											<div class="day_msgs" id="day_msgs">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<script src="/client.js"></script>
			</body>
		`
		return getHtml(body, header)
	}
	const templatePpls = function (peoples) {
		return peoples.map((ppl) => {
			return `<li class="usr">
				<span class="presence active"></span>
				${ppl}
			</li>`
		})
	}
	const templateForm = function () {
		return getHtml(`
			<div class="card">

			</div>
			<form method="post">
				<p>Enter a nickname:</p>
				<input type="text" name="nic">
				<input type="submit" />
			</form>
		`)
	}
	const templateMessages = function (messages, noClosingTags, ts) {
		let messageBody = templateMessagesArray(messages).join("")

		let cts = `</div></div></div></div></body>`

		if (noClosingTags) cts=``;

		return getHtml(`
			<body class="iframe">
			<div id="iframe_body">
				<div id="msg_div">
					<div class="dc">
						<div class="day_msgs" id="day_msgs">
						${messageBody}${cts}
						<a name="l"></a>`, `
			<link rel="stylesheet" href="/app.css" />
			<!-- <noscript> -->
			<meta http-equiv="refresh" content="0; ?ts=${ts}&id=${Math.random()}#l" />
			<!-- </noscript> -->
		`)
	}
	const templateMessagesArray = function (messages) {
		let out = []
		for (let i=0;i<messages.length;i++) {
			let last;
			if (i>0) last = messages[i-1];
			out.push(templateMessage(messages[i], last))
		}
		return out
	}
	const templateFormatMessage = function (content) {
		// sanitize
		content = content
			.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		let rpl = {"\\*":"b","_":"i","~":"strike","`":"code"}

		// formatting
		for (let key in rpl) {
			let re = new RegExp(`(\\s?)${key}(.*?)${key}($|\\s)`,"gmi");
			content = content.replace(
				re,
				`$1<${rpl[key]}>$2</${rpl[key]}>`
			)
		}

		// blockqoute
		content = content.replace(
			/^&gt;(.*)$/gm,
			`<blockquote>$1</blockquote>`
		)

		// links
		// http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
		content = content.replace(
			/(^|\s)([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,
			`$1<a href="http://$2" target="_blank">$2</a>`
		)
		content = content.replace(
			/(^|\s)(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,
			`$1<a href="$2" target="_blank">$2</a>`
		)

		// newlines
		// replace \n with <br>
		content = content.replace(/\n/gi, "<br>")
		return content
	}

	const templateMessage = function (message, last) {
		let sender = message.sender

		let content = message.content

		let gutter = `
			<div class="message_gutter">
				<div class="message_icon">
					<span
						style="background-color: #${colors[sender[0].toLowerCase()] || "ccc"}"
						class="member_image">
							${sender[0]}
					</span>
				</div>
			</div>
		`
		let meta = `
		<span class="member">${sender}</span>&nbsp;
		<span class="timestamp" data-ts="${message.ts}"></span>
		`

		if (last) {
			if (last.sender == message.sender && ((message.ts - last.ts) < 60000)) {
				meta = ""
				gutter = ""
			}
		}
		return `
			<ts-message>
				${gutter}
				<div class="message_content ">
					${meta}
					<span class="message_body">${content}</span>
				</div>
			</ts-message>
		`
	}


	let getNic = (req) => {
		var parts =  ("; " + req.headers.cookie).split("; nic=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	}

	let nicResponse = (nic, resp, params, taken) => {
		if (nic) {
			onlinePeople[nic] = new Date().getTime()
			resp.end(templateIndex(Object.keys(onlinePeople).length), 'utf-8');
		} else {
			resp.end(templateForm(taken), 'utf-8');
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
				resp.end(templateMessages(messages, false, lastTs), 'utf-8');
			})

			let ts = params.ts

			let lastTs = messages[messages.length-1].ts

			if (ts && ts == lastTs) {
				waiting.push([(message) => {
					resp.end(templateMessages(messages, false, message.ts), 'utf-8');
				}, getNic(req)]);
			} else {
				resp.end(templateMessages(messages, false, lastTs), 'utf-8');
			}
		} else if (path === "/messages.json") {

			resp.writeHead(200, {
				'Content-Type': 'application/json;',
			});
			let data = {
				msgs: templateMessagesArray(messages),
				people: templatePpls(people()),
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
					content: templateFormatMessage(bodyParams.message),
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
