// 在 Cloud code 里初始化 Express 框架

var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/hello2',function(req,res){
  var query = new AV.Query("Things");
  query.equalTo("name", req.params.movie);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
      	res.success(results[i].get("name"));
      }
    },
    error: function() {
      res.error("Things lookup failed");
    }
  });
}

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
