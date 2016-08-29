"use strict";

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

module.exports = {
	index(members) {
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
	},
	ppls(peoples) {
		return peoples.map((ppl) => {
			return `<li class="usr">
				<span class="presence active"></span>
				${ppl}
			</li>`
		})
	},
	form() {
		return getHtml(`
			<div class="card">

			</div>
			<form method="post">
				<p>Enter a nickname:</p>
				<input type="text" name="nic">
				<input type="submit" />
			</form>
		`)
	},
	messages(messages, noClosingTags, ts) {
		let messageBody = this.messagesArray(messages).join("")

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
	},
	messagesArray(messages) {
		let out = []
		for (let i=0;i<messages.length;i++) {
			let last;
			if (i>0) last = messages[i-1];
			out.push(this.message(messages[i], last))
		}
		return out
	},
	formatMessage(content) {
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
	},
	message(message, last) {
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
}