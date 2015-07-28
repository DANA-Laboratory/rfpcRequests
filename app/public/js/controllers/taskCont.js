'use strict';

dashboardApp.controller('taskCont', function ($scope, itRequestService) {
    $scope.tasksclass = "glyphicon-ok";
    $scope.newtask = '';
    var selectedtaskid = -1;
    $scope.taskitemclick = function (id) {
        if ($scope.tasksclass === "glyphicon-ok") {
          $scope.tasks[id].selected = true;
          itRequestService.updatetasks($scope.tasks);
        } else {
          if ($scope.tasksclass === "glyphicon-minus") {
            $scope.tasks.splice(id,1);
          } else {
            if ($scope.tasksclass === "glyphicon-pencil") {
              $scope.selectedtask = $scope.tasks[id].name;
              selectedtaskid = id;
              $('#editTaskModal').modal('show');
            }
          }
        }
    };
    $scope.updatetaskname = function() {
        $scope.tasks[selectedtaskid].name = $scope.selectedtask;
        selectedtaskid = -1;
        $('#editTaskModal').modal('hide');
    };
    $scope.addnewtask = function() {
        $scope.tasks.push({ name : $scope.newtask });
        selectedtaskid = -1;
        $('#addTaskModal').modal('hide');
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