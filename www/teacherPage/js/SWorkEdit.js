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
app.controller('sdatacontroller', function ($scope, $rootScope) {
	var serianumber;
	var score;
	$.post('/../../start/api/getMyInfo', function (res) {
		$rootScope.userid = res.data['id'];
		var str = window.location.search;
		var dat = {
			wid: str.substring(5),
			userid: $rootScope.userid
		}
		console.log(">>>dat", dat);
		$.get('/homework/api/SWorkDetail', dat, function (res) {
			console.log(">>>>41", res.data);
			serianumber = res.data.serianumber;
			score = res.data.score;
			console.log(">>>流水号", serianumber);
			if (res.data.answer !== null) {
				$("#up").html('已提交');
			}
			if (res.data.score !== null) {
				$("#check").html('已批改');
			}
			$scope.$apply(function () {
				$scope.sworkinfo = res.data
			})
		})
	})

	$scope.update = function () {
		console.log(">>>", score);
		if (score == null) {
			var myDate = new Date();
			var mouth = '';
			var day = '';
			if (myDate.getMonth() < 10) {
				mouth = "0";
			}
			if (myDate.getDate() < 10) {
				day = "0";
			}
			var update = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();


			var str = window.location.search;
			var date = {
				wid: str.substring(5),
				wenjian: $('#wenjian').html(),
				serianumber: serianumber,
				answer: $("#answer").val(),
				update: update
			}
			console.log("date<<<<", date);
			$.post("/homework/api/updateSwork", date, function (res) {
				console.log(">>>>51", res)
				if (res.code == 1) {
					console.log("code==1");
					$scope.$apply(function () {
						$scope.text = '作业提交成功'
					});
					boxshow();
					setTimeout(function () {
						window.location.href = 'SMyWork.html';
					}, 1500);
				}
				//	更新失败，显示错误信息
				else {
					$scope.$apply(function () {
						$scope.text = res.text
					});
					boxshow();
				}
			})
		} else {

			$scope.text = '作业已批改，无法更新';

			boxshow();
		}

	}

})
