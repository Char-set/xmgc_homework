/*http路由分发
接口模式server/:app/:api
*/

var _rotr = {};

//http请求的路由控制
_rotr = new $router();

//访问的请求
_rotr.get('api', '/api/:apiname', apihandler);
_rotr.post('api', '/api/:apiname', apihandler);





/*所有api处理函数都收集到这里
必须是返回promise
各个api处理函数用promise衔接,return传递ctx
*/
_rotr.apis = {};

/*处理Api请求
默认tenk的api直接使用
每个app的独立api格式appname_apiname
*/
function* apihandler(next) {
	var ctx = this;
	var apinm = ctx.params.apiname;

	console.log('API RECV:', apinm);

	//匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
	var apifn = _rotr.apis[apinm];
	ctx.xdat = {
		apiName: apinm
	};

	if (apifn && apifn.constructor == Function) {
		yield apifn.call(ctx, next).then(function () {

			//所有接口都支持JSONP,限定xx.x.xmgc360.com域名
			var jsonpCallback = ctx.query.callback || ctx.request.body.callback;
			if (jsonpCallback && ctx.body) {
				if (_cfg.regx.crossDomains.test(ctx.hostname)) {
					ctx.body = ctx.query.callback + '(' + JSON.stringify(ctx.body) + ')';
				};
			};

		}, function (err) {
			ctx.body = __newMsg(__errCode.APIERR, [err.message, 'API proc failed:' + apinm + '.']);
			__errhdlr(err);
		});
	} else {
		ctx.body = __newMsg(__errCode.NOTFOUND, ['服务端找不到接口程序', 'API miss:' + apinm + '.']);
	};

	yield next;
};




/*测试接口,返回请求的数据
 */
_rotr.apis.moban = function () {
	var ctx = this;
	var co = $co(function* () {
		var sqlstr = "select * from emp where empId = '7369';";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows) Error("找不到用户");
		var dat = {};
		dat.user = rows[0];
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};

//作业搜索接口，提交搜索值，模糊搜索字段 作业标题、课程、讨论区，返回搜索到的作业标题、作业id
_rotr.apis.search = function () {
	var ctx = this;
	var co = $co(function* () {
		var value = ctx.query.value || ctx.request.body.value;
		var sqlstr = "SELECT w.wid,w.title,c.`name` from work_info w LEFT JOIN course_info c ON c.cid=w.cid  WHERE w.title LIKE '%" + value + "%' OR c.`name` LIKE '%" + value + "%'";
		var paramat = [value, value];
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		var dat = {
			work: rows
		}
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};

_rotr.apis.login = function () {
	var ctx = this;
	var co = $co(function* () {
		var id = ctx.query.id || ctx.request.body.id;
		if (id == '') throw Error('请输入您的id！');
		var pw = ctx.query.pw || ctx.request.body.pw;
		if (!pw) throw Error("请输入密码！");
		var sqlstr = "select * from user_info where userid ='" + id + " ';";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		//		console.log(">>>>", rows.length, rows[0].password);
		if (rows.length == 0) throw Error("用户不存在");
		if (rows[0].password != pw) throw Error("密码格式不正确");
		if (!(rows[0].role == 3 || rows[0].role == 4)) throw Error('您的权限不够');

		ctx.body = __newMsg(1, 'ok');
		return ctx;
	});
	return co;
};

//若用户已在项目工场登入，检索此用户是否存在于作业模块的user表中，若无，则加入作业模块的表中,默认为学生
_rotr.apis.adduser = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var nick = ctx.query.nick || ctx.request.body.nick;
		if (nick == '' || nick == null) {
			nick = '未命名用户';
		}
		var sqlstr = "select * from user_info where userid =" + userid + ";";
		var dat = {};
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (rows.length == 0) {
			var date = [userid, nick];
			var str = "INSERT INTO user_info(userid,nick) VALUES(?,?)";
			_ctnu([_Mysql.conn, 'query'], str, date)
		} else {
			var date = [nick, userid];
			var str = "UPDATE user_info SET nick=? where userid=?";
			_ctnu([_Mysql.conn, 'query'], str, date)
		}
		dat.user = rows;
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};


//获取所有的课程，返回课程名
_rotr.apis.kecheng = function () {
	var ctx = this;
	var co = $co(function* () {

		var sqlstr = "select * from course_info;";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		console.log(">>>>", rows);
		ctx.body = rows;
		return ctx;
	});
	return co;
};
//用户头像接口，提交用户id，返回用户头像地址
_rotr.apis.userimg = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var sqlstr = "select img from user_info where userid = " + userid + ";";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows) Error("找不到用户");
		var dat = {
			img: rows[0]
		};
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};
//更新用户头像接口，提交用户id，头像地址
_rotr.apis.upUserimg = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var src = ctx.query.src || ctx.request.body.src;
		var sqlstr = "UPDATE user_info SET img='" + src + "' WHERE userid=" + userid + ";";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows) Error("找不到用户");
		var dat = {
			img: rows[0]
		};
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};

//布置作业接口，插入失败返回错误内容，插入成功返回成功信息
_rotr.apis.addwork = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.useid || ctx.request.body.useid;
		var creatdate = ctx.query.creatdate || ctx.request.body.creatdate;

		var str = "SELECT r.name FROM user_info u LEFT JOIN role r ON u.role=r.role WHERE userid=" + userid + ";";
		var role = yield _ctnu([_Mysql.conn, 'query'], str);
		if (role[0].name == '学生') throw Error('您的权限不够！');

		var title = ctx.query.title || ctx.request.body.title;
		if (!title) throw Error('标题格式不正确');

		var content = ctx.query.content || ctx.request.body.content;
		if (!content) throw Error('内容格式不正确');

		var Sselect = ctx.query.Sselect || ctx.request.body.Sselect;
		if (!Sselect) throw Error('课程格式不正确');

		var section = ctx.query.section || ctx.request.body.section;
		if (!section) throw Error('章节格式不正确');

		var mark = ctx.query.mark || ctx.request.body.mark;
		var annex = ctx.query.wenjian || ctx.request.body.wenjian;
		var fileName = ctx.query.fileName || ctx.request.body.fileName;

		var time = ctx.query.time || ctx.request.body.time;

		var day = ((time.substring(5, 7) - 0) - (creatdate.substring(5, 7) - 0)) * 30;
		if (!time) throw Error('截止时间格式不正确');

		if ((time.substring(0, 4) - 0) < (creatdate.substring(0, 4) - 0)) throw Error('截止时间不可小于当前时间');

		else if ((time.substring(5, 7) - 0) < (creatdate.substring(5, 7) - 0)) {

			throw Error('截止时间不可小于当前时间');
		} else if ((time.substring(8, 10) - 0 + (day - 0)) < (creatdate.substring(8, 10) - 0)) throw Error('截止时间不可小于当前时间');


		if ((time.substring(8, 10) - 0) == (creatdate.substring(8, 10) - 0)) throw Error('请至少给出一天时间给学生作答');

		var row = yield _ctnu([_Mysql.conn, 'query'], "select cid from course_info where name='" + Sselect + "';");
		var cid = row[0].cid;
		var parament = [userid, title, content, cid, section, mark, annex, time, creatdate, fileName];

		var sqlstr = "insert into work_info(userid,title,content,cid,section,mark,annex,enddate,creatdate,fileName) values(?,?,?,?,?,?,?,?,?,?)";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		if (rows.affectedRows == 0) throw Error('作业发布失败');

		var sqlstr1 = "select wid from  work_info where userid=? and title=? and content=? and cid=? and section=? and enddate=? and creatdate=? ";

		var parament1 = [userid, title, content, cid, section, time, creatdate];
		var row1 = yield _ctnu([_Mysql.conn, 'query'], sqlstr1, parament1);

		console.log(">>>>", row1[0].wid);

		ctx.body = __newMsg(1, 'ok', row1[0].wid);
		return ctx;
	});
	return co;
};

//教师更新作业，提交wid 作业信息，返回更新状况
_rotr.apis.updatework = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.useid || ctx.request.body.useid;
		var wid = ctx.query.wid || ctx.request.body.wid;
		var creatdate = ctx.query.creatdate || ctx.request.body.creatdate;

		var str = "SELECT r.name FROM user_info u LEFT JOIN role r ON u.role=r.role WHERE userid=" + userid + ";";
		var role = yield _ctnu([_Mysql.conn, 'query'], str);
		if (role[0].name == '学生') throw Error('您的权限不够！');

		var str2 = "SELECT userid from work_info WHERE wid=" + wid + ";";
		var role1 = yield _ctnu([_Mysql.conn, 'query'], str2);
		if (role1[0].userid != userid) throw Error('您的权限不够！');


		var title = ctx.query.title || ctx.request.body.title;
		if (!title) throw Error('标题格式不正确');

		var content = ctx.query.content || ctx.request.body.content;
		if (!content) throw Error('内容格式不正确');

		var Sselect = ctx.query.Sselect || ctx.request.body.Sselect;
		console.log(">>>>kecheng", Sselect)
		if (!Sselect) throw Error('课程格式不正确');

		var section = ctx.query.section || ctx.request.body.section;
		if (!section) throw Error('章节格式不正确');

		var mark = ctx.query.mark || ctx.request.body.mark;
		var annex = ctx.query.wenjian || ctx.request.body.wenjian;
		var fileName = ctx.query.fileName || ctx.request.body.fileName;

		var enddate = ctx.query.enddate || ctx.request.body.enddate;

		var day = ((enddate.substring(5, 7) - 0) - (creatdate.substring(5, 7) - 0)) * 30;
		if (!enddate) throw Error('截止时间格式不正确');

		if ((enddate.substring(0, 4) - 0) < (creatdate.substring(0, 4) - 0)) throw Error('截止时间不可小于当前时间');

		else if ((enddate.substring(5, 7) - 0) < (creatdate.substring(5, 7) - 0)) throw Error('截止时间不可小于当前时间');

		else if ((enddate.substring(8, 10) - 0 + (day - 0)) < (creatdate.substring(8, 10) - 0)) throw Error('截止时间不可小于当前时间');


		if ((enddate.substring(8, 10) - 0) == (creatdate.substring(8, 10) - 0)) throw Error('请至少给出一天时间给学生作答');

		var row = yield _ctnu([_Mysql.conn, 'query'], "select cid from course_info where name='" + Sselect + "';");
		console.log(">>>>>rowcid", row)
		var cid = row[0].cid;
		var parament = [title, content, cid, section, mark, annex, enddate, fileName, wid];

		var sqlstr = "UPDATE work_info SET title=?,content=?,cid=?,section=?,mark=?,annex=?,enddate=?,filename=? WHERE wid=?";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		if (rows.changedRows == 0) throw Error('作业更新失败');
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//教师作业列表接口  提交userid   返回该教师用户的所有作业
_rotr.apis.worklist = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var sqlstr = "select * from work_info where userid = '" + userid + "';";
		var dat = {};
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);

		console.log(">>>>", rows);
		ctx.body = rows;
		return ctx;
	});
	return co;
};

//学生作业列表接口，提交userid  返回该学生用户的所有作业的wid enddate title name课程编号
_rotr.apis.Sworklist = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var id = ctx.query.id || ctx.request.body.id;
		var sqlstr = '';
		if (id == 1) {
			sqlstr = "SELECT s.wid,w.enddate,w.title,c.`name` FROM sw_info s LEFT JOIN work_info w ON s.wid=w.wid LEFT JOIN course_info c ON w.cid=c.cid WHERE s.userid=" + userid + " and answer IS NULL ORDER BY s.serianumber desc;";

		} else if (id == 2) {
			sqlstr = "SELECT s.wid,w.enddate,w.title,c.`name` FROM sw_info s LEFT JOIN work_info w ON s.wid=w.wid LEFT JOIN course_info c ON w.cid=c.cid WHERE s.userid=" + userid + " and answer IS NOT NULL ORDER BY s.serianumber desc;";
		} else {
			sqlstr = "SELECT s.wid,w.enddate,w.title,c.`name` FROM sw_info s LEFT JOIN work_info w ON s.wid=w.wid LEFT JOIN course_info c ON w.cid=c.cid WHERE s.userid=" + userid + " ORDER BY s.serianumber desc;";
		}

		var dat = {};
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		console.log(">>>", rows);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//仓库作业列表接口，返回所有老师布置的作业
_rotr.apis.hwres = function () {
	var ctx = this;
	var co = $co(function* () {
		var sqlstr = "SELECT w.wid,w.title,c.`name` as cname,u.`nick` as uname,w.creatdate FROM work_info w LEFT JOIN course_info c ON w.cid=c.cid LEFT JOIN user_info u ON w.userid=u.userid order by creatdate desc";
		var dat = {};
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows) Error("找不到作业");
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};
//
_rotr.apis.hwrespage = function () {
	var ctx = this;
	var co = $co(function* () {
		var page = ctx.query.page || ctx.request.body.page;
		var sqlstr = "SELECT COUNT(*) as number FROM work_info";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		var changdu = parseInt(rows[0]['number']);


		var last = 10 * page;


		var sqlstr1 = "SELECT w.wid,w.title,c.`name` as cname,u.`nick` as uname,w.creatdate FROM work_info w LEFT JOIN course_info c ON w.cid=c.cid LEFT JOIN user_info u ON w.userid=u.userid order by creatdate desc LIMIT 0," + last
		var rows1 = yield _ctnu([_Mysql.conn, 'query'], sqlstr1);

		var dat = {
			changdu: changdu,
			rows: rows1
		}

		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};


//role判断接口  提交userid  返回该用户的身份
_rotr.apis.role = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var nick = ctx.query.nick || ctx.request.body.nick;
		var sqlstr = "SELECT r.name FROM user_info u LEFT JOIN role r ON u.role=r.role WHERE userid=" + userid + ";";
		var dat = {};
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (rows.length == 0) throw Error("找不到用户");
		console.log(">>>>rows", rows[0].name);
		dat.name = rows[0].name;
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};



//公共作业详情接口  提交wid  返回该作业的详情
_rotr.apis.kuWorkDetail = function () {
	var ctx = this;
	var co = $co(function* () {
		var wid = ctx.query.wid || ctx.request.body.wid;
		if (!wid) throw Error('作业编号错误');
		var sqlstr = "SELECT wid,filename, w.userid userid,title,content,annex,mark,c.`name` as cname,section,enddate,creatdate,u.`nick` as xname FROM work_info w LEFT JOIN course_info c on w.cid=c.cid LEFT JOIN user_info u ON w.userid=u.userid  where wid = " + wid + ";";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows || rows.length == 0) throw Error("作业编号错误");
		console.log(">>>>", rows);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//学生作业情况接口，提交wid,userid, 返回该作业的情况，scorce type answer userid
_rotr.apis.SWorkDetail = function () {
	var ctx = this;
	var co = $co(function* () {
		var wid = ctx.query.wid || ctx.request.body.wid;
		var userid = ctx.query.userid || ctx.request.body.userid;
		var sqlstr = "SELECT * FROM sw_info WHERE wid=? AND userid=?;";
		var parament = [wid, userid];
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//学生提交作业接口，提交serianumber流水号 answer wenjian地址
_rotr.apis.updateSwork = function () {
	var ctx = this;
	var co = $co(function* () {
		var serianumber = ctx.query.serianumber || ctx.request.body.serianumber;
		var answer = ctx.query.answer || ctx.request.body.answer;
		if (!answer) throw Error('答案不可为空')
		var annex = ctx.query.wenjian || ctx.request.body.wenjian;
		var update = ctx.query.update || ctx.request.body.update;
		var wid = ctx.query.wid || ctx.request.body.wid;
		var filename = ctx.query.fileName || ctx.request.body.fileName;

		var row = yield _ctnu([_Mysql.conn, 'query'], 'SELECT enddate FROM work_info where wid=' + wid);

		var enddate = row[0].enddate;

		console.log('>>>shijiancha', update, enddate);
		var day = ((update.substring(5, 7) - 0) - (enddate.substring(5, 7) - 0)) * 30;

		if ((update.substring(0, 4) - 0) > (enddate.substring(0, 4) - 0)) throw Error('已过截至提交时间');

		else if ((update.substring(5, 7) - 0) > (enddate.substring(5, 7) - 0)) throw Error('已过截至提交时间');

		else if ((update.substring(8, 10) - 0 + (day - 0)) > (enddate.substring(8, 10) - 0)) throw Error('已过截至提交时间');



		var parament = [answer, annex, update, filename, serianumber];
		console.log(">>>>>date12", parament);
		var sqlstr = "UPDATE sw_info SET answer=?,annex=?,updates=?,filename=? WHERE serianumber=?";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		console.log(">>>update", rows);
		if (rows.changedRows == 0) throw Error('提交信息未作变更，提交失败');
		var dat = {};
		dat.user = rows[0];
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};

//获取学生提交的作业信息，提交wid，返回该作业的提交情况
_rotr.apis.getStuWork = function () {
	var ctx = this;
	var co = $co(function* () {
		var wid = ctx.query.wid || ctx.request.body.wid;
		if (!wid) throw Error("请提交wid");
		var sqlstr = "select w.wid,u.userid,nick,w.title,s.cretdate,s.serianumber,score from (select userid,s.wid,cretdate,serianumber,score from sw_info s where wid=" + wid + " and answer is not null) s ,user_info u,work_info w where u.userid=s.userid and w.wid=s.wid";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		console.log(rows);
		if (!rows) Error("找不到这项作业！");
		var dat = {};
		dat.user = rows[0];
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//获取学生已提交的作业信息，提交学生领取作业流水号，返回作业信息
_rotr.apis.getWorkDet = function () {
	var ctx = this;
	var co = $co(function* () {
		var serianumber = ctx.query.serianumber || ctx.request.body.serianumber;
		var sqlstr = "select w.wid,u.userid,nick,title,creatdate,answer,a.annex,a.filename,score,tadvice from user_info u,work_info w,(select answer,annex,score,tadvice,filename from sw_info where serianumber = " + serianumber + ") a where u.userid in (select userid from sw_info where serianumber = " + serianumber + ") and w.wid in (select wid from sw_info where serianumber = " + serianumber + ") ";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		if (!rows) Error("找不到用户");
		var dat = {};
		dat.user = rows[0];
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//学生领取作业接口，提交userid wid，返回是否领取成功信息
_rotr.apis.add = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var wid = ctx.query.wid || ctx.request.body.wid;
		var parament = [wid, userid];
		var sqlstr = "select * from  sw_info where wid=? and userid=?";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		console.log(">>", rows);
		if (rows.length !== 0) throw Error("你已经领取过该项作业，可以去提交啦");
		else {
			sqlstr = "insert into sw_info(wid,userid) values(?,?)";
			rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		}
		var check = rows.affectedRows;
		ctx.body = __newMsg(1, 'ok', check);
		return ctx;
	});
	return co;
};

//将教师的评分和评价插入到相应的字段中，提交作业流水号、分数、评价
_rotr.apis.saveComment = function () {
	var ctx = this;
	var co = $co(function* () {
		var serianumber = ctx.query.serianumber || ctx.request.body.serianumber;
		var userid = ctx.query.userid || ctx.request.body.userid;
		var score = ctx.query.score || ctx.request.body.score;
		if (!score || score == null || score > 100 || score < 0) throw Error("分数格式错误！");
		var comment = ctx.query.comment || ctx.request.body.comment;
		var str = "SELECT * FROM sw_info s LEFT JOIN work_info w ON s.wid=w.wid WHERE w.userid=" + userid + " AND serianumber=" + serianumber + ";";
		var row = yield _ctnu([_Mysql.conn, 'query'], str);
		if (row.length == 0) throw Error('您无权批改此作业');
		var parameter = [score, comment, serianumber];
		var sqlstr = "update sw_info set score = ?,tadvice=? where serianumber =?";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parameter);
		if (rows.changedRows == 0) throw Error("批改失败！");
		var dat = {};
		dat.user = rows[0];
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};





//用户身份赋予接口，提交aduserid管理员id userid 用户id roleid 角色id
_rotr.apis.giveRole = function () {
	var ctx = this;
	var co = $co(function* () {
		var aduserid = ctx.query.aduserid || ctx.request.body.aduserid;
		var userid = ctx.query.userid || ctx.request.body.userid;
		if (!userid) throw Error('请输入用户id');
		var roleid = ctx.query.roleid || ctx.request.body.roleid;

		var str = "SELECT * FROM user_info WHERE userid=" + aduserid + " AND role=4";
		var row = yield _ctnu([_Mysql.conn, "query"], str);
		if (row.length == 0) throw Error("您的权限不够！");


		var sqlstr = "UPDATE user_info SET role=" + roleid + " WHERE userid=" + userid + ";";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		console.log(">>>update", rows);
		if (rows.changedRows == 0) throw Error('变更失败！');
		var dat = {};
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};


//管理员添加公告
_rotr.apis.addNotice = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var content = ctx.query.content || ctx.request.body.content;
		var creatdate = ctx.query.creatdate || ctx.request.body.creatdate;
		if (!content) throw Error('公告内容格式不正确！');
		var str = "SELECT * FROM user_info WHERE userid=" + userid + " AND role=3 or role=4";
		var row = yield _ctnu([_Mysql.conn, "query"], str);
		if (row.length == 0) throw Error("您的权限不够！");

		var sqlstr = "insert into notice(content,userid,creatdate) values('" + content + "'," + userid + ",'" + creatdate + "')";
		var rows = yield _ctnu([_Mysql.conn, "query"], sqlstr);
		var check = rows.affectedRows;
		ctx.body = __newMsg(1, 'ok', check);
		return ctx;
	});
	return co;
};

//获取数据库中的公告和信息
_rotr.apis.getNotice = function () {
	var ctx = this;
	var co = $co(function* () {
		var content = ctx.query.content;
		var sqlstr = "select n.*,u.nick from notice n ,user_info u where n.userid=u.userid order by nid desc";
		var rows = yield _ctnu([_Mysql.conn, "query"], sqlstr);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};

//获取数据库中的公告和信息
_rotr.apis.getDiscuss = function () {
	var ctx = this;
	var co = $co(function* () {
		var sqlstr = "select c.content,c.chatid,u.nick from chat_info c,user_info u where c.userid=u.userid order by chatid DESC";
		var rows = yield _ctnu([_Mysql.conn, "query"], sqlstr);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};


//删除数据库中的讨论
_rotr.apis.delDis = function () {
	var ctx = this;
	var co = $co(function* () {
		var chatid = ctx.query.chatid || ctx.request.body.chatid;
		var sqlstr = "delete from chat_info where chatid=" + chatid + "";
		var rows = yield _ctnu([_Mysql.conn, "query"], sqlstr);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};


//首页获取作业信息
_rotr.apis.indexGetWork = function () {
	var ctx = this;
	var co = $co(function* () {
		var sqlstr = "select w.wid,w.title,u.nick,number from work_info w LEFT JOIN user_info u ON w.userid=u.userid LEFT JOIN(SELECT wid,COUNT(wid) number FROM sw_info s where s.answer IS not null GROUP BY wid) x ON w.wid=x.wid";
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
		//        console.log(rows);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};


//获取数据库中的老师总数
_rotr.apis.getNumber = function () {
	var ctx = this;
	var co = $co(function* () {
		var tNumber = yield _ctnu([_Mysql.conn, "query"], "select count(*) as tNumber from user_info where role=2");


		var cNumber = yield _ctnu([_Mysql.conn, "query"], "select count(*) as cNumber from chat_info");


		var sNumber = yield _ctnu([_Mysql.conn, "query"], "select count(*) as sNumber from user_info where role=1");


		var wNumber = yield _ctnu([_Mysql.conn, "query"], "select count(*) as wNumber from work_info");

		var dat = [
			tNumber[0],
			cNumber[0],
			sNumber[0],
			wNumber[0]
		]
		ctx.body = __newMsg(1, 'ok', dat);
		return ctx;
	});
	return co;
};
//存储讨论赞的数量，提交wid,userid,count
_rotr.apis.thimbs = function () {
	var ctx = this;
	var co = $co(function* () {
		//        var userid = ctx.query.userid || ctx.request.body.userid;
		//        var wid = ctx.query.wid || ctx.request.body.wid;
		var thimbs = ctx.query.thimbs || ctx.request.body.thimbs;
		var chatid = ctx.query.chatid || ctx.request.body.chatid;
		var sqlstr = 'update chat_info set timbs = ? where chatid=? ';
		var parament = [thimbs, chatid];
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		ctx.body = __newMsg(1, 'ok', rows);

		return ctx;
	});
	return co;
};

//管理员作业管理页面，提交作业wid
_rotr.apis.delete = function () {
	var ctx = this;
	var co = $co(function* () {
		if ((ctx.query.wid || ctx.request.body.wid) != null) {
			var wid = ctx.query.wid || ctx.request.body.wid;
			var sqlstr1 = "delete from sw_info where wid = " + wid + "";
			var sqlstr2 = "DELETE from work_info where wid=" + wid + "";
			var sqlstr3 = "DELETE from chat_info where wid=" + wid + "";
			var rows1 = yield _ctnu([_Mysql.conn, 'query'], sqlstr1);
			var rows3 = yield _ctnu([_Mysql.conn, 'query'], sqlstr3);
			var rows2 = yield _ctnu([_Mysql.conn, 'query'], sqlstr2);
			if (rows1.affectedRows != 1 && rows2.affectedRows != 1 && rows3.affectedRows != 1) throw Error("删除失败！");
			var dat = {};
			//        dat.user = rows[0];
			ctx.body = __newMsg(1, 'ok', rows1);
			return ctx;
		} else {
			var chatid = ctx.query.chatid || ctx.request.body.chatid;
			var sqlstr = "DELETE from chat_info where chatid=" + chatid + "";
			var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr);
			if (rows.affectedRows != 1) throw Error("删除失败！");
			var dat = {};
			//        dat.user = rows[0];
			ctx.body = __newMsg(1, 'ok', rows);
			return ctx;
		}
	});
	return co;
};


//获取发布的评论内容，并插入Chat数据表
_rotr.apis.ChatContent = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var creatdate = ctx.query.creatdate || ctx.request.body.creatdate;
		var wid = ctx.query.wid || ctx.request.body.wid;
		var content = ctx.query.content || ctx.request.body.content;
		var sqlstr = 'insert into chat_info(wid,userid,content,creatdate) values(?,?,?,?);';
		var parament = [wid, userid, content, creatdate]; //userid,评论，wid
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		console.log('>>>>', rows);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};
var db = [];

//获取讨论区发布内容
_rotr.apis.openChat = function () {
	var ctx = this;
	var co = $co(function* () {
		var userid = ctx.query.userid || ctx.request.body.userid;
		var wid = ctx.query.wid || ctx.request.body.wid;
		var sqlstr = 'select * from chat_info INNER JOIN' +
			'(select userid userid1,nick from user_info) A1 where ' +
			' chat_info.userid=A1.userid1 and wid=? order by creatdate desc;';
		//var parament=[userid,content,wid];//userid,评论，wid
		var parament = [wid]; //wid
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		console.log('>>>>', rows);
		ctx.body = __newMsg(1, 'ok', rows);
		return ctx;
	});
	return co;
};



//存储讨论赞的数量，提交wid,userid,count
_rotr.apis.thimbs = function () {
	var ctx = this;
	var co = $co(function* () {
		//        var userid = ctx.query.userid || ctx.request.body.userid;
		//        var wid = ctx.query.wid || ctx.request.body.wid;
		var thimbs = ctx.query.thimbs || ctx.request.body.thimbs;
		var chatid = ctx.query.chatid || ctx.request.body.chatid;
		var sqlstr = 'update chat_info set timbs = ? where chatid=?';
		var parament = [thimbs, chatid];
		var rows = yield _ctnu([_Mysql.conn, 'query'], sqlstr, parament);
		ctx.body = __newMsg(1, 'ok', rows);
		//        ctx.body = parament;

		return ctx;
	});
	return co;
};








//导出模块
module.exports = _rotr;
