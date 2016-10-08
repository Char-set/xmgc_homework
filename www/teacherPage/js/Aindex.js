$(function () {
	$("#clear").click(function () {
		$("#noticecontent").empty();
	});

	$("#quit").click(function () {
		window.close()
	});

});

app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
	//老师数量
	$.post("/homework/api/getteaNumber", function (res) {
		$rootScope.$apply(function () {
			$rootScope.number1 = res[0]["count(*)"];
			console.log(res);
		});
	});

	//讨论区条数
	$.post("/homework/api/getnoticeNumber", function (res) {
		$rootScope.$apply(function () {
			$rootScope.number2 = res[0]["count(*)"];
			console.log(res);
		});
	});

	//学生数量
	$.post("/homework/api/getstuNumber", function (res) {
		$rootScope.$apply(function () {
			$rootScope.number3 = res[0]["count(*)"];
			console.log(res);
		});
	});

	//作业数量
	$.post("/homework/api/getworkNumber", function (res) {
		$rootScope.$apply(function () {
			$rootScope.number4 = res[0]["count(*)"];
			console.log(res);
		});
	});
});
app.controller('adminController', function ($scope, $rootScope) {

	$scope.giveRole = function () {
		dat = {
			aduserid: $rootScope.userid,
			userid: $("#id").val(),
			roleid: $("#role").val()
		}
		console.log(">>>>role", dat);
		$.post('/homework/api/giveRole', dat, function (res) {
			console.log(">>>>", res);
			if (res.code == 1) {
				$scope.$apply(function () {
					$scope.text = '身份赋予成功'
				});
				boxshow();
			} else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		})
	};
	$scope.check = function () {
		var myDate = new Date();
		var mouth = '';
		var day = '';
		if (myDate.getMonth() < 10) {
			mouth = "0";
		}
		if (myDate.getDate() < 10) {
			day = "0";
		}
		var creatdate = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();
		var dat = {
			creatdate: creatdate,
			userid: $rootScope.userid,
			content: $("#noticecontent").html()
		}
		console.log(">>>", dat)
		$.get("/homework/api/addNotice", dat, function (res) {
			console.log(res);
			if (res.code == 1) {
				$scope.$apply(function () {
					$scope.text = '公告发布成功'
				});
				boxshow();
			} else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		});

	};
})
