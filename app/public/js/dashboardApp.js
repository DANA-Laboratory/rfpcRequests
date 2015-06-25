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
    $scope.tasks = [{name : 'تعريف در دامنه شرکت', id : 1}, {name : 'تعريف user کاربر', id : 2}, {name : 'ليسانس آنتي ويروس', id : 3}, {name : 'نصب پيرينتر', id : 4}, {name : 'تعريف ويندوز', id : 5}, {name : 'ويروس يابي', id : 6}, {name : 'بروز رساني آنتي ويروس', id : 7}, {name : 'نصب آنتي ويروس', id : 8}, {name : 'آموزش', id : 9}, {name : 'نصب نرم افزار', id : 10}, {name : 'نصب ويندوز کامل به همراه نرم افزار', id : 11}, {name : 'بازیابی اطلاعات', id : 12}, {name : 'پشتیبان گیری اطلاعات', id : 13}, {name : 'دسترسي به سرور', id : 14}, {name : 'تنظيمات شبکه', id : 15}, {name : 'دسترسي به آدرس خاص', id : 16}, {name : 'اتصال به اينترنت', id : 17}, {name : 'اختصاص IP', id : 18}, {name : 'مانيتور', id : 19}, {name : 'منبع تغذيه', id : 20}, {name : 'کيبورد', id : 21}, {name : 'موس', id : 22}, {name : 'کارت واي فاي', id : 23}, {name : 'DVD-RW', id : 24}, {name : 'Duplicator', id : 25}, {name : 'کابل شبکه', id : 26}, {name : 'سوکت شبکه Rj45', id : 27}, {name : 'کابل برق پاور', id : 28}, {name : 'کارت گرافيک', id : 29}, {name : 'کابل مانيتور', id : 30}, {name : 'کابل پيرينتر', id : 31}, {name : 'کيس کامپيوتر', id : 32}, {name : 'سيستم يونيت', id : 33}, {name : 'داکت', id : 34}, {name : 'سوراخ گرد بُر', id : 35}, {name : 'هدفون (گوشي)', id : 36}, {name : 'برق اتصال شبکه', id : 37}, {name : 'سيستم تلفن', id : 38}, {name : 'سيار برق', id : 39}, {name : 'بست کمربندي', id : 40}, {name : 'هارد ديسک', id : 41}, {name : 'سويچ شبکه', id : 42}, {name : 'کارت شبکه', id : 43}, {name : 'RAM', id : 44}, {name : 'فن خنک کننده', id : 45}, {name : 'خاک گيري', id : 46}, {name : 'باتري مادربرد', id : 47}, {name : 'فلاپی درایو', id : 48}];
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
              url: '/itRequest/'+selectedRequestId
          }).success(function(data, status, headers, config) {
              $scope.requestLevel = data.requestLevel;
              $scope.userLevel = data.userLevel;
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