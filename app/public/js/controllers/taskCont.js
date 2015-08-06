'use strict';

dashboardApp.controller('taskCont', function ($scope, itRequestService) {
    $scope.tasksclass = "glyphicon-ok";
    $scope.newtask = '';
    var selecteditemid = -1;
    $scope.taskitemclick = function (id) {
        if ($scope.tasksclass === "glyphicon-ok") {
          $scope.tasks[id].selected = true;
          $scope.message = 'به روز رسانی....';
          itRequestService.updatetasks(function () {setTimeout(function(){$scope.message = ''; $scope.$apply();}, 300);}, $scope.tasks);
        } else {
          if ($scope.tasksclass === "glyphicon-minus") {
            $scope.tasks.splice(id,1);
          } else {
            if ($scope.tasksclass === "glyphicon-pencil") {
              $scope.selecteditem = $scope.tasks[id].name;
              selecteditemid = id;
              $('#editItemModal').modal('show');
            }
          }
        }
    };
    $scope.updateselecteditem = function() {
        $scope.tasks[selecteditemid].name = $scope.selecteditem;
        selecteditemid = -1;
        $('#editItemModal').modal('hide');
    };
    $scope.addnewtask = function() {
        $scope.tasks.push({ name : $scope.newtask });
        selecteditemid = -1;
        $('#addTaskModal').modal('hide');
    };
    $scope.selectedtaskitemclick = function (id) {
        $scope.tasks[id].selected = false;
        $scope.message = 'به روز رسانی....';
        itRequestService.updatetasks(function () {setTimeout(function(){$scope.message = ''; $scope.$apply();}, 300);}, $scope.tasks);
    };
    $scope.clearfilter = function (phrase) {
        $scope.filtertext = '';
        for (var item in $scope.tasks) {
            $scope.tasks[item].hide = false;
        }
    };
});