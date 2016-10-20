var socket = io('182.254.151.40:8000');

console.log('>>>', socket);
var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)', 'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)', 'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];


var userid;
var nick;
$('#content').bind({
	focus: function () {
		$(this).val('');
	}
});
$.post('/../../start/api/getMyInfo', function (res) {
	if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
		alert("没找到您的登录信息，请重新登陆或注册.");
		window.location.href = 'http://m.xmgc360.com/start/web/account/';
	}
	userid = res.data['id'];
	nick = res.data['nick'];
	console.log('>>', res);
	$('#chat').click(function () {
		var data = {
			nick: nick,
			content: $("#content").val()
		};
		console.log('>>>', data);
		if (data.content != '') {
			socket.emit('chat', data);
		}

	})

	socket.on('chat', function (msg) {
		var index = Math.floor((Math.random() * arry.length));
		//		$('#msgs').append($("<div style='" + arry[index] + ";margin-bottom:10px;'><label>" + msg.data.nick + ":</label><span>" + msg.data.content + "</span></div>"));

		$("<div style='" + arry[index] + ";margin-bottom:10px;'><label>" + msg.data.nick + ":</label><span>&nbsp;&nbsp;" + msg.data.content + "</span></div>").insertAfter($('#msgs'));
	});


})
