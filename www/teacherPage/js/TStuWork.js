app.controller("studentWork", function ($rootScope, $scope) {
	var str = window.location.search;
	var dat = {
		wid: str.substring(5)
	};
	$.post('/homework/api/getStuWork', dat, function (res) {
		var date = res["data"]
		for (var key in date) {
			if (date[key].score == null) {
				date[key].text = '批改'
			} else {
				date[key].text = '已批改'
			}
			date[key].cretdate = date[key].cretdate.substring(0, 10);
		}
		console.log(">>>>>afte", date);
		//		$scope.$apply(function () {
		$scope.workinfo = date;
		//		});

	});

});
