app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
});
app.controller('class', function ($scope) {
	$.post('/homework/api/kecheng', function (res) {
		//		$scope.$apply(function () {
		$scope.classes = res;
		//		})
	})
});
app.controller('text', function ($scope, $rootScope) {
	$scope.file = '';
	$('#shangchuan').click(function () {
		_fns.uploadFile2(2, $('#shangchuan'), function (f) {}, function (f) {
			$('#wancheng').css('width', f.percent + '%');
			$('#wancheng').html(f.percent + '%');
		}, function (f) {
			$scope.$apply(function () {
				$scope.file = f;
				$scope.size = Number(f.size / 1048576).toFixed(2);

			});
			var url0 = encodeURIComponent(f.url);
			var url = "http://api.idocv.com/view/url?url=" + url0 + "&name=" + f.name + "        ";
			$('#wenjian').html(f.name);
			$('#view').attr('src', url);
			$('#jindu').css({
				display: 'none'
			});
			$('#wenjian,#review,#size').css({
				display: 'inline-block'
			});
		});
	});

	$scope.review = function () {
		console.log(">>>>>>f", $scope.file);
		var size = $scope.file.size / 1048576;
		console.log(">>>>>size", size);
		if (size > 1) {
			$scope.text = "文件过大，无法预览！";
			boxshow();
		} else {
			$('#myModal').modal()
		}

	}

	$scope.check = function () {
		var flag = 0;
		if (!$('#title').val()) {
			$scope.text = '请输入标题';
			flag = 1;
		} else if (!$('#content').val()) {
			$scope.text = '请输入作业内容';
			flag = 1;
		} else if (!$('#Sselect').val()) {
			$scope.text = '请选择课程';
			flag = 1;
		} else if (!$('#section').val()) {
			$scope.text = '请选择章节';
			flag = 1;
		} else if ($scope.size > 1) {
			$scope.text = '文件过大';
			flag = 1;
		}

		if (flag) {
			//			$scope.$apply();
			boxshow();
			return 0;
		}

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
			wenjian: $scope.file.url,
			time: $('#time').val(),
			creatdate: creatdate,
			fileName: $('#wenjian').html()
		};
		console.log("kehcng", dat)
		console.log(">>>>时间", dat.time.substring(8, 10), creatdate.substring(8, 10));
		$.post('/homework/api/addwork', dat, function (res) {

			//	发布成功，提示用户并跳转
			if (res.code == 1) {
				//				$scope.$apply(function () {
				$scope.text = '作业发布成功,作业编号为：' + res.data
				$scope.$apply();
				//				});
				boxshow();
				setTimeout(function () {
					window.location.href = 'TMyWork.html';
				}, 1500);
			}
			//	发布失败，显示错误信息
			else {
				//				$scope.$apply(function () {
				$scope.text = res.text
					//				});
				$scope.$apply();
				boxshow();
			}
		})
	};
});
