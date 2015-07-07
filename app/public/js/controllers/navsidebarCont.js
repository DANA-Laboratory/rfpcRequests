'use strict';

dashboardApp.controller('navsidebarCont', function ($scope, itRequestService) {
    $scope.requestStatus = requestStatus;
    var active= function (id) {
        var ac = ['','','','','','','',''];
        if (id != null) {
            ac[id] = 'active';
        }
        return ac
    }
    
    $scope.liclick = function (id) {
        $scope.active=active(id);
        itRequestService.refreshTable(id);
    };

    itRequestService.refereshsidebar(function(data) {$scope.ndata = data;});
    
    $scope.$on('refereshsidebar', function(event){
      itRequestService.refereshsidebar(function(data) {$scope.ndata = data;});
    });
});