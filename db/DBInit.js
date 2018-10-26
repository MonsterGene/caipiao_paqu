const mongoose = require("mongoose")

mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
mongoose.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});
mongoose.connection.on("disconnected", function () {
    console.log("------数据库关闭成功！------");
});


module.exports = {
    mongoose:mongoose,
    conn:function(){
        mongoose.connect("mongodb://127.0.0.1:27017/caipiao_kaijiang")
    }
}