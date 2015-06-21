//Define an angular module for our app
var itRequestApp = angular.module('itRequestApp', ['ngRoute']);

itRequestApp.controller('TaskController', function($scope) {
  $scope.tasks = [{name:'تعريف در دامنه شرکت',id:1},{name:'تعريف user کاربر',id:2},{name:'ليسانس آنتي ويروس',id:3},{name:'نصب پيرينتر',id:4},{name:'تعريف ويندوز',id:5},{name:'ويروس يابي',id:6},{name:'بروز رساني آنتي ويروس',id:7},{name:'نصب آنتي ويروس',id:8},{name:'آموزش',id:9},{name:'نصب نرم افزار',id:10},{name:'نصب ويندوز کامل به همراه نرم افزار',id:11},{name:'بازیابی اطلاعات',id:12},{name:'پشتیبان گیری اطلاعات',id:13},{name:'دسترسي به سرور',id:14},{name:'تنظيمات شبکه',id:15},{name:'دسترسي به آدرس خاص',id:16},{name:'اتصال به اينترنت',id:17},{name:'اختصاص IP',id:18},{name:'مانيتور',id:19},{name:'منبع تغذيه',id:20},{name:'کيبورد',id:21},{name:'موس',id:22},{name:'کارت واي فاي',id:23},{name:'DVD-RW',id:24},{name:'Duplicator',id:25},{name:'کابل شبکه',id:26},{name:'سوکت شبکه Rj45',id:27},{name:'کابل برق پاور',id:28},{name:'کارت گرافيک',id:29},{name:'کابل مانيتور',id:30},{name:'کابل پيرينتر',id:31},{name:'کيس کامپيوتر',id:32},{name:'سيستم يونيت',id:33},{name:'داکت',id:34},{name:'سوراخ گرد بُر',id:35},{name:'هدفون (گوشي)',id:36},{name:'برق اتصال شبکه',id:37},{name:'سيستم تلفن',id:38},{name:'سيار برق',id:39},{name:'بست کمربندي',id:40},{name:'هارد ديسک',id:41},{name:'سويچ شبکه',id:42},{name:'کارت شبکه',id:43},{name:'RAM',id:44},{name:'فن خنک کننده',id:45},{name:'خاک گيري',id:46},{name:'باتري مادربرد',id:47},{name:'فلاپی درایو',id:48}];
  $scope.alltasks = $scope.tasks.slice(0,$scope.tasks.length-1);
  $scope.selectedtasks = [];
  $scope.taskitemclick = function(id) {
    $scope.selectedtasks.push($scope.alltasks.splice(id,1)[0]);  
  };  
  $scope.selectedtaskitemclick = function(id) {
    $scope.alltasks.push($scope.selectedtasks.splice(id,1)[0]);  
  };
  $scope.itemsfilter = function(phrase) {
    $scope.alltasks = [];
    for (item in $scope.tasks) {
      $scope.alltasks.push(item);
    }
  };
});

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
