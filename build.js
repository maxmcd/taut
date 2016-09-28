const fs = require('fs')
const zlib = require('zlib')

fs.readFile('./dist/index.js', function(err, data) {
    // console.log(data)
    zlib.deflate(data, (err, buffer) => {
        let base64Src = buffer.toString('base64')
        let src = `require('zlib').unzip(Buffer.from("${base64Src}", 'base64'), (err, buffer) => {eval(buffer.toString())})`
        fs.writeFile('./dist/index.js', src)
    })    
})

