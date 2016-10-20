/*专为其他App提供后端服务，如文件存储服务（qiniu）
 */
var _app = global._app = {};
_app.hostPort = 8000;

//外部库引入
var $http = global.$http = require('http');
var $https = global.$https = require('https');
var $fs = global.$fs = require('fs');
var $path = global.$path = require('path');
var $co = global.$co = require('co');
var $koa = global.$koa = require('koa');
var $router = global.$router = require('koa-router');
var $bodyParser = global.$bodyParser = require('koa-bodyparser');
var $mysql = global.$mysql = require('mysql');
var $crypto = global.$crypto = require('crypto');
var $socketio = global.$socketio = require('socket.io');
//自定义库引入
global._cfg = require('./my_modules/cfg.js');
global._ctnu = require('./my_modules/ctnu.js');
global._fns = require('./my_modules/fns.js');
global._rotr = require('./my_modules/rotr.js');
//global._mysql = require('./my_modules/mysql.js');
global._Mysql = require('./my_modules/mysql_.js');



//服务器对象
var koaSvr = _app.koaSvr = $koa();
var httpSvr = _app.httpSvr = $http.createServer(koaSvr.callback());

//启动socketio服务
var sktSvr = _app.sktSvr = $socketio(httpSvr);


var allskts = {};
sktSvr.on('connection', function (skt) {

	allskts[skt.conn.id] = skt;
	var msg1 = {
		nick: '系统',
		content: '欢迎来带聊天室'
	};

	skt.emit('chat', __newMsg(1, 'ok', msg1));


	skt.on('chat', function (msg) {
		for (var attr in allskts) {
			var sktcli = allskts[attr];
			sktcli.emit('chat', __newMsg(1, 'ok', msg));
		}
	});
});



//读取外部xcfg文件写入_xfg全局参数
(function () {
	_app.httpSvr.listen(_app.hostPort);
	__infohdlr('Server is running on:' + _app.hostPort + '!');
})();

//使用body解析器
koaSvr.use($bodyParser({
	onerror: function (err, ctx) {
		ctx.request.body = undefined;
		__errhdlr(err);
	}
}));

//http请求的路由控制
koaSvr.use(_rotr.routes());

koaSvr.use(require('koa-static')('www'));
