X = 'use strict;!function(){for(var t=require(http),n=require(url),e=require(fs),i=require(querystring),s=require(crypto),a=8125,r=58e3,o=[],c={},d=function(){try{return JSON.parse(e.readFileSync(__dirname+/data.json))}catch(t){return{m:[],u:{},s:{}}}}(),l=d.m,u=d.u,p=d.s,m=(t)=>{return s.createHash(sha256).update(t).digest(hex)},f=(t)=>{var n=m(t+(new Date).getTime());return p[n]=t,n},v=(t,n)=>{return n||(n=), <!DOCTYPE html><html lang=en><head><meta charset=UTF-8><meta name=viewport content=width=device-width, initial-scale=1.0><title>Taut</title><link rel=stylesheet href=/app.css /> +n+</head>+t+},g=32a719e6355e88f1c782e5415053c056c2a2929b25d45b5755b439d2c01c131005299c03415719,h={},b=97;b<123;b++){var w=3*(b-97);h[String.fromCharCode(b)]=g.substring(w,w+3)}var y=(t)=>{t||(t=0);var n=,e= autofocus id=message-input placeholder=Message #general autocorrect=off autocomplete=off spellcheck=true ,i= <bo';

for (Y = 2; Y;) {
    let char = String.fromCharCode(Y)
    let regex = RegExp(char, 'g')
    let key = '"*\'';
    let toReplace = key.split('*')[--Y];
    console.log(JSON.stringify(char))
    console.log(Y)
    console.log(toReplace)
    X = X.replace(regex, toReplace)
};

console.log(JSON.stringify(X))