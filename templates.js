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
    index() {
        let body = `
            You are serving html!
            <iframe src="/messages?id=${Math.random()}" frameborder="1"></iframe>
            <form action="/message" method="post">
                <input type="text" name="message" />
                <input type="submit" />
            </form>
        `
        return getHtml(body)
    },
    messages(messages) {
        return getHtml(messages.join('<br>'), `
            <!-- <noscript> -->
            <meta http-equiv="refresh" content="0; ?id=${Math.random()}" />
            <!-- </noscript> -->
        `)
    }
}