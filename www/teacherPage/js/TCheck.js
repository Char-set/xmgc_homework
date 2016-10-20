app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});
app.controller("checkWork", function ($rootScope, $scope) {
	var str = window.location.search;
	var dat = {
		serianumber: str.substring(13)
	}

	console.log(">>>>>>dat", dat);
	$.post("/homework/api/getWorkDet", dat, function (res) {
		res["data"][0].creatdate = res["data"][0].creatdate.substring(0, 10);
		var Wid = res["data"][0].wid;
		console.log(">>>res", res["data"][0])
			//		$scope.$apply(function () {
		$scope.workinfo = res["data"][0];

		$scope.saveIt = function () {
				var sc = {
					userid: $rootScope.userid,
					serianumber: str.substring(13),
					score: $("#score").val(),
					comment: $("#comment").val()
				}
				console.log(">>>>>sc", sc);
				$.post("/homework/api/saveComment", sc, function (res) {
					console.log("insertInfo", res);
					if (res.code == 1) {
						$scope.$apply(function () {
							$scope.text = '批改成功'
						});
						boxshow();
						setTimeout(function () {
							window.location.href = 'TWorkDetail.html?wid=' + Wid;
						}, 1500);
					}
					//	发布失败，显示错误信息
					else {
						$scope.$apply(function () {
							$scope.text = res.text
						});
						boxshow();
					}
				});
			}
			//		});
		$scope.back = function () {
			window.history.back();
		}
	});
});
