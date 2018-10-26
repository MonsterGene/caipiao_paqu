const http = require('http')
const $ = require('cheerio')
const moment = require('moment')
const DBConn = require('./db/DBInit')
const kaijiangModel = require('./db/models/kaijiang')

const next = (date) => {
	setTimeout(() => {
		getData(moment(date).subtract(1, 'days'))
	}, 150);
}
const getData = (date) => {
	if(moment(date)<moment('2018-01-01')){
		return 
	}
	date = date ? date : Date.now()
	let srcUrl = 'http://kaijiang.500.com/static/info/kaijiang/xml/gdsyxw/'
	srcUrl += moment(date).format('YYYYMMDD') + '.xml'
	console.log(srcUrl)
	
	http.get(srcUrl, res=> {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];
		
		console.log(statusCode, contentType)
		if (statusCode !== 200){
			next(date)
			res.resume()
			return process.exit(0)
		}
		
		let rawData = ''
		res.on('data',chunk => {
			rawData += chunk
		})
		res.on('end', () => {
			// console.log(rawData)
			const $$ = $.load(rawData)
			const data = []
			$$('row').each((i,v) => {
				data.push(v.attribs)
			})
			DBConn.conn()
			kaijiangModel.create(data.map(
				v => Object.assign(v, {caipiao_pinzhong: 'gdsyxw', cpName: '广东11选5'})),
				(err,doc) => {
					if (err) {
						console.log(err)
					} else {
						console.log('ok')
						
						// console.log(doc)
					}
					next(date)
					// process.exit(0)
				}
			)
		})
	}).on('error', e=>{
		console.error(e)
	})
}
getData()
