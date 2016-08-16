newMessage = function() {
    var url = "/message?ajax=true",
        xhr = new XMLHttpRequest();
    var input = document.getElementById('message-input')
    var message = input.value
    input.value = ""
    input.focus()
    var body = "message=" + encodeURIComponent(message)
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(body);
}

checkIsNewMessage = function() {
    console.log("waiting for a new message")
    var url = "/is-new-message?" + Math.random(),
        xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function() {
        console.log("Got new message!")
        getMessages()
        checkIsNewMessage()
    }
    xhr.send();
}

getMessages = function() {
    var url = "/messages.json",
        xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        var DONE = 4; 
        var OK = 200; 
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                let messages = JSON.parse(xhr.responseText)
                var messageBody = "";
                for (var i=0;i<messages.length;i++) {
                    messageBody += messages[i]
                }
                document.getElementById('day_msgs').innerHTML = messageBody
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    }

    xhr.send();
}

window.onload = function() {
    getMessages()
    checkIsNewMessage()
}