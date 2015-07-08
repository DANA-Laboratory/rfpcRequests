'use strict';

var selectedRequestId= -1;
var requestStatus = ['ثبت شده','در دست اقدام','خاتمه يافته','متوقف شده'];

dashboardApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/it', {
      templateUrl: 'itRequest'
    })
    .when('/it/:requestid', {
      templateUrl: 'itRequest/10'
    })
  }]);
  
dashboardApp.controller('dashboardCont', function ($scope, itRequestService) {
    $scope.isCreator = null;
    $scope.hidetable =  false;
    $scope.hiderequest = false;
    
    $scope.newrequestclick = function (id) {
        $scope.requestLevel = 0;
        $scope.isCreator = true;
        var date = new Date();
        $scope.data ={description : "" , requestitems : [], owner: 1} //owner for IT Requeststs
        $scope.data.initdate = gregorianToJalali(date , '/');
        $scope.data.inittime = date.getHours() + ':' + date.getMinutes();
        $scope.data.applicant = $scope.currentUserFullName;
        $scope.hidetableclick();
    };

    $scope.viewrequestclick = function (id) {
        //TODO data reader user
        $scope.readonly = true; 
        $scope.openrequestclick(id);
    };
    
    $scope.openrequestclick = function (id) {
        $scope.hidetableclick();
    };
    
    $scope.hidetableclick = function () {
        $scope.hidetable =  true;
        $scope.hiderequest = false;
        $scope.$broadcast('showrequest');
    };
     
    $scope.backclick = function (id) {
        $scope.data = {};
        selectedRequestId = -1;
        $scope.isCreator = null;
        itRequestService.refreshTable(null);
        $scope.$broadcast('refereshsidebar');
        $scope.hidetable =  false;
        $scope.hiderequest = true;
    };
    
    $scope.toggleselection = function (item) {
        var idx = $scope.data.requestitems.indexOf(item);
        // is currently selected
        if (idx > -1) {
          $scope.data.requestitems.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.data.requestitems.push(item);
        }
        if ($scope.requestLevel>0) {
          $scope.updaterequest();
        }
    };
    
    $scope.updaterequest = function() {
        if ($scope.requestLevel>0) {
          $scope.message = 'به روز رسانی....';
          itRequestService.updaterequest(function () {setTimeout(function(){$scope.message = ''; $scope.$apply();}, 300);}, $scope.data);
        }
    };
    
    $scope.insertbtnclick = function (id) {
        //console.log($scope.data);
        itRequestService.insertrequest(function () {$scope.backclick(id);}, $scope.data);
    }
    
    $scope.updatestatus = function (id) {
        $scope.data.status = requestStatus[id];
        var date = new Date();
        $scope.data.actiondate = gregorianToJalali(date , '/');
        $scope.data.actiontime = date.getHours() + ':' + date.getMinutes();
        itRequestService.updatestatus(function () {$scope.backclick(id);}, $scope.data);
    }
    
    $scope.setUserIdName = function(index, val) {
        $scope.data.applicant = val;
    }

    var getdataCallback = function(data) {
        $scope.requestLevel = 1 + requestStatus.indexOf(data.status);
        //data binding
        $scope.data = data;
        $scope.isCreator = data.isCreator;
        for (var task in $scope.tasks) {
            if (null!=$scope.data.requesttasks && $scope.data.requesttasks.indexOf($scope.tasks[task].name) > -1) {
                $scope.tasks[task].selected = true;
            } else {
                $scope.tasks[task].selected = false;
            }
        }
    }
    
    $(function () {
        $('#requestsTable').on('all.bs.table', function (e, name, args) {
            //console.log('Event:', name, ', data:', args);
        })
        .on('click-row.bs.table', function (e, row, $element) {
        })
        .on('dbl-click-row.bs.table', function (e, row, $element) {
        })
        .on('check.bs.table', function (e, row) {
            selectedRequestId = row.id;
            itRequestService.getdata(getdataCallback);
        })
        .on('uncheck.bs.table', function (e, row) {
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
});

function rowStyle(row, index) {
  var rowRequestStatus = requestStatus.indexOf(row.status);
  var classes = ['active', 'info', 'success', 'danger'];
  if (rowRequestStatus>-1) {
    return {
      classes: classes[rowRequestStatus]
      };
  };
  return {};
}
