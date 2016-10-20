console.log("TWorkDetail.js is loading...");
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});

app.controller('kzq1', function ($rootScope, $scope) {
	$scope.url1 = "TSWorkDetail.html";
	$scope.url2 = "TStuWork.html";
	$scope.url3 = "TChat.html";
});

function change(id) {
	$(".user_tab").css({
		display: 'none'
	});
	$("#" + id + "").css({
		display: 'block'
	});
}
$(function () {
//	$("#bg").css({
			//		width: screen.availWidth,
			//		height: screen.availHeight
			//	})
})
