'use strict';

dashboardApp.controller('taskCont', function ($scope, itRequestService) {
    $scope.tasksclass = "glyphicon-ok";
    $scope.taskitemclick = function (id) {
        if ($scope.tasksclass === "glyphicon-ok") {
          $scope.tasks[id].selected = true;
          itRequestService.updatetasks($scope.tasks);
        } else {
          if ($scope.tasksclass === "glyphicon-minus") {
            $scope.tasks.splice(id,1);
          } else {
            if ($scope.tasksclass === "glyphicon-pencil") {
              $('#editTaskModal').modal('show');
            }
          }
        }
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