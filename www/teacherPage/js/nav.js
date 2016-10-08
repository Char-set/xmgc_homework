console.log('>>>>1222222');
app.controller('myc', function ($scope) {
		$.get('/../../start/api/getMyInfo', function (res) {
			$scope.$apply(function () {
				$scope.userinfo = {
					nick: res.data['nick']
				}
				console.log('>>>>12', res.data['nick']);
			})
		})
	})
	//	侧边栏样式，动画设置
$(function () {
	$('.height').css({
		height: screen.scrollHeight
	});
	$('#drawer').css({
		hight: screen.scrollHeight,
		width: screen.scrollWidth
	});
	$('#pull').click(function () {

		$('#drawer').css({
			display: 'block'
		});
		$('#drawer1').animate({
			left: 0
		}, 'slow')
	});
	$('#drawer,#drawer1').click(function () {
		$('#drawer').css({
			display: 'none'
		})
		$('#drawer1').animate({
			left: -500
		})

	});

});
