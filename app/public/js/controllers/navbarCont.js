'use strict';

dashboardApp.controller('requestnav', function ($scope, $http) {

  $scope.hideprimary = false;
  $scope.hidesuccess = true;
  $scope.hideaction = true;

  $scope.showprimaryclick = function (id) {
    $scope.hideprimary = false;
    $scope.hidesuccess = true;
    $scope.hideaction = true;
  };

  $scope.showsuccess = function (id) {
    $scope.hidesuccess = false;
    $scope.hideprimary = true;
    $scope.hideaction = true;
  };

  $scope.showactionclick = function (id) {
    $scope.hideaction = false;
    $scope.hideprimary = true;
    $scope.hidesuccess = true;
  };

  $scope.$on('showrequest', function(event) {
    $scope.hideprimary = false;
    $scope.hidesuccess = true;
    $scope.hideaction = true;
  });

});
