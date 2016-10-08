/**
 * Created by asus on 2016/9/10.
 */
app.controller('kzq1', function ($rootScope, $scope) {
	$scope.url1 = "SWork.html";
	$scope.url2 = "SWorkEdit.html";
	$scope.url3 = "TChat.html";
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
});

function change(id) {
	$(".user_tab").css({
		display: 'none'
	});
	$("#" + id + "").css({
		display: 'block'
	});
}
