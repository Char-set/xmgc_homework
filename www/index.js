var mySwiper = new Swiper('.swiper-container', {
	autoplay: 3000,
	speed: 1000,
	autoplayDisableOnInteraction: false,
})

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
		console.log(">>>", res.data)
		var shuzu = [];
		for (var key in res.data) {
			shuzu.push(res.data[key]);
		}
		var suiji = [];
		var return_array = [];
		var first = Math.floor(Math.random() * shuzu.length);
		suiji.push(first);
		return_array[0] = shuzu[first];
		$scope.refrash = function () {
			var suiji = [];
			var return_array = [];
			var first = Math.floor(Math.random() * shuzu.length);
			suiji.push(first);
			return_array[0] = shuzu[first];
			for (var i = 1; i < 4; i++) {
				if (shuzu.length > 0) {
					var arrIndex = Math.floor(Math.random() * shuzu.length);
					for (var j = 0; j < suiji.length; j++) {
						while (suiji[j] == arrIndex) {
							arrIndex = Math.floor(Math.random() * shuzu.length);
							console.log("suiji", arrIndex)
						}
					}
					suiji.push(arrIndex);
					return_array[i] = shuzu[arrIndex];
				} else {
					break;
				}
			}
			for (key in return_array) {
				if (return_array[key]["number"] == null) {
					return_array[key]["number"] = 0;
				}
			}
			$scope.indexWork = return_array;
		};
		for (var i = 1; i < 4; i++) {
			if (shuzu.length > 0) {
				var arrIndex = Math.floor(Math.random() * shuzu.length);
				for (var j = 0; j < suiji.length; j++) {
					while (suiji[j] == arrIndex) {
						arrIndex = Math.floor(Math.random() * shuzu.length);
						console.log("suiji", arrIndex)
					}
				}
				suiji.push(arrIndex);
				return_array[i] = shuzu[arrIndex];
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

$(function () {
	$("#giveUp").click(function () {
		$("#searchPage").animate({
			left: "100%"
		})
	});
	$('#search').click(function () {
		$('#searchPage').animate({
			left: 0
		})
	})
})

app.controller("searchPageController", function ($scope) {
	$scope.search = function () {
		var text = $("#searchInput").val();
		//		setTimeout(console.log("sousuo:", text), 2000);
		var dat = {
			value: $("#searchInput").val()
		};
		$.get('/homework/api/search', dat, function (res) {
			console.log("返回值：", res.data.work);
			var result = res.data.work;
			if (result.length == 0) {
				$("#noresult").show();
				$("#result").hide();
			} else {
				$("#noresult").hide();
				$("#result").show();
				$scope.searchResult = result;
			}
		})
	}
})
