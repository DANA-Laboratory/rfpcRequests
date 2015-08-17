'use strict';

dashboardApp.controller('taskCont', function ($scope, itRequestService) {

    $scope.tasksclass = "glyphicon-ok";
    $scope.newitem = '';
    var selecteditemid = -1;
    
    $scope.taskitemclick = function (id) {
        if ($scope.tasksclass === "glyphicon-ok") {
          $scope.tasks[id].selected = true;
          $scope.message = 'به روز رسانی....';
          itRequestService.updatetasks(function () {setTimeout(function(){$scope.message = ''; $scope.$apply();}, 300);}, $scope.tasks);
        } else {
          if ($scope.tasksclass === "glyphicon-minus") {
            itRequestService.deleteitem($scope.tasks[id]);
            $scope.tasks.splice(id,1);
          } else {
            if ($scope.tasksclass === "glyphicon-pencil") {
              $scope.selecteditem = $scope.tasks[id].name;
              selecteditemid = id;
              $('#editTaskModal').modal('show');
            }
          }
        }
    };
    
    $scope.updateselecteditem = function() {
        $scope.tasks[selecteditemid].name = $scope.selecteditem.name;
        selecteditemid = -1;
        itRequestService.updateitem( $scope.tasks[selecteditemid] );
        $('#editTaskModal').modal('hide');
    };
    
    $scope.addnewitem = function() {
        var item = { name : $scope.newitem, itemType : 0 }
        $scope.tasks.push(item);
        selecteditemid = -1;
        itRequestService.insertitem(item);
        $('#addTaskModal').modal('hide');
    };
    
    $scope.selectedtaskitemclick = function (id) {
        $scope.tasks[id].selected = false;
        $scope.message = 'به روز رسانی....';
        itRequestService.updatetasks(function () {setTimeout(function(){$scope.message = ''; $scope.$apply();}, 300);}, $scope.tasks);
    };
    
    $scope.clearfilter = function () {
        $scope.filtertext = '';
        for (var item in $scope.tasks) {
            $scope.tasks[item].hide = false;
        }
    };
});