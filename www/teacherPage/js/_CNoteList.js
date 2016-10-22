app.run(function ($rootScope) {
    $rootScope.navurl = 'controller/nav.html';
    $rootScope.alerturl = 'controller/alert.html';
    $.post('/../../start/api/getMyInfo', function (res) {
        if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
            alert("没找到您的登录信息，请重新登陆或注册.");
            window.location.href = 'http://m.xmgc360.com/start/web/account/'
        }
    })

});


var counter = 0;
// 每页展示4个
var num = 8;
var pageStart = 0,
    pageEnd = 0;


function gotop() {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
}

window.onscroll = function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        //        console.log(">>>>juli", t)
        if (t == 0) {
            $("#gotop").css({
                display: 'none'
            });
        } else {
            $("#gotop").css({
                display: 'block'
            });
        }
    }
    // dropload
$('.content').dropload({
    scrollArea: window,
    loadUpFn: function (me) {

        var nid = $(".nid:first").html();
        console.log(">>>>nid", nid);
        $.ajax({
            type: 'GET',
            url: '/homework/api/getNotice',
            data: {
                nid: nid
            },
            dataType: 'json',
            success: function (data) {
                var result = '';
                console.log(">>>>>>下拉计数器", counter);
                var style = "images/bj3.jpg";
                for (var i = 0; i < data.data.length; i++) {
                    result += '<div class="panel" style="word-break:break-all;width:100%;padding-left:5px;background:rgba(38, 157, 128, 1);background-size:100% 100%;color:white;min-height:100px;"><div class="panel-body"style="text-align: left;"><p style="width:100%;">' + data.data[i].content + '</p></div><div class="panel-footer text-right"style="border:none;background-color:rgba(255,255,255,0)"><span style="font-size:12px;">' + data.data[i].nick + '</span>&nbsp;<span style="font-size:12px;">' + data.data[i].creatdate + '</span><span style="display:none;" class="nid">' + data.data[i].nid + '</span></div></div>';
                }
                // 为了测试，延迟1秒加载
                setTimeout(function () {
                    $(result).insertBefore(".panel:first");
                    // 每次数据加载完，必须重置
                    me.resetload();
                    // 重置索引值，重新拼接more.json数据
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
    loadDownFn: function (me) {
        $.ajax({
            type: 'GET',
            url: '/homework/api/getNotice',
            dataType: 'json',
            success: function (data) {
                var result = '';
                counter++;
                console.log(">>>>>>上拉计数器", counter);
                pageEnd = num * counter;
                pageStart = pageEnd - num;
                if (counter <= Math.ceil((data.data.length) / num)) {

                    for (var i = pageStart; i < pageEnd; i++) {
                        result += '<div class="panel" style="word-break:break-all;width:100%;padding-left:5px;background:rgba(38, 157, 128, 1);background-size:100% 100%;color:white;min-height:100px;"><div class="panel-body"style="text-align: left;"><p style="width:100%;">' + data.data[i].content + '</p></div><div class="panel-footer text-right"style="border:none;background-color:rgba(255,255,255,0)"><span style="font-size:12px;">' + data.data[i].nick + '</span>&nbsp;<span style="font-size:12px;">' + data.data[i].creatdate + '</span><span style="display:none;" class="nid">' + data.data[i].nid + '</span></div></div>';
                        if ((i + 1) >= data.data.length) {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                            break;
                        }

                    }
                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 为了测试，延迟1秒加载
                setTimeout(function () {
                    $('.lists').append(result);
                    // 每次数据加载完，必须重置
                    me.resetload();

                }, 500);
            },
            error: function (xhr, type) {
                    alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
                //
        });
    }
});
