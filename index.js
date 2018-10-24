const http = require('http')
let srcUrl = 'http://kaijiang.500.com/static/info/kaijiang/xml/gdsyxw/20181024.xml?_A=ZVACQRDN1540400705298'

http.get(srcUrl, res=> {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let rawData = ''
    res.on('data',chunk => {
        rawData += chunk
    })
    res.on('end', () => {
        console.log(rawData)
    })
}).on('error', e=>{
    console.error(e)
})