app.controller('bodyController', function ($scope) {
	var str = window.location.search;
	var dat = {
		wid: str.substring(5)
	}
	$scope.jump = function () {
		window.location.href = 'CWorkResDetail.html?wid=' + str.substring(5)
	}
	$.get('/homework/api/kuWorkDetail', dat, function (res) {
		console.log(">>>>>>rows", res.data[0]);
		res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
		res.data[0].enddate = res.data[0].enddate.substring(0, 10);
		$scope.workinfo = res.data[0];
		var url0 = encodeURIComponent(res.data[0].annex);
		var url = "http://api.idocv.com/view/url?url=" + url0 + "&name=" + res.data[0].filename + "        ";
		$('#view').attr('src', url);

	});
	$.get('/homework/api/openChat', dat, function (res) {
		console.log("pinglun:", res.data[0]);
		$scope.pinglun = res.data;
		$scope.$apply();
	});

})
