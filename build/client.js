"use strict";var newMessage=function(){var e="/message?ajax=true",t=new XMLHttpRequest,s=document.getElementById("message-input"),n=s.value;if(n){s.value="",s.focus();var a="message="+encodeURIComponent(n);return t.open("POST",e),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.send(a),!1}},checkIsNewMessage=function e(){console.log("waiting for a new message");var t="/is-new-message?"+Math.random(),s=new XMLHttpRequest;s.open("GET",t),s.onload=function(){console.log("Got new message!"),getMessages(),e()},s.onreadystatechange=function(){4===s.readyState&&(200===s.status||setTimeout(function(){e()},500))},s.send()},getMessages=function(){var e="/messages.json",t=new XMLHttpRequest;t.open("GET",e),t.onreadystatechange=function(){if(4===t.readyState)if(200===t.status){var e=JSON.parse(t.responseText),s=e.msgs,n=e.people;document.getElementById("im-list").innerHTML=n.join("");for(var a="",o=0;o<s.length;o++)a+=s[o];document.getElementById("day_msgs").innerHTML=a;for(var r=document.getElementsByClassName("timestamp"),o=0;o<r.length;o++){var g=new Date(Number(r[o].getAttribute("data-ts"))),u=g.getHours(),i=u>12?"PM":"AM",u=u>12?u-12:u;r[o].innerHTML=u+":"+g.getMinutes()+" "+i}var c=document.getElementById("messages_container");c.scrollTop=c.scrollHeight}else console.log("Error: "+t.status)},t.send()};window.onload=function(){getMessages(),checkIsNewMessage()};