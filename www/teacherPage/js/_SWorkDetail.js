var mySwiper = new Swiper('.swiper-container', {
	direction: 'horizontal',
	pagination: '.swiper-pagination',
	onSlideChangeEnd: function (swiper) {
		switch (mySwiper.activeIndex) {
		case 0:
			{
				$("li[role=presentation]").removeClass('active');
				$('#wd').addClass('active');
				$('#addChat').css({
					display: 'none'
				});
			}
			break;
		case 1:
			{
				$("li[role=presentation]").removeClass('active');
				$('#we').addClass('active');
				$('#addChat').css({
					display: 'none'
				});
			}
			break;
		case 2:
			{
				$("li[role=presentation]").removeClass('active');
				$('#wc').addClass('active');
				$('#addChat').css({
					display: 'block'
				});
			}
			break;
		}
	}
});
$('#icon').click(function () {
	alert(mySwiper.activeIndex);
})

var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)', 'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)', 'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];

var index;
app.controller('swiperControlle', function ($scope, $rootScope) {
	var serianumber;
	var score;
	$.post('/../../start/api/getMyInfo', function (res) {
		$rootScope.userid = res.data['id'];
		var str = window.location.search;
		var dat = {
			wid: str.substring(5),
			userid: $rootScope.userid
		}
		console.log(">>>dat", dat)
		$.get('/homework/api/kuWorkDetail', dat, function (res) {

			res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
			res.data[0].enddate = res.data[0].enddate.substring(0, 10);
			console.log(">>>>>>作业", res.data[0]);
			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			//			$scope.$apply(function () {
			$scope.workinfo = res.data[0];
			//			})
			$.get('/homework/api/SWorkDetail', dat, function (res) {
				console.log(">>>>41", res.data);
				serianumber = res.data.serianumber;
				score = res.data.score;
				if (res.data.answer !== null) {
					$("#up").html('已提交');
				}
				if (res.data.score !== null) {
					$("#check").html('已批改');
				}
				//				$scope.$apply(function () {
				$scope.sworkinfo = res.data
				$scope.$apply();
				//				})
			})
			$scope.shangchuan = function () {
				_fns.uploadFile2(2, $('#shangchuan'), function (f) {
					console.log('>>>>before:', f);
				}, function (f) {

				}, function (f) {
					console.log('>>>>successXXXX:', f);
					$('#wenjian').html(f.name);
					$('#wenjian').attr('href', f.url);
				});
			}
			$scope.update = function () {
				if (score == null) {
					var myDate = new Date();
					var mouth = '';
					var day = '';
					if (myDate.getMonth() + 1 < 10) {
						mouth = "0";
					}
					if (myDate.getDate() < 10) {
						day = "0";
					}
					var update = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();


					var str = window.location.search;
					var date = {
						wid: str.substring(5),
						wenjian: $('#wenjian').attr('href'),
						serianumber: serianumber,
						answer: $("#answer").val(),
						update: update,
						fileName: $('#wenjian').html()
					}
					console.log("date<<<<", date);
					$.post("/homework/api/updateSwork", date, function (res) {
						console.log(">>>>51", res)
						if (res.code == 1) {
							console.log("code==1");
							$rootScope.$apply(function () {
								$rootScope.text = '作业提交成功'
							});
							boxshow();
							setTimeout(function () {
								window.location.href = 'SMyWork.html';
							}, 1500);
						}
						//	更新失败，显示错误信息
						else {
							$rootScope.$apply(function () {
								$rootScope.text = res.text
							});
							boxshow();
						}
					})
				} else {

					$rootScope.text = '作业已批改，无法更新';

					boxshow();
				}
			}
		});
		$.get('/homework/api/openChat', dat, function (res) {
			//		console.log(">>>>shijian", res.data[0].nick)
			//			$scope.$apply(function () { //手动加载路由
			var date = res.data;
			for (var i = 0; i < date.length; i++) {
				index = Math.floor((Math.random() * arry.length));
				res.data[i].bg = arry[index];
			}
			$scope.obj = res.data;


			//			});
			$('#chat').bind({
				focus: function () {
					$(this).val('');
				}
			});
			$scope.fabu = function () {
				var myDate = new Date();
				var mouth = '';
				var day = '';
				var hour = '';
				var minutes = '';
				if (myDate.getMonth() + 1 < 10) {
					mouth = "0";
				}
				if (myDate.getDate() < 10) {
					day = "0";
				}
				if (myDate.getHours() < 10) {
					hour = "0";
				}
				if (myDate.getMinutes() < 10) {
					minutes = "0";
				}
				var creatdate = myDate.getFullYear() + "-" + mouth + (myDate.getMonth() + 1) + "-" + day + myDate.getDate() + " " + hour + myDate.getHours() + ":" + minutes + myDate.getMinutes();
				var dat1 = {
					creatdate: creatdate,
					content: $('#chat').val(),
					userid: dat.userid,
					wid: dat.wid
				};
				console.log(">>>>dat1", dat1);
				$.post('/homework/api/ChatContent', dat1, function (res) {
					console.log(res);
					if (res.data.affectedRows == 1) {
						$scope.$apply(function () {
							$scope.text = '发布成功！'
						});
						boxshow();
						$('#chat').val("");
						datt = {
							content: dat1.content,
							userid: dat.userid,

							creatdate: creatdate,
							nick: $rootScope.nick,
							bg: arry[index]
						};
						$scope.$apply(function () {
							$scope.obj.splice(0, 0, datt);
						})
					} else {}
				});
			}
			$scope.select = function () {
				var num = this.val.nick;
				$('#myModal').attr('myAttr', num);
			};
			$scope.answer = function () {
				var modal1 = $("#myModal");
				modal1.modal('hide');
				var nick = modal1.attr('myAttr');
				$('#chat').focus().val("@" + nick + ' ');
			};
			$scope.change = function (id) {
				mySwiper.slideTo(id, 800, false);
				if (id == 2) {
					$('#addChat').css({
						display: 'block'
					});
				} else {
					$('#addChat').css({
						display: 'none'
					});
				}
			}
		})
	})

})
