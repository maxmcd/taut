"use strict";!function(){for(var t=require("http"),n=require("url"),e=require("fs"),i=require("querystring"),s=require("crypto"),a=8125,r=58e3,o=[],c={},d=function(){try{return JSON.parse(e.readFileSync(__dirname+"/data.json"))}catch(t){return{m:[],u:{},s:{}}}}(),l=d.m,u=d.u,p=d.s,m=(t)=>{return s.createHash("sha256").update(t).digest("hex")},f=(t)=>{var n=m(t+(new Date).getTime());return p[n]=t,n},v=(t,n)=>{return n||(n=""),'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Taut</title><link rel="stylesheet" href="/app.css" />'+n+"</head>"+t+""},g="32a719e6355e88f1c782e5415053c056c2a2929b25d45b5755b439d2c01c131005299c03415719",h={},b=97;b<123;b++){var w=3*(b-97);h[String.fromCharCode(b)]=g.substring(w,w+3)}var y=(t,n)=>{t||(t=0);var e="",i='autofocus id="message-input" placeholder="Message #general" autocorrect="off" autocomplete="off" spellcheck="true"',s='<body><div id="client-ui"><header><div id="team_menu"><span id="tn">Taut</span><li class="usr"><span class="presence active"></span>'+n+'</li></div><div id="ch"><div id="ct">#general</div><div id="chi">'+t+' members</div><a href="/signout" id="so">sign out</a></div></header><div id="f"><div id="mic"><form action="/message" method="post" target="" id="message-form" onsubmit="newMessage();return false;"><noscript><input name="message" '+i+"/></noscript><textarea "+i+' /></textarea></form></div></div><div id="cb"><div id="cm"><div class="row-fluid"><div id="ccb"></div><div id="cc"><ul id="im-list"><li class="usr active"># general</li><div id="ili"></div></ul><noscript><iframe src="/people" frameborder="0"></iframe></noscript></div><noscript><iframe id="m" name="mc" src="/messages?id='+Math.random()+'#l" frameborder="0"></iframe></noscript><div id="mc"><div id="cd">Connection lost. Reconnecting...</div><div id="msd"><div><div id="dc"><div id="dm"></div></div></div></div></div></div></div></div></div><script src="/client.js"></script></body>';return v(s,e)},S=(t)=>{return t.map((t)=>{return'<li class="usr"><span class="presence active"></span>'+t+"</li>"})},T=(t)=>{return v('<body class="transparentB"><div id="iframe_body"><ul id="im-list"><li class="usr active"># general</li><div id="ili">'+S(t).join()+"</div></ul></div></body>",'<!-- <noscript> --><meta http-equiv="refresh" content="30" /><!-- </noscript> -->')},_=(t)=>{return v('<body class="signup"><div class="card"><form method="post"><h2>Sign up or log in to Taut</h2><p>'+(t||"")+'</p><input type="text" name="nic" placeholder="username" autofocus><input type="password" name="password" placeholder="password"><input type="submit" class="btn" /><p><small>Taut is a slack clone in 10K. View the <a href="//github.com/maxmcd/taut">source and info</a>. Taut is not created by, affiliated with, or supported by Slack Technologies, Inc.</small></p></form></div></div>')},k=(t,n,e)=>{var i=x(t).join(""),s="</div></div></div></div></body>";return n&&(s=""),v('<body class="scrollY"><div id="iframe_body"><div id="msg_div"><div class="dc"><div id="dm">'+i+s+'<a name="l"></a>','<!-- <noscript> --><meta http-equiv="refresh" content="0; ?ts='+e+"&id="+Math.random()+'#l" /><!-- </noscript> -->')},x=(t)=>{for(var n=[],e=0;e<t.length;e++){var i=void 0;e>0&&(i=t[e-1]),n.push(q(t[e],i))}return n},j=(t)=>{t=t.replace(/</g,"&lt;").replace(/>/g,"&gt;");var n={"\\*":"b",_:"i","~":"strike","`":"code"};for(var e in n){var i=new RegExp("(\\s?)"+e+"(.*?)"+e+"($|\\s)","gmi");t=t.replace(i,"$1<"+n[e]+">$2</"+n[e]+">")}return t=t.replace(/^&gt;(.*)$/gm,"<blockquote>$1</blockquote>"),t=t.replace(/(^|\s)([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,'$1<a href="http://$2" target="_blank">$2</a>'),t=t.replace(/(^|\s)(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,'$1<a href="$2" target="_blank">$2</a>'),t=t.replace(/\n/gi,"<br>")},q=(t,n)=>{var e=t.sender,i=t.content,s='<div class="mg"><div class="mi"><span style="background-color: #'+(h[e[0].toLowerCase()]||"ccc")+'"class="memi">'+e[0]+"</span></div></div>",a='<span class="member">'+e+'</span>&nbsp;<span class="timestamp" data-ts="'+t.ts+'"></span>';return n&&n.sender==t.sender&&t.ts-n.ts<6e4&&(a="",s=""),"<ts-message>"+s+'<div class="mco">'+a+'<span class="mb">'+i+"</span></div></ts-message>"},$=(t)=>{var n=("; "+t.headers.cookie).split("; session=");if(2==n.length)return p[n.pop().split(";").shift()]},C=(t,n,e,i)=>{t?(c[t]=(new Date).getTime(),n.end(y(Object.keys(c).length,t),"utf-8")):n.end(_(i),"utf-8")},H=function(){var t=[],n=(new Date).getTime()-3e5;for(var e in c)c[e]>n?t.push(e):delete c[e];return t},z=(t,n)=>{var i="js"==n.slice(-2)?"application/javascript":"text/css";e.readFile(__dirname+"/"+n+".gz",(s,a)=>{s?e.readFile(__dirname+"/"+n,(n,e)=>{I(t,i),t.end(e,"utf-8")}):(t.writeHead(200,{"Content-Type":i,"content-encoding":"gzip"}),t.end(a,"utf-8"))})},I=(t,n,e)=>{t.writeHead(e||200,{"Content-Type":n||"text/html"})};t.createServer((t,e)=>{var s=n.parse(t.url,!0),a=s.pathname,d=s.query,p=a.match(/^@(.*)$/i);if(p&&(p=p[1]),"/"===a||p)if("POST"==t.method)t.on("data",(t)=>{var i=n.parse("?"+t.toString("utf8"),!0).query,s=void 0;if(i.nic&&i.password){var a=m(i.password);u[i.nic]&&u[i.nic]!=a?s="Incorrect password, or username is already taken!":u[i.nic.replace(/</g,"&lt;").replace(/>/g,"&gt;")]=a}else s="Username or password can't be blank!";s?(I(e,null,400),e.end(_(s),"utf-8")):(e.writeHead(200,{"Content-Type":"text/html","Set-Cookie":"session="+f(i.nic)+" ;expires="+new Date(1999999999999).toGMTString()}),C(i.nic,e,d))});else{I(e);var v=$(t);C(v,e,d)}else if("/signout"===a)e.writeHead(302,{"Content-Type":"text/html","Set-Cookie":"session=",Location:"/"}),e.end();else if("/client.js"===a)z(e,"client.js");else if("/app.css"===a)z(e,"app.css");else if("/people"===a)I(e),e.end(T(H()));else if("/messages"===a)!function(){I(e),e.setTimeout(r,function(){e.end(k(l,!1,i),"utf-8")});var n=d.ts,i=l[l.length-1].ts;n&&n==i?o.push([(t)=>{e.end(k(l,!1,t.ts),"utf-8")},$(t)]):e.end(k(l,!1,i),"utf-8")}();else if("/messages.json"===a){I(e,"application/json");var g={msgs:x(l),people:S(H())};e.end(JSON.stringify(g),"utf-8")}else"/ping"===a?(I(e),e.end("pong")):"/is-new-message"===a?(e.setTimeout(r,function(){e.end("maybe")}),o.push([function(){e.end("yes")},$(t)])):"/message"===a?t.on("data",(n)=>{var s=i.parse(n.toString("utf8"));c[$(t)]=(new Date).getTime();var a=$(t);if(!a)return e.writeHead(400),void e.end("400");var r={sender:a,content:j(s.message),ts:(new Date).getTime()};for(l.push(r),l.length>50&&l.shift();o.length;)o.pop()[0](r);d.ajax?e.writeHead(200):e.writeHead(302,{Location:"/"}),e.end("")}):(e.writeHead(404),e.end("404","utf-8"))}).listen(a),console.log("Server running on port "+a),process.stdin.resume();var D=function(){e.writeFileSync(__dirname+"/data.json",JSON.stringify({s:p,u:u,m:l})),console.log("saved!")};process.on("exit",function(){D()}),process.on("SIGINT",function(){process.exit(0),console.log("sigint")}),process.on("SIGTERM",function(){process.exit(0)}),process.once("SIGUSR2",function(){console.log("SIGUSR2"),D(),process.kill(process.pid,"SIGUSR2")})}();