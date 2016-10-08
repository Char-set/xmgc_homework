app.run(function ($rootScope) {
    $rootScope.navurl = 'controller/nav.html';
    $rootScope.alerturl = 'controller/alert.html';

});
app.controller('hwrescontroller', function ($scope) {
    $.post('/homework/api/hwres', function (res) {
        console.log(">>>>>", res.data);
        $scope.$apply(function () {
            for (key in res.data) {
                //				console.log(">>>", res.data[key].enddate.substring(0, 10))
                res.data[key].creatdate = res.data[key].creatdate.substring(0, 10);
            }
            $scope.dat = res.data;
            $scope.filteredList = [], $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 5;

            $scope.list = res.data;
            $scope.length = Math.ceil(res.data.length / $scope.numPerPage) + "0";
            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                    end = begin + $scope.numPerPage;

                $scope.filteredList = $scope.list.slice(begin, end);
                console.log($scope.filteredNotes);
            });
            console.log(">>>", res.data);
        })
    });

})
