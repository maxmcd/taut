newMessage = function() {
    var url = "/message?ajax=true",
        xhr = new XMLHttpRequest();
    var input = document.getElementById('message-input')
    var message = input.value
    if (!message) return ;
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
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            } else {
                setTimeout(function() {
                    checkIsNewMessage()                    
                }, 500)
            }
        }
    }

    xhr.send();
}

getMessages = function() {
    var url = "/messages.json",
        xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let messages = JSON.parse(xhr.responseText)
                var messageBody = "";
                for (var i=0;i<messages.length;i++) {
                    messageBody += messages[i]
                }
                document.getElementById('day_msgs').innerHTML = messageBody
                var x = document.getElementsByClassName("timestamp");
                for (var i=0;i<x.length;i++) {
                    var d = new Date(Number(x[i].getAttribute('data-ts')))
                    var h = d.getHours();
                    var ap = h > 12 ? "PM":"AM";
                    var h = h > 12 ? h-12 : h;
                    x[i].innerHTML = h+":"+d.getMinutes()+" "+ap
                }
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