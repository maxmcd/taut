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

module.exports = {
	index(noscript, members) {
		if (!noscript) noscript=false; 
		if (!members) members=0;

		let messagesContainer, header, onsubmit

		if (noscript) {
			header = `
				<link rel="stylesheet" href="/app.css" />
				<script>
					newMessage = function(){};
				</script>
			`
			messagesContainer = `
				<iframe src="/messages?id=${Math.random()}" frameborder="0"></iframe>
			`
			onsubmit = ""
		} else {
			header = `
				<link rel="stylesheet" href="/app.css" />
				<script src="/client.js"></script>
			`
			messagesContainer = `
			<noscript>
				<iframe name="mc" src="/messages?id=${Math.random()}" frameborder="0"></iframe>
			</noscript>
			`
			onsubmit = "newMessage();return false;"
		}

		let body = `
			<body>
			<div id="client-ui">
				<header>
					<div id="team_menu">
						<span id="team_name">Taut</span>
					</div>
					<div id="channel_header">
						<div id="channel_title">#general</div>
						<div id="channel_header_info">${members} members</div>
					</div>
				</header>
				<div id="footer">
					<div id="footer_msgs">
						<div id="messages-input-container">
							<span id="primary_file_button"></span>
							<form action="/message" method="post" target="mc" id="message-form" onsubmit="${onsubmit}">
								<input autofocus name="message" id="message-input" autocorrect="off" autocomplete="off" spellcheck="true" />
							</form>
						</div>
					</div>
				</div>
				<div id="client_body">
					<div id="col_messages">
						<div class="row-fluid">
							<div id="col_channels_bg"></div>
							<div id="col_channels">
								<ul id="im-list">
								</ul>
							</div>
							${messagesContainer}
							<div id="messages_container">
								<div id="msgs_scroller_div">
									<div id="msg_div">
										<div class="day_container">
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
			</body>
		`
		return getHtml(body, header)
	},
	ppls(peoples) {
		return peoples.map((ppl) => {
			return `<li>
				<span class="presence active"></span>
				${ppl}
			</li>`
		})	
	},
	form() {
		return getHtml(`
			<form method="post">
				<p>Enter a nickname:</p>
				<input type="text" name="nic">
				<input type="submit" />
			</form>
		`)
	},
	messages(messages, noClosingTags) {
		let messageBody = this.messagesArray(messages).join("")

		let cts = `</div></div></div></div></div></body>`

		if (noClosingTags) cts=``;

		return getHtml(`
			<body class="iframe">
			<div id="iframe_body">
				<div id="msgs_scroller_div">
					<div id="msg_div">
						<div class="day_container">
							<div class="day_msgs" id="day_msgs">
							${messageBody}${cts}`, `
			<link rel="stylesheet" href="/app.css" />
			<!-- <noscript> -->
			<meta http-equiv="refresh" content="0; ?id=${Math.random()}" />
			<!-- </noscript> -->
		`)
	},
	messagesArray(messages) {
		let out = []
		for (let i=0;i<messages.length;i++) {
			out.push(this.message(messages[i]))
		}
		return out
	},
	rpl: {
		"\\*":"b","_":"i","~":"strike","`":"code"
	},
	message(message) {
		let sender = message.sender;
		let content = message.content
			.replace(/</g, '&lt;').replace(/>/g, '&gt;')
		for (let key in this.rpl) {
			let re = new RegExp(`(\\s?)${key}(\\w+)${key}($|\\s)`,"gi");
			content = content.replace(
				re, 
				`$1<${this.rpl[key]}>$2</${this.rpl[key]}>`
			)
		}

		// TODO: sanitize html
		return `
			<ts-message class="message feature_fix_files first">
				<div class="message_gutter">
					<div class="message_icon">
						<span class="member_image">${sender[0]}</span>
					</div>
				</div>
				<div class="message_content ">
					<span class="member">${sender}</span>&nbsp;
					<span class="timestamp" data-ts="${message.ts}"></span>
					<span class="message_body">${content}</span>
				</div>
			</ts-message>
		`
	}
}