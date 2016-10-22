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
            $rootScope.view = function () {
                var url = "http://api.idocv.com/view/url?url=" + encodeURIComponent(res.data[0].annex) + "&name=" + res.data[0].filename + "        ";
                console.log(">>>>>>>url", url);
                $("#view").attr("src", url);
                $('#myModal1').modal()
            }
            $rootScope.time = {
                uptime: res.data[0].creatdate.substring(0, 10),
                endtime: res.data[0].enddate.substring(0, 10)
            }
        })
    })
    $rootScope.view = function () {
        console.log(">>>>>>f", $scope.file);
        var size = $scope.file.size / 1048576;
        console.log(">>>>>size", size);
        if (size > 1) {
            $scope.text = "文件过大，无法预览！";
            boxshow();
        } else {
            $('#myModal').modal()
        }

    }



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
