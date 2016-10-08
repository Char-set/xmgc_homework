console.log('index.js loading.');
var app = angular.module('app', []);
app.run(function ($rootScope) {
	$rootScope.navurl = 'teacherPage/controller/nav.html';
	$rootScope.alerturl = 'teacherPage/controller/alert.html';

});
app.controller('loginController', function ($scope) {
	$scope.login = function () {
		var pw = $('#password').val();
		var password = hex_md5(pw);
		console.log(">>>>", password);
		var dat = {
			id: $('#account').val(),
			pw: password
		};
		console.log(">>>", dat)
		$.post('/homework/api/login', dat, function (res) {
			console.log(">>>>", res.text);
			if (res.code == 1) {
				$scope.$apply(function () {
					$scope.text = '登入成功'
				});
				boxshow();
				setTimeout(function () {
					window.location.href = 'teacherPage/Aindex.html';
				}, 1500);
			}
			//
			else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		})
	}
})
