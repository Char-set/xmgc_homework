var mySwiper = new Swiper('.swiper-container', {
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


function view1(id, furl, fname) {
	var url = "http://api.idocv.com/view/url?url=" + encodeURIComponent(furl) + "&name=" + fname + "        ";
	$("#" + id).attr("src", url);
}



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
			console.log('laoshi', res);
			view1('view1', res.data[0].annex, res.data[0].filename)

			res.data[0].creatdate = res.data[0].creatdate.substring(0, 10);
			res.data[0].enddate = res.data[0].enddate.substring(0, 10);


			if (res.data[0].annex == '.....' || res.data[0].annex == '') {
				$('#annex').css({
					display: 'none'
				})
			}
			$scope.workinfo = res.data[0];
			$.get('/homework/api/SWorkDetail', dat, function (res) {
				$("#old").html(res.data[0].annex);
				console.log("数据", res.data[0]);
				serianumber = res.data[0].serianumber;
				score = res.data.score;
				if (res.data[0].answer !== null) {
					$("#up").html('已提交');
				}
				if (res.data[0].score !== null) {
					$("#check").html('已批改');
				}
				if (res.data[0].annex != null) {
					$("#shangchuan").html("更新文件");
				}
				//				$scope.$apply(function () {
				$scope.sworkinfo = res.data[0];

				view1('view2', res.data[0].annex, res.data[0].filename)
				$scope.$apply();
				//				})

				$scope.shangchuan = function () {
					_fns.uploadFile2(2, $('#shangchuan'), function (f) {}, function (f) {

					}, function (f) {
						$scope.file = f;
						console.log(">>>>>f", f);
						$scope.size = parseFloat(Number(f.size / 1048576).toFixed(2));
						console.log(">>>>>>>>size1", $scope.size);
						if ($scope.size < 1) {
							view1('view2', f.url, f.name);
							$("#old").html(f.url);
							$('#wenjian').html(f.name);
						} else {
							$scope.text = "文件过大，上传失败！";
							$('#wenjian').html(f.name);
							boxshow();
						}
						$scope.$apply();
					});
				}
				$scope.update = function () {
					if ($("#old").html == res.data[0].annex && $("#answer").val() == res.data[0].answer) {
						$scope.text = "信息未做变更，提交失败！";
						boxshow();
						return 0;
					}
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
						console.log($scope.file);
						var date = {
							wid: str.substring(5),
							serianumber: serianumber,
							answer: $("#answer").val(),
							update: update,
							annex: $("#old").html(),
							fileName: $('#wenjian').html()
						}
						console.log("提交", date);

						console.log(">>>>>>>>size2", $scope.size);
						if ($scope.size > 1) {
							$scope.text = "文件过大，无法提交！";
							console.log("dsds", $scope.size)
							boxshow();
							return 0;
						}
						$.post("/homework/api/updateSwork", date, function (res) {
							if (res.code == 1) {
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
								$rootScope.$apply(function () {
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
					//                    boxshow();
				} else {
					$.ajaxSetup({
						async: true
					});
					$.post('/homework/api/ChatContent', dat1, function (res) {

						if (res.data.affectedRows == 1) {
							$scope.$apply(function () {
								$scope.text = '发布成功！'
							});
							//                            boxshow();
							$('#chat').val("");
							datt = {
								content: dat1.content,
								userid: dat.userid,

								creatdate: creatdate,
								nick: $rootScope.nick,
								bg: arry[index]
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
		})
	});
	$scope.view = function (id) {
		$('#' + id).modal()
	}
})
