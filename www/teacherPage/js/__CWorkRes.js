 app.run(function ($rootScope) {
 	$rootScope.navurl = 'controller/nav.html';
 	$rootScope.alerturl = 'controller/alert.html';

 });
 app.controller('hwrescontroller', function ($scope) {

 	// 	$.post('/homework/api/hwres', function (res) {
 	// 		console.log(">>>>dsd>", res.data.length);
 	// 		// 		$scope.$apply(function () {
 	// 		for (key in res.data) {
 	// 			//				console.log(">>>", res.data[key].enddate.substring(0, 10))
 	// 			res.data[key].creatdate = res.data[key].creatdate.substring(0, 10);
 	// 		}
 	// 		$scope.dat = res.data;
 	//
 	//
 	// 		var length = [];
 	// 		for (i = 0; i < parseInt(res.data.length / 10) + 1; i++) {
 	// 			length[i] = i;
 	// 		}
 	// 		console.log(">>>", length)
 	// 		$scope.Length = length;
 	//
 	// 		// 		})
 	// 	});
 	var dat = {
 		page: 1
 	}
 	$.get('/homework/api/hwrespage', dat, function (res) {
 		console.log(">>>>>shuju", res.data.changdu);
 		for (key in res.data.rows) {
 			//				console.log(">>>", res.data[key].enddate.substring(0, 10))
 			res.data.rows[key].creatdate = res.data.rows[key].creatdate.substring(0, 10);
 		}
 		$scope.dat = res.data.rows;
 		var length = [];
 		for (i = 0; i < parseInt(res.data.changdu / 10) + 1; i++) {
 			length[i] = i;
 		}
 		console.log(">>>", length)
 		$scope.Length = length;
 	})



 	var mySwiper = new Swiper('.swiper-container', {
 		direction: 'horizontal',
 		observer: true,
 		pagination: '.swiper-pagination',
 		paginationType: 'fraction',
 		onSlideChangeEnd: function (swiper) {
 			console.log("第", mySwiper.activeIndex + 1, "页");
 			dat = {
 				page: mySwiper.activeIndex + 1
 			}
 			$.get('/homework/api/hwrespage', dat, function (res) {
 				for (key in res.data.rows) {
 					//				console.log(">>>", res.data[key].enddate.substring(0, 10))
 					res.data.rows[key].creatdate = res.data.rows[key].creatdate.substring(0, 10);
 				}
 				$scope.dat = res.data.rows;
 				var length = [];
 				for (i = 0; i < parseInt(res.data.changdu / 10) + 1; i++) {
 					length[i] = i;
 				}
 				$scope.Length = length;
 				$scope.$apply();
 			})

 		}
 	})
 })
