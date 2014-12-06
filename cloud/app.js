// 在 Cloud code 里初始化 Express 框架

var express = require('express');
var app = express();
var avosExpressHttpsRedirect = require('avos-express-https-redirect');

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(avosExpressHttpsRedirect());
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
        res.render('hello', { message: 'Congrats, you just set up your app!' });
        });



var query = new AV.Query("series");
var query_thing = new AV.Query("Things");
var tids = null;
var things = new Array();

function querytest(res,seriesID){
    query.get( seriesID, {
              success: function(result) {
                   tids = result.get("things").split(",");
              },
              
              error: function(error) {
              	   console.log(error);
              	   res.render('hello', { message: 'Error'});
              }
        });
    res.render('hello', { message: tids.length});
    console.log("adfasdfasdf");
	
/*
  for(var i=0; i < tt; ++i){
    for(var i=0; i < tids.length ; ++i){
    query_thing.get( tids[i], {
              success: function(result) {things.push(result);},
              error: function(error) {res.render('hello', { message: 'Error'});}
        });
    }

*/
//    res.render('hello', { message: things.length});


}

app.get('/hello2',function(req,res){
        querytest(res,req.query.sid);
        });

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
