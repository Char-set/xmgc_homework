/*mysql数据模块
*/
var _mysql={};

var conn=_mysql.conn=$mysql.createConnection({
	host:'182.254.151.40',
	port:'3306',
	database:'homework',
	user:'root',
	password:'Abc!@#123'
});

conn.connect();

//导出模块
module.exports = _mysql
