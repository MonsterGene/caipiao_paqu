// const mongoose = require('mongoose')
const fs = require('fs')
const DBConn = require('./db/DBInit')
const kaijiangModel = require('./db/models/kaijiang')

DBConn.conn()
kaijiangModel.mapReduce({
	/**
	 * map函数的作用是遍历集合，调用emit函数将集合中userId、nick字段以键值对的形式传递给reduce函数
	 */
	map: function(){
		emit(this.opencode, this.expect)
	},
	/**
	 * reduce函数的作用对map函数传递过来的键值对进行处理, 每个<key, values>键值对中
	 * key是userId字段的值，values是具有相同userId的nick的数组。
	 * 由于我的程序中一个values的各个元素的值是相同的，所以没有对values进行遍历。
	 *  */
	reduce: function(key, values){
		return {acc: values.length}
	}
},function(err, result){
	if(err) {
		console.log('------ mapreduce error ------')
		return
	}
	result.results.sort((a,b)=>b.value.acc-a.value.acc);
	fs.writeFile('./'+Date.now()+'.json',JSON.stringify(result),()=>{})
})

kaijiangModel.find((err, doc)=>{
	console.log(doc.length)
	let count = doc.reduce((acc, cur) => {
		if (typeof acc[cur.opencode] !== 'undefined'){
			acc[cur.opencode] += 1
		}else{
			acc[cur.opencode] = 1
		}
		return acc
	},{})
	count = Object.keys(count).map(key => ({opencode:key,acc: count[key]}))
	count.sort((a, b) => b.acc-a.acc)
	console.log(count.length, count.reduce((acc, cur)=>acc+cur.acc, 0))
	fs.writeFile('./'+Date.now()+"_2.json",JSON.stringify(count),()=>{})
})

kaijiangModel.aggregate([
	{$match:{opentime: {$lt: new Date()}}},
	{$group:{
		_id: '$opencode',
		acc:{$sum: 1}
	}},
	{$sort: {acc: -1}}
]).then(res=>{
	fs.writeFile('./'+Date.now()+"_3.json",JSON.stringify(res),()=>{})
})