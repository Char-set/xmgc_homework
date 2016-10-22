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
app.run(function ($rootScope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';

});
var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)', 'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)', 'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];



var index;
app.controller('swiperController', function ($scope, $rootScope) {
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
			console.log(">>>作业数据", res.data[0])
			res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
			res.data[0].enddate = res.data[0].enddate.substring(0, 10);
			wuserid = res.data[0].userid;
			console.log(">>>>>>作业", res.data[0]);
			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			$scope.workinfo = res.data[0];
			$scope.view = function () {
				var url = "http://api.idocv.com/view/url?url=" + encodeURIComponent(res.data[0].annex) + "&name=" + res.data[0].filename + "        ";
				$("#view").attr("src", url);
				$('#myModal1').modal()
			}
			$.post('/homework/api/kecheng', function (res) {
				$scope.classes = res;
			})
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

		$.post('/homework/api/getStuWork', dat, function (res) {
			var date = res["data"]
			for (var key in date) {
				if (date[key].score == null) {
					date[key].text = '批改'
				} else {
					date[key].text = '已批改'
				}
				date[key].cretdate = date[key].cretdate.substring(0, 10);
			}
			console.log(">>>>>afte", date);
			//		$scope.$apply(function () {
			$scope.workinfo1 = date;
			//		});

		});

		$.get('/homework/api/openChat', dat, function (res) {
			var date = res.data;
			if (date.length == 0) {
				$('#none').show();
			} else {
				$('#none').hide()
			}
			console.log(">>>>讨论区", res);






			for (attr in date) {
				var index = Math.floor((Math.random() * arry.length));
				date[attr].bg = arry[index];
				date[attr].creatdate = date[attr].creatdate;
				console.log(date[attr].creatdate)
			}
			$scope.obj = [];
			var counter = 0;
			// 每页展示12个
			var num = 12;
			var pageStart = 0,
				pageEnd = 0;

			function timbsColor(e) {
				for (var k = 0; k < e.length; k++) {
					var str = e[k].timbstr;
					var indexNum = str.indexOf(userid + ',');
					if (indexNum != (-1)) {
						$('.' + e[k].chatid).addClass('blue');
					}
				}
			}
			// dropload
			$('#wrapper').dropload({
				scrollArea: window,
				loadUpFn: function (me) {
					$.ajax({
						type: 'GET',
						url: '/homework/api/openChat',
						data: dat,
						dataType: 'json',
						success: function (data) {
							var objlength = data.data.length
							var newlength = objlength - date.length;
							var temp = [];
							if (objlength <= num) {
								var lang = objlength;
								counter = -3;
							} else {
								lang = newlength + num;
								counter = 1;
							}
							for (var i = 0; i < lang; i++) {
								var index = Math.floor((Math.random() * arry.length));
								data.data[i].bg = arry[index];
								temp.push(data.data[i]);
							}
							// 为了测试，延迟1秒加载
							setTimeout(function () {
								$scope.$apply(function () {
									$scope.obj = temp;
								});
								//  每次数据加载完，必须重置
								me.resetload();
								// 重置索引值，重新拼接more.json数据
								timbsColor($scope.obj);

								// 解锁
								me.unlock();
								me.noData(false);
							}, 1000);
						},
						error: function (xhr, type) {
							alert('Ajax error!');
							// 即使加载出错，也得重置
							me.resetload();
						}
					});
				},
				loadDownFn: function (me) { //加载
					counter++;
					pageEnd = num * counter;
					pageStart = pageEnd - num;
					var temp = [];

					if (counter < 0 || date.length == 0) {
						me.lock();
						// 无数据
						//me.noData();

						$('.dropload-noData,.loading,.dropload-load').css({
							'display': 'none'
						});

					} else {
						for (var i = pageStart; i < pageEnd; i++) {
							var index = Math.floor((Math.random() * arry.length));
							date[i].bg = arry[index];
							temp.push(date[i]);
							if ((i + 1) >= date.length) {
								// 锁定
								me.lock();
								// 无数据
								me.noData();
								break;
							}
						}
					}
					console.log('1++++++' + i + '2++++++' + date.length);
					// 为了测试，延迟1秒加载
					setTimeout(function () {
						$scope.$apply(function () {
							Array.prototype.push.apply($scope.obj, temp);
						});
						// 每次数据加载完，必须重置
						me.resetload();
						timbsColor($scope.obj);
					}, 1000);



				}
			});









			$scope.timbs = function () {
				var numId = this.val.chatid;
				if (!numId) {

				} else {
					var num = {
						userid: userid,
						number: 1, //点赞
						chatId: numId,
					};
					var num1 = {
						userid: userid,
						number: 0, //取消赞
						chatId: numId,
					};
					var num2 = {
						userid: userid,
						number: 2, //获取timbstr
						chatId: numId,
					};
					var number1 = this.val.timbs;
					$.ajaxSetup({
						async: false
					});
					$.post('/homework/api/updateTimbs', num2, function (res) {
						var string = res[0].timbstr;
						var indexId = string.indexOf(userid + ',');
						if (indexId < 0) {
							number1 += 1;
							$('.' + numId).addClass('blue');
							$.post('/homework/api/updateTimbs', num, function (res) {

							})

						} else {
							number1 -= 1;
							$('.' + numId).removeClass('blue');
							$.post('/homework/api/updateTimbs', num1)
						}
					});
				}

				this.val.timbs = number1;
			}









		});
		$('#chat').bind({
			focus: function () {
				$(this).val('');
			}
		});
		$scope.fabu = function () {
			var myDate = new Date();

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
				$.ajaxSetup({
					async: true
				});
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
							timbs: 0,
							creatdate: dat1.creatdate,
							nick: $rootScope.nick,
							timbstr: '0,',
							bg: arry[0]
						};
						$('#none').hide();
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
	});
})
