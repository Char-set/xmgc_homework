var app = angular.module('app', ["ui.bootstrap"]);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
var userid;
var nick;
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
	$.post('/../../start/api/getMyInfo', function (res) {
		if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
			alert("没找到您的登录信息，请重新登陆或注册.");
			window.location.href = 'http://m.xmgc360.com/start/web/account/'
		}
		userid = res.data['id'];
		$rootScope.userid = res.data['id'];
		$rootScope.nick = res.data['nick'];
		dat = {
			userid: $rootScope.userid,
			nick: $rootScope.nick
		}
		console.log(">>>checkjs", dat);
		$.post('/homework/api/adduser', dat, function (res) {
			console.log(">>>>adduser", res);
			$.post('/homework/api/role', dat, function (res) {
				console.log(">>>>", res.data['name']);
				var role = res.data['name'];
				if (role) {
					if (role == '学生') {
						$('.tea').css({
							display: 'none'
						});
					} else if (role == '教师') {
						$('.stu').css({
							display: 'none'
						});
					} else if (role == "管理员" || role == "超级管理员") {} else {
						$('.tea,.stu').css({
							display: 'none'
						});
					}
				} else {
					$('.tea,.stu').css({
						display: 'none'
					});
				}
			});
		})
	});
})

app.controller("rolecontroller", function ($scope, $rootScope) {


	//	dat = {
	//		userid: $rootScope.userid,
	//		nick: $rootScope.nick
	//	}
	//	console.log(">>>", dat);
	//	$.post('/homework/api/adduser', dat, function (res) {
	//		console.log(">>>>adduser", res);
	//		$.post('/homework/api/role', dat, function (res) {
	//			console.log(">>>>", res.data);
	//			var role = res.data['name'];
	//			if (role) {
	//				if (role == '学生') {
	//					$('.tea').css({
	//						display: 'none'
	//					});
	//				} else if (role == '教师') {
	//					$('.stu').css({
	//						display: 'none'
	//					});
	//				} else if (role == "管理员" || role == "超级管理员") {} else {
	//					$('.tea,.stu').css({
	//						display: 'none'
	//					});
	//				}
	//			} else {
	//				$('.tea,.stu').css({
	//					display: 'none'
	//				});
	//			}
	//		});
	//	})

});
