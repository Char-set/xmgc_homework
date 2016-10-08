app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
	$rootScope.$apply(function () {
		var str = window.location.search;
		var dat = {
			wid: str.substring(5)
		}
		$.get('/homework/api/kuWorkDetail', dat, function (res) {
			console.log(">>>>>>rows", res.data[0]);
			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			$rootScope.workinfo = res.data[0];
			$rootScope.time = {
				uptime: res.data[0].creatdate.substring(0, 10),
				endtime: res.data[0].enddate.substring(0, 10)
			}
		})
	})
	$rootScope.back = function () {
		window.history.back();
	}
	$rootScope.chose = function () {
		var str = window.location.search;
		$.get('/../../start/api/getMyInfo', function (res) {
			var dat = {
				userid: res.data['id'],
				wid: str.substring(5)
			};
			console.log(">>>>", dat)
			$.post('/homework/api/add', dat, function (res) {
				console.log(res);
				if (res.code == 1) {
					$rootScope.$apply(function () {
						$rootScope.text = '作业领取成功'
					});
					boxshow();
					setTimeout(function () {
						window.location.href = 'SMyWork.html';
					}, 1500);
				}
				//	领取失败，显示提示框
				else {
					$rootScope.$apply(function () {
						$rootScope.text = res.text
					});
					boxshow();
					setTimeout(function () {
						window.location.href = 'SMyWork.html';
					}, 1500);

				}
			})
		});
	}
})
