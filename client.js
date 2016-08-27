(function() {
    var lastTs;
    var cd = document.getElementById("connection_div")

    window.newMessage = function() {
        var url = "/message?ajax=true",
            xhr = new XMLHttpRequest();
        var input = document.getElementById('message-input')
        var message = input.value.replace(/\n\s*\n/g, '\n');
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

    var saveMyself = function(delay) {
        cd.style.display = "initial"
        delay = delay * 2 + 1
        var url = "/ping",
            xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    cd.style.display = "none"
                    getMessages()
                    checkIsNewMessage()
                } else {
                    console.log("Retrying in " + delay/1000 + " seconds")
                    setTimeout(function() {
                        saveMyself(delay)
                    }, delay)
                }
            }
        }
        xhr.send();
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
                    saveMyself(100)
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
                    var mc = document.getElementById("msgs_scroller_div");
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
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
            newMessage()
        }
        window.setTimeout(function() {
            mi.style.height = '42px'
            mi.style.height = mi.scrollHeight+'px'
        }, 0)
    });

    // function notify(message) {
    //     if (!("Notification" in window)) {

    //     } else if (Notification.permission === "granted") {
    //         var notification = new Notification(message);
    //     }
    //     else if (Notification.permission !== 'denied') {
    //         Notification.requestPermission(function(permission) {
    //             if (permission === "granted") notify(message);
    //         });
    //     }
    // }

})()
