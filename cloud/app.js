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


var pids = null;
var pids_value = null;

var things = new Array();
function querytest(res,seriesID){
    var query = new AV.Query("series");
    var query_thing = new AV.Query("Things");
    pids = null;
    pids_value = new Array();
    var createDate;

    var query_series = new AV.Query("series");
    relate_series = new Array();

    query.get( seriesID, {
              success: function(result) {
	           createDate = result.createdAt;
		   var month = createDate.getMonth() + 1;
		   createDate = createDate.getFullYear()+"-"+ month +"-"+createDate.getDate();
                   pids = result.get("pids").split(",");
		   for(var i = 0; i < pids.length; i++){
			pids_value.push(Number(pids[i]));
		   }

		   var tag1 = result.get("tag1");
		   query_series.equalTo("tag1", tag1);
		   query_series.limit(5);
//		   query_series.notEqualTo("objectId", seriesID);
		   query_series.descending("createdAt");
		   query_series.lessThan("createdAt", result.createdAt));
		   
                   query_thing.containedIn("pid", pids_value);
		   query_thing.ascending("pid");

		   query_thing.find({
                        success: function(result_things) {

		   		query_series.find({
					success:function(result_series){
						relate_series = result_series;
              	   				console.log("get relate series:" + result_series);
			   			res.render('series', {series:result, things:result_things, date:createDate, relate:result_series});
					},
					error:function(error){
              	   				console.log("get relate series error:" + error);
					}
		   		});
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
		console.log("uid=" + uid + " sid=" + req.query.sid);
	}
	else{
		console.log("uid=" + req.cookies.uid + " sid=" + req.query.sid);
	}
        });

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
