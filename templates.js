const getHtml = (body, header) => {
	if (!header) 
		header = "";

	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>S10ck</title>
		${header}
	</head>
	<body>
		${body}
	</body>
	`
}

module.exports = {
	index(noscript) {
		if (!noscript) noscript=false; 

		let body, header

		if (noscript) {
			body = `
				<iframe src="/messages?id=${Math.random()}" frameborder="1"></iframe>
			`
		} else {
			header = `
				<link rel="stylesheet" href="/app.css" />
				<script src="/client.js"></script>
			`
			body = `
			<noscript>
				<iframe src="/messages?id=${Math.random()}" frameborder="1"></iframe>
			</noscript>
			`
		}

		body += `
			<div id="client-ui">
				<header>
					<div id="team_menu"></div>
					<div id="channel_header"></div>
				</header>
				<div id="footer">
					<div id="footer_msgs">
						<div id="messages-input-container" class="" style="height: 42px;">
							<a onclick="return false;" id="primary_file_button" class="file_upload_btn" aria-label="File menu" style="height: 42px;">
								<i class="ts_icon ts_icon_plus_thick"></i>
							</a>
							<form action="/message" method="post" id="message-form" style="height: 42px;" onsubmit="newMessage(); return false;">
								<input id="message-input" class="with-emoji-menu" aria-label="Message input for Channel #general" data-qa="message_input" autocorrect="off" autocomplete="off" spellcheck="true" style="overflow-y: hidden; height: 42px;" />
								<div id="message-input-message" class=""><span></span></div>
							</form>
						</div>
					</div>
				</div>
				<div id="client_body">
					<div id="col_messages">
						<div class="row-fluid">
							<div id="col_channels_bg"></div>
							<div id="col_channels"></div>
							<div id="messages_container">
								<div id="msgs_scroller_div">
									<div id="msg_div">
										<div id="day_container">
											<div id="day_msgs">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="messages"></div>
				<form action="/message" method="post" >
					<input type="text" name="message" id="input" />
					<input type="submit" />
				</form>
			</div>
		`
		return getHtml(body, header)
	},
	messages(messages) {
		var messageBody = "";
		for (var i=0;i<messages.length;i++) {
			messageBody += messages[i].sender + " - " + messages[i].content + "<br>"
		}
		return getHtml(messageBody, `
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
	message(message) {
		let sender = message.sender;
		let content = message.content;
		// TODO: sanitize html
		return `
			<ts-message class="message feature_fix_files first">
				<div class="message_gutter">
					<div class="message_icon">
						<a href="/team/" target="/team/" class=" member_preview_link member_image thumb_36" data-member-id="U03215JN8" data-thumb-size="36" style="background-image: url('https://avatars.slack-edge.com/2015-10-19/12818173283_aea3b0bbf30420da2fce_72.jpg')" aria-hidden="true"></a>
					</div>
				</div>
				<div class="message_content ">
					<a href="/team/" target="/team/" class="message_sender member member_preview_link color_U03281YPL color_e96699 " data-member-id="U03281YPL">${sender}</a>
					<a href="/archives/general/p1471282235000016" target="new_1471308748387" class="timestamp ts_tip ts_tip_top ts_tip_float ts_tip_hidden ts_tip_multiline ts_tip_delay_300"><span class="ts_tip_tip"><span class="subtle_silver">Today&nbsp;at&nbsp;1:30:35&nbsp;PM</span></span></a>
					<span class="message_body">${content}</span>
				</div>
			</ts-message>
		`
	}
}