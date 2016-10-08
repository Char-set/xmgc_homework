var app = angular.module('app', []);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});
