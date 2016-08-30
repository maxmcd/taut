(function() {
    // We want a map of colors, but with less bytes
    var colors = {
        a: '32a',
        b: '719',
        c: 'e63',
        d: '55e',
        e: '88f',
        f: '1c7',
        g: '82e',
        h: '541',
        i: '505',
        j: '3c0',
        k: '56c',
        l: '2a2',
        m: '929',
        n: 'b25',
        o: 'd45',
        p: 'b57',
        q: '55b',
        r: '439',
        s: 'd2c',
        t: '01c',
        u: '131',
        v: '005',
        w: '299',
        x: 'c03',
        y: '415',
        z: '719',
    }

    // pack the data in a string, use regex and a loop to re-assemble
    var colorKey = "a32ab719ce63d55ee88ff1c7g82eh541i505j3c0k56cl2a2m929nb25od45pb57q55br439sd2ct01cu131v005w299yc03z415"
    var keyParts = colorKey.match(/.{1,4}/g)
    for (var i=0;i<keyParts.length;i++) {
        colors[keyParts[i].substring(0,1)] = keyParts[i].substring(1,4)
    }


    // That was a litle verbose, we can also generate the alphabet in a loop
    colorKey = "32a719e6355e88f1c782e5415053c056c2a2929b25d45b5755b439d2c01c131005299c03415719"
    for (var i=97;i<123;i++) {
        var colorIndex = (i-97)*3
        colors[String.fromCharCode(i)] = colorKey.substring(colorIndex, colorIndex+3)
    }

    // hilariously enough it would seem the space saving benefits from this are very small
})()