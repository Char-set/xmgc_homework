var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)', 'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)', 'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];

var index;
app.controller('myCtrl1', function ($scope, $rootScope) {
	$.post('/../../start/api/getMyInfo', function (res) {
		$rootScope.userid = res.data['id'];
		$rootScope.nick = res.data['nick'];
		var str = window.location.search;
		var dat = {
			userid: $rootScope.userid,
			wid: str.substring(5)
		}
		$.get('/homework/api/openChat', dat, function (res) {
			//		console.log(">>>>shijian", res.data[0].nick)
			$scope.$apply(function () { //手动加载路由
				var date = res.data;
				for (var i = 0; i < date.length; i++) {
					index = Math.floor((Math.random() * arry.length));
					res.data[i].bg = arry[index];
				}
				$scope.obj = res.data;


			});
			//        });
			$('#input').bind({
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
					content: $('#input').val(),
					userid: dat.userid,
					wid: dat.wid
				};
				if ($('#input').val() == '') {
					return 0;
				}
				console.log(">>>>dat1", dat1);
				$.post('/homework/api/ChatContent', dat1, function (res) {
					console.log(res);
					if (res.data.affectedRows == 1) {
						$scope.$apply(function () {
							$rootScope.text = '发布成功！'
						});
						console.log('..ds.', $scope.text)
						boxshow();
						// $('#input').val('写评论');
						$('#input').val("");
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
				$('#input').focus().val("@" + nick + ' ');
			};
		})
	})
})
