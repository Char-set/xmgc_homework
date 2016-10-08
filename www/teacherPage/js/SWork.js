app.controller('datacontroller', function ($scope, $rootScope) {
	$.post('/../../start/api/getMyInfo', function (res) {
		$rootScope.userid = res.data['id'];
		var str = window.location.search;
		var dat = {
			wid: str.substring(5),
			userid: $rootScope.userid
		}
		console.log(">>>dat", dat)
		$.get('/homework/api/kuWorkDetail', dat, function (res) {

			res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
			res.data[0].enddate = res.data[0].enddate.substring(0, 10);
			console.log(">>>>>>作业", res.data[0]);
			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			$scope.$apply(function () {
				$scope.workinfo = res.data[0];
			})
			$.get('/homework/api/SWorkDetail', dat, function (res) {
				console.log(">>>>41", res.data);
				if (res.data.answer !== null) {
					$("#up").html('已提交');
				}
				if (res.data.score !== null) {
					$("#check").html('已批改');
				}
				$scope.$apply(function () {
					$scope.sworkinfo = res.data
				})
			})
		})
	})

})
