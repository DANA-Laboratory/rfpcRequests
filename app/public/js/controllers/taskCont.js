'use strict';

dashboardApp.controller('taskCont', function ($scope, itRequestService) {
    $scope.taskitemclick = function (id) {
        $scope.tasks[id].selected = true;
        itRequestService.updatetasks($scope.tasks);
    };
    $scope.selectedtaskitemclick = function (id) {
        $scope.tasks[id].selected = false;
        itRequestService.updatetasks($scope.tasks);
    };
    $scope.clearfilter = function (phrase) {
        $scope.filtertext = '';
        for (var item in $scope.tasks) {
            $scope.tasks[item].hide = false;
        }
    };
});