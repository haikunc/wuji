// 在 Cloud code 里初始化 Express 框架

var express = require('express');
var app = express();

var avosExpressHttpsRedirect = require('avos-express-https-redirect');
app.use(avosExpressHttpsRedirect());

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(express.cookieParser());

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
        res.render('hello', { message: 'Congrats, you just set up your app!' });
        });


var tids = null;
var things = new Array();
function querytest(res,seriesID){
    var query = new AV.Query("series");
    var query_thing = new AV.Query("Things");
    tids = null;

    query.get( seriesID, {
              success: function(result) {
                   tids = result.get("things").split(",");

                   query_thing.containedIn("objectId", tids);
		   query_thing.find({
                        success: function(result_things) {
			   res.render('series', {series:result, things:result_things});
		        },
                           error: function(error) {res.render('hello', { message: 'Error'});}
                       });
              },
              
              error: function(error) {
              	   console.log(error);
              	   res.render('hello', { message: 'Error'});
              }
        });

}

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

app.get('/series',function(req,res){
	var uid;
        querytest(res,req.query.sid);
	if(typeof(req.cookies.uid) == "undefined"){
		uid = randomString(32);
		res.cookie('uid', uid, {maxAge:600000, httpOnly:true, path:'/', secure:true});
		console.log("uid=" + req.cookies.uid + " sid=" + req.query.sid);
	}
	else{
		console.log("uid=" + req.cookies.uid + " sid=" + req.query.sid);
	}
        });

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
