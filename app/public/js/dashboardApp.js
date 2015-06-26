'use strict';

var dashboardApp = angular.module('dashboardApp', ['ngRoute']);
var selectedRequestId= -1;

dashboardApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/it', {
      templateUrl: 'itRequest'
    })
    .when('/it/:requestid', {
      templateUrl: 'itRequest/10'
    })
  }]);
  
dashboardApp.directive('myOnKeyDownCall', function () {
    return function (scope, element, attrs) {
        element.bind('keyup', function (event) {
            console.log(event);
            if (event.keyCode === 27 || scope.filtertext.length > 2) {
                for (var item in scope.tasks) {
                    if (event.keyCode === 13 && scope.tasks[item].hide === false) {
                         scope.tasks[item].selected = true;
                    } else {
                        if (event.keyCode === 27 || scope.tasks[item].name.search(scope.filtertext) !== -1) {
                            scope.tasks[item].hide = false;
                        }
                        else {
                            scope.tasks[item].hide = true;
                        }
                    }
                }
                if (event.keyCode === 27 || event.keyCode === 13) {
                    scope.filtertext = '';
                }
            }
            scope.$apply();
        });
    };
});

dashboardApp.controller('TaskController', function ($scope) {
    $scope.taskitemclick = function (id) {
        $scope.tasks[id].selected = true;
    };
    $scope.selectedtaskitemclick = function (id) {
        $scope.tasks[id].selected = false;
    };
    $scope.clearfilter = function (phrase) {
        $scope.filtertext = '';
        for (var item in $scope.tasks) {
          $scope.tasks[item].hide = false;
        }
    };
});

dashboardApp.controller('dashboard', function ($scope, $http) {
    
    $scope.hidetable =  false;
    $scope.hiderequest = false;
    $scope.hideprimary = false;
    $scope.hidesuccess = true;
    $scope.hideaction = true;
    
    $scope.viewrequestclick = function (id) {
        //TODO data reader user
        $scope.userLevel = 3; //data reader
        $scope.getdata();
        $scope.hidetableclick();
    };
    
    $scope.newrequestclick = function (id) {
        $scope.requestLevel = 0;
        $scope.userLevel = 0;
        $scope.hidetableclick();
    };
    
    $scope.openrequestclick = function (id) {
        $scope.getdata();
        $scope.hidetableclick();
    };
    
    $scope.getdata = function () {
        if (selectedRequestId!==-1) {
          $http({
              method: 'GET',
              url: '/data/'+selectedRequestId
          }).success(function(data, status, headers, config) {
              $scope.requestLevel = data.requestLevel;
              $scope.userLevel = data.userLevel;
              console.log(data);
          }).error(function(data, status, headers, config) {
              console.log("error get");
          });
        }
    };
    
    $scope.hidetableclick = function () {
        $scope.hidetable =  true;
        $scope.hideprimary = false;
        $scope.hidesuccess = true;
        $scope.hideaction = true;
        $scope.hiderequest = false;
    };
    
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
    
    $scope.backclick = function (id) {
        $scope.hidetable =  false;
        $scope.hiderequest = true;
    };
});

dashboardApp.controller('panelPrimary', function ($scope) {
    var date = new Date();
    $scope.currentDate = gregorianToJalali(date , '/');
    $scope.currentTime = date.getHours() + ':' + date.getMinutes();
});

function rowStyle(row, index) {
  var requestStatus = ['ثبت شده', 'در حال بررسی', 'در حال اجرا' ,'خاتمه یافته', 'متوقف'];
  var rowRequestStatus = requestStatus.indexOf(row.status);
  var classes = ['active', 'info', 'warning', 'success', 'danger'];
  if (rowRequestStatus>-1) {
    return {
      classes: classes[rowRequestStatus]
      };
  };
  return {};
}


$(function () {
    $('#requestsTable').on('all.bs.table', function (e, name, args) {
        console.log('Event:', name, ', data:', args);
    })
    .on('click-row.bs.table', function (e, row, $element) {
    })
    .on('dbl-click-row.bs.table', function (e, row, $element) {
    })
    .on('sort.bs.table', function (e, name, order) {
    })
    .on('check.bs.table', function (e, row) {
        selectedRequestId = row.id;
    })
    .on('uncheck.bs.table', function (e, row) {
    })
    .on('check-all.bs.table', function (e) {
    })
    .on('uncheck-all.bs.table', function (e) {
    })
    .on('load-success.bs.table', function (e, data) {
    })
    .on('load-error.bs.table', function (e, status) {
    })
    .on('column-switch.bs.table', function (e, field, checked) {
    })
    .on('page-change.bs.table', function (e, number, size) {
    })
    .on('search.bs.table', function (e, text) {
    });
});