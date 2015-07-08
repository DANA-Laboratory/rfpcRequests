'use strict';

dashboardApp.controller('navsidebarCont', function ($scope, itRequestService) {
    $scope.requestStatus = requestStatus;
    var active= function (id) {
        var ac = ['btn-default','btn-default','btn-default','btn-default','btn-default','btn-default','btn-default','btn-default','btn-default','btn-default'];
        if (id != null) {
            ac[id] = 'btn-info';
        }
        return ac
    }
    
    $scope.liclick = function (id) {
        $scope.active=active(id);
        itRequestService.refreshTable(id);
    };
    $scope.active=active(null);
    itRequestService.refereshsidebar(function(data) {$scope.ndata = data;});
    
    $scope.$on('refereshsidebar', function(event){
      itRequestService.refereshsidebar(function(data) {$scope.ndata = data;});
    });
});