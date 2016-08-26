(function() {
    window.newMessage = function() {
        var url = "/message?ajax=true",
            xhr = new XMLHttpRequest();
        var input = document.getElementById('message-input')
        var message = input.value
        // return if all whitespace
        if (! (message.replace(/\s/gi, ""))) return;
        input.value = ""
        input.focus()
        var body = "message=" + encodeURIComponent(message)
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(body);
        return false;
    }

    var checkIsNewMessage = function() {
        console.log("waiting for a new message")
        var url = "/is-new-message?" + Math.random(),
            xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    getMessages()
                    checkIsNewMessage()
                } else {
                    setTimeout(function() {
                        checkIsNewMessage()                    
                    }, 500)
                }
            }
        }

        xhr.send();
    }

    var getMessages = function() {
        var url = "/messages.json",
            xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText)
                    let messages = data.msgs

                    let ppl = data.people
                    document.getElementById('im-list').innerHTML = ppl.join("")

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
                        x[i].innerHTML = h+":"+ ("0"+d.getMinutes()).slice(-2) +" "+ap
                    }
                    var mc = document.getElementById("messages_container");
                    mc.scrollTop = mc.scrollHeight;
                } else {
                    console.log('Error: ' + xhr.status);
                }
            }
        }

        xhr.send();
    }

    getMessages()
    checkIsNewMessage()
    var mi = document.getElementById("message-input")
    mi.style.display = "inherit"
    mi.addEventListener('keydown', function (e){
        console.log(e)
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
            newMessage()
        }
        window.setTimeout(function() {
            mi.style.height = '42px'
            mi.style.height = mi.scrollHeight+'px'
        }, 0)
    });
})()
