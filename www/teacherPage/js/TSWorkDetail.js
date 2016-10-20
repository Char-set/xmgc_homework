app.controller('datacontroller', function ($scope, $rootScope) {
	var str = window.location.search;
	var dat = {
		wid: str.substring(5),
		userid: userid
	}
	var wuserid;
	console.log(">>>dat", dat)
	$.get('/homework/api/kuWorkDetail', dat, function (res) {
		console.log(">>>作业数据", res.data[0])
		res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
		res.data[0].enddate = res.data[0].enddate.substring(0, 10);
		wuserid = res.data[0].userid;
		console.log(">>>>>>作业", res[0]);
		if (res.data[0].annex == '.....' || res.data[0].annex == '') {
			$('#annex').css({
				display: 'none'
			})
		}
//		$scope.$apply(function () {
			$scope.workinfo = res.data[0];
//		})
		$.post('/homework/api/kecheng', function (res) {
//			$scope.$apply(function () {
				$scope.classes = res;
//			})
		})
	})
	$scope.shangchuan = function () {
		_fns.uploadFile2($('#shangchuan'), function (f) {
			console.log('>>>>before:', f);
		}, function (f) {

		}, function (f) {
			console.log('>>>>successXXXX:', f);
			$('#wenjian').html(f.name);
			$('#wenjian').attr('href', f.url);
		});
	}
	$scope.update = function () {
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
		var date = {
			useid: $rootScope.userid,
			nick: $rootScope.nick,
			wid: str.substring(5),
			title: $('#title').val(),
			content: $('#content').val(),
			Sselect: $('#Sselect').val(),
			section: $('#section').val(),
			mark: $('#mark').val(),
			wenjian: $('#wenjian').attr('href'),
			enddate: $('#time').val(),
			creatdate: creatdate,
			fileName: $('#wenjian').html()
		};
		console.log('>>>dat', dat)
		$.post('/homework/api/updatework', date, function (res) {
			console.log(">>>>结果", res);
			if (res.code == 1) {
				$scope.$apply(function () {
					$rootScope.text = '作业更新成功！'
				});
				boxshow();
				setTimeout(function () {
					window.location.reload()
				}, 1500);
			}
			//	发布失败，显示错误信息
			else {
				$scope.$apply(function () {
					$rootScope.text = res.text
				});
				boxshow();
			}
		})
	};
	$scope.delete = function () {
		if (userid != wuserid) {
			$rootScope.text = '无权限做出变更！'
			boxshow();
		} else {
			if (confirm("你确定要删除此项作业？与之相关的学生作业也会一并删除")) {
				$.post('/homework/api/delete', dat, function (res) {
					if (res.code == 1) {
						$scope.$apply(function () {
							$rootScope.text = '作业删除成功！'
						});
						boxshow();
						setTimeout(function () {
							window.location.href = 'TMyWork.html';
						}, 1500);
					} else {
						$scope.$apply(function () {
							$rootScope.text = res.text
						});
						boxshow();
					}
				})
			}
		}
	}
})
