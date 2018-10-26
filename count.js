// const mongoose = require('mongoose')
const fs = require('fs')
const DBConn = require('./db/DBInit')
const kaijiangModel = require('./db/models/kaijiang')

DBConn.conn()
kaijiangModel.mapReduce({
	map:function(){
		emit(this.opencode, this.expect)
	},
	/**
	 * reduce函数的作用对map函数传递过来的键值对进行处理, 每个<key, values>键值对中
	 * key是userId字段的值，values是具有相同userId的nick的数组。
	 * 由于我的程序中一个values的各个元素的值是相同的，所以没有对values进行遍历。
	 *  */
	reduce: function(key, values){
		return values.length
	}
},function(err, result){
	result.results.sort((a,b)=>b.value-a.value);
	fs.writeFile('./'+Date.now()+'.json',JSON.stringify(result),()=>{
		// console.log(arguments)
	})
	var f = result.results.filter(v=>v.value>15)
	console.log(f.length,f.reduce((acc, cur)=>acc+cur.value,0))
	console.log(result.results.length)
})

// .aggregate([
// 	{$match:{opentime: {$lt: new Date()}}},
// 	{$group:{
// 		_id: null,
// 		opentime:{$sum: 1}
// 	}}
// ]).then(res=>{
// 	console.log(res)
// })