//	附件上传
$('#shangchuan').click(function () {
	_fns.uploadFile2($('#shangchuan'), function (f) {
		console.log('>>>>before:', f);
	}, function (f) {
		console.log('>>>>progressAAAA:', f);
		$('#wancheng').css('width', f.percent + '%');
		$('#wancheng').html(f.percent + '%');
		console.log('>>>>>AAAA');
	}, function (f) {
		console.log('>>>>successXXXX:', f);
		$('#wenjian').html(f.url);
		$('#wenjian').attr('href', f.url);
	});
});
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});
app.controller('class', function ($scope) {
	$.post('/homework/api/kecheng', function (res) {
		$scope.$apply(function () {
			$scope.classes = res;
		})
	})
});
app.controller('text', function ($scope, $rootScope) {
	$scope.check = function () {
		var myDate = new Date();
		var mouth = '';
		var day = '';
		var hours = '';
		var minutes = '';
		if (myDate.getMonth() + 1 < 10) {
			mouth = "0";
		}
		if (myDate.getDate() < 10) {
			day = "0";
		}
		if (myDate.getHours() < 10) {
			hours = "0";
		}
		if (myDate.getMinutes() < 10) {
			minutes = "0";
		}
		var creatdate = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + hours + myDate.getHours() + ":" + minutes + myDate.getMinutes();
		var dat = {
			useid: $rootScope.userid,
			nick: $rootScope.nick,
			title: $('#title').val(),
			content: $('#content').val(),
			Sselect: $('#Sselect').val(),
			section: $('#section').val(),
			mark: $('#mark').val(),
			wenjian: $('#wenjian').html(),
			time: $('#time').val(),
			creatdate: creatdate
		};
		console.log(">>>>时间", dat.time.substring(8, 10), creatdate.substring(8, 10));
		$.post('/homework/api/addwork', dat, function (res) {
			console.log(">>>>res", res.data);
			//	发布成功，提示用户并跳转
			if (res.code == 1) {
				$scope.$apply(function () {
					$scope.text = '作业发布成功,作业编号为：' + res.data
				});
				boxshow();
				setTimeout(function () {
					window.location.href = 'TMyWork.html';
				}, 1500);
			}
			//	发布失败，显示错误信息
			else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		})
	};
});
