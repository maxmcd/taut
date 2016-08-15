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
            header = `<script src="/client.js"></script>`
            body = `
            <noscript>
                <iframe src="/messages?id=${Math.random()}" frameborder="1"></iframe>
            </noscript>
            `
        }

        body += `
            <div id="messages"></div>
            <form action="/message" method="post" onsubmit="newMessage(); return false;">
                <input type="text" name="message" id="input" />
                <input type="submit" />
            </form>
        `
        return getHtml(body, header)
    },
    messages(messages) {
        var messageBody = "";
        for (var i=0;i<messages.length;i++) {
            messageBody += messages[i].sender + " - " + messages[i].content + "<br>"
        }
        return getHtml(messageBody, `
            <!-- <noscript> -->
            <meta http-equiv="refresh" content="0; ?id=${Math.random()}" />
            <!-- </noscript> -->
        `)
    }
}