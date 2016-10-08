app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});
app.controller('SMyWorkController', function ($scope) {
	var userid;
	$.post('/../../start/api/getMyInfo', function (res) {
		userid = res.data['id'];
		var dat = {
			userid: userid,
			id: 1
		}
		$.post('/homework/api/Sworklist', dat, function (res) {
			console.log(">>>", res.data);
			$scope.$apply(function () {
				for (key in res.data) {
					//				console.log(">>>", res.data[key].enddate.substring(0, 10))
					res.data[key].enddate = res.data[key].enddate.substring(5, 10);
				}
				$scope.dat = res.data;
				console.log(">>>", res.data);
			})
		})
	})
	$scope.chose = function (id) {
		var date = {
			userid: userid,
			id: id
		}
		console.log("ceshi>>>>", date);
		$.post('/homework/api/Sworklist', date, function (res) {
			console.log(">>>", res.data);
			$scope.$apply(function () {
				for (key in res.data) {
					//				console.log(">>>", res.data[key].enddate.substring(0, 10))
					res.data[key].enddate = res.data[key].enddate.substring(5, 10);
				}
				$scope.dat = res.data;
				console.log(">>>", res.data);
			})
		})
	}
})
