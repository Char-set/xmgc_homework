app.controller('datacontroller', function ($scope) {
	var str = window.location.search;
	var dat = {
		wid: str.substring(5),
		userid: userid
	}
	console.log(">>>dat", dat)
	$.get('/homework/api/kuWorkDetail', dat, function (res) {
		console.log(">>>", res.data[0])
		res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
		res.data[0].enddate = res.data[0].enddate.substring(0, 10);
		console.log(">>>>>>作业", res[0]);
		if (res.data[0].annex == '.....' || res.data[0].annex == '') {
			$('#annex').css({
				display: 'none'
			})
		}
		$scope.$apply(function () {
			$scope.workinfo = res.data[0];
		})

	})
})
