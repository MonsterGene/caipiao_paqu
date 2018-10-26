// const mongoose = require('mongoose')
const fs = require('fs')
const DBConn = require('./db/DBInit')
const kaijiangModel = require('./db/models/kaijiang')

DBConn.conn()
kaijiangModel.mapReduce({
	map:function(){
		emit(this.opencode, this.opentime)
	},
	reduce: function(key, values){
		var result = {opencode: values.length}
		return result
	}
},function(err, result){
	fs.writeFile('./'+Date.now()+'.json',JSON.stringify(result),()=>{
		// console.log(arguments)
	})
	result.results.forEach(v => {
		if(v.value.opencode){
			console.log(v._id,v.value)
		}
	});
	console.log('ok')
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