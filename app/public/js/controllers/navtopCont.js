'use strict';

dashboardApp.controller('navbarCont', function ($scope, itRequestService) {
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
        $scope.$broadcast('topnavClick');
    };
    
    $scope.active=active(null);
    itRequestService.refereshnavbar(function(data) {$scope.ndata = data;});
    
    $scope.$on('refereshnavbar', function(event){
        itRequestService.refereshnavbar(function(data) {$scope.ndata = data;});
    });
    
    $scope.accountsclick = function() {
        itRequestService.getusers(function(data) {$scope.users = data; $scope.gotouser(0);});
        $('#accountsManegement').modal('show');
    };
    
    $scope.setUser = function(item) {
        $scope.gotouser($scope.users.indexOf(item));
    }
    
    $scope.gotouser = function(index) {
        $scope.selectedUserIndex = index;
        $scope.selectedUser = JSON.parse(JSON.stringify($scope.users[index]));
        $scope.updateclass = 'disabled';
    }
    
    $scope.addnewuser = function() {
        $scope.selectedUser = {'name':'', 'family':'', 'username':'', 'email':''};
        $scope.selectedUserIndex = $scope.users.length;
    }
    
    $scope.updateclass = 'disabled';
    $scope.selectedUser = {};
    $scope.selected = undefined;
    $scope.users = [];
    $scope.selectedUserIndex = 0;
 });