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
	$.get("/homework/api/getNumber", function (res) {
		console.log("....", res.data);
		$rootScope.number = res.data;
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
		var hour = '';
		var minutes = '';
		if (myDate.getMonth() + 1 < 10) {
			mouth = "0";
		}
		if (myDate.getDate() < 10) {
			day = "0";
		}
		if (myDate.getHours() < 10) {
			hour = "0";
		}
		if (myDate.getMinutes() < 10) {
			minutes = "0";
		}
		var creatdate = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + hour + myDate.getHours() + ":" + minutes + myDate.getMinutes();
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
