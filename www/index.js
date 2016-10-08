var app = angular.module("app", []);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
app.run(function ($rootScope) {
	$rootScope.navurl = 'teacherPage/controller/nav.html';
	$rootScope.alerturl = 'teacherPage/controller/alert.html';

});
app.controller("kzq1", function ($scope) {
	$.post("/homework/api/indexGetWork", function (res) {
		//		console.log(">>>", res.data)
		var shuzu = [];
		for (var key in res.data) {
			shuzu.push(res.data[key]);
		}
		var return_array = new Array();
		for (var i = 0; i < 4; i++) {
			if (shuzu.length > 0) {
				var arrIndex = Math.floor(Math.random() * shuzu.length);
				return_array[i] = shuzu[arrIndex];
				shuzu.slice(arrIndex, 1);
			} else {
				break;
			}
		}
		console.log(">>>>>return_array", return_array);
		$scope.$apply(function () {

			var count;
			for (key in return_array) {
				if (return_array[key]["number"] == null) {
					return_array[key]["number"] = 0;
				}
			}
			console.log(return_array);
			$scope.indexWork = return_array;
		});

	});
});

app.controller("rolecontroller", function ($scope) {
	$.post('/../../start/api/getMyInfo', function (res) {
		console.log('>>>', res.data);
		if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
			alert("没找到您的登录信息，请重新登陆或注册.");
			window.location.href = 'http://m.xmgc360.com/start/web/account/'
		}
		userid = res.data['id'];
		nick = res.data['nick'];
		dat = {
			userid: res.data['id'],
			nick: res.data['nick']
		}
		$scope.$apply(function () {
			$scope.name = nick;
		})
		console.log(">>>", dat);
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
	$scope.get = function () {
		var dat = {
			wid: $('#wid').val()
		}
		console.log(">>>>wid", dat);
		$.post('/homework/api/kuWorkDetail', dat, function (res) {
			console.log(">>>>>", res)
			if (res.code == 1) {
				setTimeout(function () {
					window.location.href = 'teacherPage/CWorkResDetail.html?wid=' + dat.wid;
				}, 300);
			}
			//	发布失败，显示错误信息
			else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		})

	}
});
