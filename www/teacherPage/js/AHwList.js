var app = angular.module("app", ["ui.bootstrap"]);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});

app.controller('WorkList', function ($scope) {
	$.post('/homework/api/indexGetWork', function (res) {
		console.log(">>>>", res.data);
		$scope.$apply(function () {
			$scope.workList = res["data"];
			$scope.filteredLists = [], $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 5;
			$scope.length = Math.ceil(res["data"].length / $scope.numPerPage) + "0";
			$scope.$watch('currentPage + numPerPage', function () {
				var begin = (($scope.currentPage - 1) * $scope.numPerPage),
					end = begin + $scope.numPerPage;
				$scope.filteredLists = $scope.workList.slice(begin, end);
			});
			$scope.delete = function (wid) {
				var dat = {
					wid: wid
				}
				console.log(">>>", dat);
				var a = confirm("您确定要删除吗？");
				if (a) {
					var a = $scope.filteredLists.splice(0, 1);
					console.log(">>>>", 2);
					$.post("/homework/api/delete", dat, function (res) {
						if (res.code == 1) {
							window.location.href = "AHwList.html";
						}
					});
				};
			}
		})
	})
	$scope.back = function () {
		window.history.back();
	}
})
