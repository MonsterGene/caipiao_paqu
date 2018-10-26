const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	caipiao_pinzhong: String, //彩种
	expect: String,  // 期号
	opencode: String, // 开奖结果
	opentime: Date,
	cpName: String,
	meta: {
		createAt: {type:Date, default:Date.now()}
	}
}, {
	timestamps: {
		createdAt: 'meta.createAt'
	}
})

const model = mongoose.model('kaijiang',schema)

module.exports = model
