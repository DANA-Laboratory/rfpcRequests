//Define an angular module for our app
var itRequestApp = angular.module('itRequestApp', ['ngRoute']);
 
//Define Routing for app
itRequestApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/RemoveItem/:id', {
        templateUrl: 'panelSuccessRemove',
        controller: 'RemoveItemController',
      }).
      when('/AddNewItem/:id', {
        templateUrl: 'panelSuccessAdd',
        controller: 'AddItemController',
        foodata: 'addorder'
      }).
      otherwise({
        templateUrl: 'panelSuccess'
      });
}]);
 
itRequestApp.controller('RemoveItemController', function($scope,$http,$routeParams) {
    $scope.message = 'This is Remove Item screen';
    $scope.cfdump = "";

    // By default, the $http service will transform the outgoing request by
    // serializing the data as JSON and then posting it with the content-
    // type, "application/json". When we want to post the value as a FORM
    // post, we need to change the serialization algorithm and post the data
    // with the content-type, "application/x-www-form-urlencoded".
    var request = $http({
        method: "post",
        url: "test",
        data: {
            id: 4,
            name: "Kim",
            status: "Best Friend"
        }
    });

    // Store the data-dump of the FORM scope.
    request.success(
        function( html ) {

            $scope.cfdump = html;

        }
    );
});
 
itRequestApp.controller('AddItemController', function($scope,$http,$route) {
    $scope.message = 'This is Add Item screen';
});