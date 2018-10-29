const moment = require('moment')
const http   = require('http')
const $      = require('cheerio')
const DBConn = require('../db/DBInit')
const kaijiangModel = require('../db/models/kaijiang')

const getData = function(startDate, endDate){
	/**
	 * 接收两个参数：startDate（开始日期），endDate（结束日期）
	 * 如果只有 startDate 则只爬取该日期当天的数据，如果两个日期都有则爬取该日期段所有的数据
	 */
	startDate = moment(startDate).format('YYYY-MM-DD')
	endDate = endDate ? moment(endDate).format('YYYY-MM-DD') : null
	let debug = true
	const plog = function(){
		if(debug) console.log(...arguments)
	}
	let srcUrl = 'http://kaijiang.500.com/static/info/kaijiang/xml/gdsyxw/'
	srcUrl += moment(startDate).format('YYYYMMDD') + '.xml'
	plog(srcUrl)

	const next = (stDate, endDate) => {
		if (endDate && new Date(stDate)-new Date(endDate) < 0) {
			stDate = moment(stDate).add(1, 'days').format('YYYY-MM-DD')
			setTimeout(() => {
				getData(stDate, endDate)
			}, 200);
		}else{
			process.exit(0)
		}
	}
	srcUrl = {
		host: '10.191.131.156',
		port: 3128,
		path: srcUrl,
		headers: {
			"Proxy-Authorization": "Basic RjEzMzE4NjU6Rm94Y29ubjE2OCEh"
		}
	}
	http.get(srcUrl, res => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];
		plog(statusCode, contentType)

		if ( statusCode !== 200) {
			next(startDate, endDate)
			return res.resume()
		}

		let rawData = ''
		res.on('data', data => {
			rawData += data
		})
		res.on('end', () => {
			const $$ = $.load(rawData)
			const data = []
			$$('row').each((i, v) => {
				data.push( v.attribs )
			})
			data.map(v => {
				let sortopencode = v.opencode.split(',').sort().join(',')
				v.sortopencode = sortopencode
				v.caipiao_pinzhong = 'gdsyxw'
				v.cpName = '广东11选5'
			})

			DBConn.conn()
			kaijiangModel.create(
				data,
				(err, doc) => {
					if (err) {
						plog(err)
					}else{
						plog('ok')
					}
					next(startDate, endDate)
				}
			)
		})
	}).on('error', err => {
		plog('------ error ------')
		plog(err)
		next(startDate, endDate)
	})

}

module.exports = getData