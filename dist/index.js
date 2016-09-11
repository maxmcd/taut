"use strict";var server=void 0;!function(){for(var t=require("http"),n=require("url"),e=require("fs"),i=require("querystring"),s=require("crypto"),r=8125,a=58e3,o=[],c={},d=function(){try{return JSON.parse(e.readFileSync(__dirname+"/data.json"))}catch(t){return{m:[],u:{},s:{}}}}(),u=d.m,l=d.u,p=d.s,v=(t)=>{var n=g((new Date).getTime());return n+"."+f(t+n)},m=(t,n)=>{var e=n.split(".");return f(t+e[0])==e[1]},f=(t)=>{for(var n=0;n<1e3;n++)t=g(t);return t},g=(t)=>{return s.createHash("sha256").update(String(t)).digest("hex")},h=(t)=>{var n=g(t+(new Date).getTime());return p[n]=t,n},b=(t,n)=>{return n||(n=""),'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Taut</title><link rel="stylesheet" href="/app.css" />'+n+"</head>"+t+""},w="32a719e6355e88f1c782e5415053c056c2a2929b25d45b5755b439d2c01c131005299c03415719",y={},T=97;T<123;T++){var S=3*(T-97);y[String.fromCharCode(T)]=w.substring(S,S+3)}var _=(t,n)=>{t||(t=0);var e="",i='autofocus id="message-input" placeholder="Message #general" autocorrect="off" autocomplete="off" spellcheck="true"',s='<body><div id="client-ui"><header><div id="team_menu"><span id="tn">Taut</span><li class="usr"><span class="presence active"></span>'+n+'</li></div><div id="ch"><div id="ct">#general</div><div id="chi">'+t+' members</div><a href="/signout" id="so">sign out</a></div></header><div id="f"><div id="mic"><form action="/message" method="post" target="" id="message-form" onsubmit="newMessage();return false;"><noscript><input name="message" '+i+"/></noscript><textarea "+i+' /></textarea></form></div></div><div id="cb"><div id="cm"><div class="row-fluid"><div id="ccb"></div><div id="cc"><ul id="im-list"><li class="usr active"># general</li><div id="ili"></div></ul><noscript><iframe src="/people" frameborder="0"></iframe></noscript></div><noscript><iframe id="m" name="mc" src="/messages?id='+Math.random()+'#l" frameborder="0"></iframe></noscript><div id="mc"><div id="cd">Connection lost. Reconnecting...</div><div id="msd"><div><div id="dc"><div id="dm"></div></div></div></div></div></div></div></div></div><script src="/client.js"></script></body>';return b(s,e)},k=(t)=>{return t.map((t)=>{return'<li class="usr"><span class="presence active"></span>'+t+"</li>"})},x=(t)=>{return b('<body class="transparentB"><div id="iframe_body"><ul id="im-list"><li class="usr active"># general</li><div id="ili">'+k(t).join()+"</div></ul></div></body>",'<!-- <noscript> --><meta http-equiv="refresh" content="30" /><!-- </noscript> -->')},j=(t)=>{return b('<body class="signup"><div class="card"><form method="post"><h2>Sign up or log in to Taut</h2><p>'+(t||"")+'</p><input type="text" name="nic" placeholder="username" autofocus><input type="password" name="pass" placeholder="password"><input type="submit" class="btn" /><p><small>Taut is a slack clone in 10K. View the <a href="//github.com/maxmcd/taut">source and info</a>. Taut is not created by, affiliated with, or supported by Slack Technologies, Inc.</small></p></form></div></div>')},q=(t,n,e)=>{var i=C(t).join(""),s="</div></div></div></div></body>";return n&&(s=""),b('<body class="scrollY"><div id="iframe_body"><div id="msg_div"><div class="dc"><div id="dm">'+i+s+'<a name="l"></a>','<!-- <noscript> --><meta http-equiv="refresh" content="0; ?ts='+e+"&id="+Math.random()+'#l" /><!-- </noscript> -->')},C=(t)=>{for(var n=[],e=0;e<t.length;e++){var i=void 0;e>0&&(i=t[e-1]),n.push(H(t[e],i))}return n},$=(t)=>{t=t.replace(/</g,"&lt;").replace(/>/g,"&gt;");var n={"\\*":"b",_:"i","~":"strike","`":"code"};for(var e in n){var i=new RegExp("(\\s?)"+e+"(.*?)"+e+"($|\\s)","gmi");t=t.replace(i,"$1<"+n[e]+">$2</"+n[e]+">")}return t=t.replace(/^&gt;(.*)$/gm,"<blockquote>$1</blockquote>"),t=t.replace(/(^|\s)([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,'$1<a href="http://$2" target="_blank">$2</a>'),t=t.replace(/(^|\s)(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]+\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))/gi,'$1<a href="$2" target="_blank">$2</a>'),t=t.replace(/\n/gi,"<br>")},H=(t,n)=>{var e=t.sender,i=t.content,s='<div class="mg"><div class="mi"><span style="background-color: #'+(y[e[0].toLowerCase()]||"ccc")+'"class="memi">'+e[0]+"</span></div></div>",r='<span class="member">'+e+'</span>&nbsp;<span class="timestamp" data-ts="'+t.ts+'"></span>';return n&&n.sender==t.sender&&t.ts-n.ts<6e4&&(r="",s=""),"<ts-message>"+s+'<div class="mco">'+r+'<span class="mb">'+i+"</span></div></ts-message>"},z=(t)=>{var n=("; "+t.headers.cookie).split("; session=");if(2==n.length)return p[n.pop().split(";").shift().trim()]},D=(t,n,e,i)=>{t?(c[t]=(new Date).getTime(),n.end(_(Object.keys(c).length,t),"utf-8")):n.end(j(i),"utf-8")},I=function(){var t=[],n=(new Date).getTime()-3e5;for(var e in c)c[e]>n?t.push(e):delete c[e];return t},M=(t,n)=>{var i="js"==n.slice(-2)?"application/javascript":"text/css";e.readFile(__dirname+"/"+n+".gz",(s,r)=>{s?e.readFile(__dirname+"/"+n,(n,e)=>{O(t,i),t.end(e,"utf-8")}):(t.writeHead(200,{"Content-Type":i,"content-encoding":"gzip"}),t.end(r,"utf-8"))})},O=(t,n,e)=>{t.writeHead(e||200,{"Content-Type":n||"text/html"})};server=t.createServer((t,e)=>{var s=n.parse(t.url,!0),r=s.pathname,d=s.query;if("/"===r)if("POST"==t.method)t.on("data",(t)=>{var i=n.parse("?"+t.toString("utf8"),!0).query;i.nic=i.nic.replace(/</g,"&lt;").replace(/>/g,"&gt;");var s=void 0;if(i.nic&&i.pass){var r=l[i.nic];r&&!m(i.pass,r)?s="Incorrect password, or username is already taken!":l[i.nic]=v(i.pass)}else s="Username or password can't be blank!";s?(O(e,null,400),e.end(j(s),"utf-8")):(e.writeHead(200,{"Content-Type":"text/html","Set-Cookie":"session="+h(i.nic)+" ;expires="+new Date(1999999999999).toGMTString()}),D(i.nic,e,d))});else{O(e);var p=z(t);D(p,e,d)}else if("/signout"===r)e.writeHead(302,{"Content-Type":"text/html","Set-Cookie":"session=",Location:"/"}),e.end();else if("/client.js"===r)M(e,"client.js");else if("/app.css"===r)M(e,"app.css");else if("/people"===r)O(e),e.end(x(I()));else if("/messages"===r)!function(){O(e),e.setTimeout(a,function(){e.end(q(u,!1,i),"utf-8")});var n=d.ts,i=u[u.length-1].ts;n&&n==i?o.push([(t)=>{e.end(q(u,!1,t.ts),"utf-8")},z(t)]):e.end(q(u,!1,i),"utf-8")}();else if("/messages.json"===r){O(e,"application/json");var f={msgs:C(u),people:k(I())};e.end(JSON.stringify(f),"utf-8")}else"/ping"===r?(O(e),e.end("pong")):"/is-new-message"===r?(e.setTimeout(a,function(){e.end("maybe")}),o.push([function(){e.end("yes")},z(t)])):"/message"===r?t.on("data",(n)=>{var s=i.parse(n.toString("utf8"));c[z(t)]=(new Date).getTime();var r=z(t);if(!r)return e.writeHead(400),void e.end("400");var a={sender:r,content:$(s.message),ts:(new Date).getTime()};for(u.push(a),u.length>50&&u.shift();o.length;)o.pop()[0](a);d.ajax?e.writeHead(200):e.writeHead(302,{Location:"/"}),e.end("")}):(e.writeHead(404),e.end("404","utf-8"))}).listen(r),console.log("Running on port "+r),process.stdin.resume();var R=function(){e.writeFileSync(__dirname+"/data.json",JSON.stringify({s:p,u:l,m:u}))};process.on("exit",function(){R()}),process.on("SIGINT",function(){process.exit(0)}),process.on("SIGTERM",function(){process.exit(0)}),process.once("SIGUSR2",function(){R(),process.kill(process.pid,"SIGUSR2")})}(),module.exports=server;