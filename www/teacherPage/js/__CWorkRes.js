 app.run(function ($rootScope) {
 	$rootScope.navurl = 'controller/nav.html';
 	$rootScope.alerturl = 'controller/alert.html';

 });

 function shuju($scope, dat) {
 	$.get('/homework/api/hwrespage', dat, function (res) {
 		console.log(">>>>>shuju", res);
 		for (key in res.data.rows) {
 			res.data.rows[key].creatdate = res.data.rows[key].creatdate.substring(0, 10);
 		}
 		$scope.dat = res.data.rows;
 		var length = [];
 		for (i = 0; i < parseInt(res.data.changdu / 10) + 1; i++) {
 			length[i] = i;
 		}
 		console.log(">>>", length)
 		$scope.Length = length;
 		$scope.$apply();
 	});
 }

 app.controller('hwrescontroller', function ($scope) {
 	var date = {
 		Msg: null,
 		page: 1
 	}
 	shuju($scope, date);

 	$scope.search = function () {
 		console.log("双向", $scope.query);
 		date = {
 			Msg: $scope.query,
 			page: 1
 		}
 		shuju($scope, date);
 	}


 	var mySwiper = new Swiper('.swiper-container', {
 		direction: 'horizontal',
 		observer: true,
 		pagination: '.swiper-pagination',
 		paginationType: 'fraction',
 		onSlideChangeEnd: function (swiper) {
 			console.log("第", mySwiper.activeIndex + 1, "页", date.page);
 			console.log("双1向", $scope.query);
 			if (date.page < mySwiper.activeIndex + 1) {
 				date = {
 					Msg: $scope.query,
 					page: mySwiper.activeIndex + 1
 				}
 				shuju($scope, date);
 			}
 		}
 	})
 })
