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
		$.get('/homework/api/kuWorkDetail', dat, function (res) {

			res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
			res.data[0].enddate = res.data[0].enddate.substring(0, 10);

			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			$scope.workinfo = res.data[0];

			$.get('/homework/api/SWorkDetail', dat, function (res) {
				console.log("dsds", res.data[0])
				serianumber = res.data[0].serianumber;
				score = res.data.score;
				if (res.data[0].answer !== null) {
					$("#up").html('已提交');
				}
				if (res.data[0].score !== null) {
					$("#check").html('已批改');
				}
				//				$scope.$apply(function () {
				$scope.sworkinfo = res.data[0]
				$scope.$apply();
				//				})
			})
			$scope.shangchuan = function () {
				_fns.uploadFile2(2, $('#shangchuan'), function (f) {}, function (f) {

				}, function (f) {
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
					console.log("dsds", date)
					$.post("/homework/api/updateSwork", date, function (res) {
						if (res.code == 1) {
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
			var date = res.data;
			for (var i = 0; i < date.length; i++) {
				index = Math.floor((Math.random() * arry.length));
				res.data[i].bg = arry[index];
			}
			$scope.obj = date;


			$scope.timbs = function (cid) {
				var numId = this.val.chatid;
				var cookies = $.cookie('timbs');
				if (cookies == undefined) {
					this.val.timbs += 1;
					$.cookie('timbs', numId + ',', {
						expires: 7
					});
				} else {
					var index = cookies.indexOf(numId);
					//                    alert(index)
					if (index < 0) {
						this.val.timbs += 1;
						cookies += (numId + ',');
						$.cookie('timbs', cookies, {
							expires: 7
						});
					} else {
						this.val.timbs -= 1;
						newCookie = cookies.replace((numId + ','), '');
						$.cookie('timbs', newCookie, {
							expires: 7
						});
					}
				}
				var data = {
					chatid: cid,
					thimbs: this.val.timbs
				}
				console.log(">>>>>", data);
				$.get("/homework/api/thimbs", data, function (res) {
					console.log(">>>>>thimbs", res);
				});
			}
			$(function () {
				var counter = 0; /*计数器*/
				var pageStart = 0; /*offset*/
				var pageSize = 12; /*size*/
				var isEnd = false; /*结束标志*/
				/*首次加载*/

				getData(pageStart, pageSize);


				function getData(offset, size) {
					var sum = date.length;
					var result = '';
					if (sum - offset < size) {
						size = sum - offset;
					}
					var temp = [];
					for (var i = 0; i < (offset + size); i++) {
						temp.push(date[i]);
					}
					$scope.$apply(function () {
						$scope.obj = temp;
					});
				}
				refresher.init({
					id: "wrapper",
					pullDownAction: Refresh,
					pullUpAction: Load
				});
				if (res.data.length < pageSize) {
					$('.pullUp').css({
						'display': 'none'
					})
				}


				function Refresh() { //上拉要执行的代码
					setTimeout(function () {
						counter = 0;
						getData(0, pageSize);
						$('.pullUpLabel').html('上拉加载更多')
						wrapper.refresh();
						$.get('/homework/api/openChat', dat, function (res) {
							var date = res.data;
							for (var i = 0; i < date.length; i++) {
								index = Math.floor((Math.random() * arry.length));
								res.data[i].bg = arry[index];
							}
							$scope.$apply(function () {
								$scope.obj = res.data;
							});
						});

					}, 1000)
				}

				function Load() { //下拉要加载的代码
					setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!
						counter++;


						pageStart = counter * pageSize;
						getData(pageStart, pageSize);
						wrapper.refresh();
						if ((pageStart + pageSize) >= date.length) {
							$('.pullUpLabel').html('已经到底了')
						}
					}, 1000);
				}
			});
		});



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

			if (dat1.content == "") {
				$scope.text = '发布内容不能为空！';
				boxshow();
			} else {
				$.post('/homework/api/ChatContent', dat1, function (res) {

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
