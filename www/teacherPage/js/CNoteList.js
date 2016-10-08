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
app.controller("kzq", function ($scope) {
    $.get("/homework/api/getNotice", function (res) {
        for (var key in res.data) {
            res.data[key].creatdate = res.data[key].creatdate.substring(5);
        }
        $scope.$apply(function () {
            $scope.filteredNotes = [], $scope.currentPage = 1, $scope.numPerPage = 4, $scope.maxSize = 3;
            $scope.notices = res.data;
            $scope.length = Math.ceil(res.data.length / $scope.numPerPage) + "0";
            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                    end = begin + $scope.numPerPage;

                $scope.filteredNotes = $scope.notices.slice(begin, end);
            });
        });

    })

})
