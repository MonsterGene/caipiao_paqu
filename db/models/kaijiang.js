const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	caipiao_pinzhong: String, //彩种
	expect: { // 期号
		type: String,
		unique: true // 设为唯一性索引
	},
	sortedopenncode: String, // 排序后的开奖结果
	opencode: String, // 开奖结果
	opentime: Date, // 开奖时间
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
