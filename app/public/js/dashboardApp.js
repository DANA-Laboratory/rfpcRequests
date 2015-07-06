'use strict';

var dashboardApp = angular.module('dashboardApp', ['ngRoute']);
var selectedRequestId= -1;
var requestStatus = ['ثبت شده','در دست اقدام','خاتمه يافته','متوقف شده'];

var refreshTable = function (id) {
    if (null==id) {
        $('#requestsTable').bootstrapTable('refresh', {url: '/data/table'});
    } else {
        $('#requestsTable').bootstrapTable('refresh', {url: '/data/table/' + id});
    }
}

dashboardApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/it', {
      templateUrl: 'itRequest'
    })
    .when('/it/:requestid', {
      templateUrl: 'itRequest/10'
    })
  }]);

var updatetasks = function(tasks,$http) {
  var selectedtasks = [];
  for (var task in tasks) {
    if (tasks[task].selected) {
      selectedtasks.push(tasks[task].name);
    }
  }  
  $http({
      method: 'post',
      url: '/data/updatetasks/'+selectedRequestId,
      data: {tasks: selectedtasks}
  }).success(function(data, status, headers, config) {
      console.log("tasks updated");
  }).error(function(data, status, headers, config) {
      console.log("error update tasks");
  });
}
  
dashboardApp.directive('myOnKeyDownCall', function ($http) {
    return function (scope, element, attrs) {
        element.bind('keyup', function (event) {
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
                    if (event.keyCode === 13) {
                        updatetasks(scope.tasks, $http);
                    }
                }
            }
            scope.$apply();
        });
    };
});

dashboardApp.controller('TaskController', function ($scope, $http) {
    $scope.taskitemclick = function (id) {
        $scope.tasks[id].selected = true;
        updatetasks($scope.tasks, $http);
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

dashboardApp.controller('navsidebar', function ($scope, $http) {
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
        refreshTable(id);
    };
    
    $http({
        method: 'GET',
        url: '/data/nsidebar'
    }).success(function(data, status, headers, config) {
        //data binding
        $scope.ndata = data;
    }).error(function(data, status, headers, config) {
        console.log("error get side bar data");
    });
});

dashboardApp.controller('dashboard', function ($scope, $http) {
    
    $scope.hidetable =  false;
    $scope.hiderequest = false;
    $scope.hideprimary = false;
    $scope.hidesuccess = true;
    $scope.hideaction = true;
    
    $scope.newrequestclick = function (id) {
        $scope.requestLevel = 0;
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
        //$scope.getdata();
        $scope.hidetableclick();
    };
    
    $scope.getdata = function () {
        if (selectedRequestId!==-1) {
            $http({
                method: 'GET',
                url: '/data/'+selectedRequestId
            }).success(function(data, status, headers, config) {
                $scope.requestLevel = 1 + requestStatus.indexOf(data.status);
                //data binding
                data.requestitems = JSON.parse(data.requestitems);
                $scope.data = data;
                if (null!=$scope.data.requesttasks) {
                    for (var task in $scope.tasks) {
                        if ($scope.data.requesttasks.indexOf($scope.tasks[task].name) > -1) {
                            $scope.tasks[task].selected = true;
                        } else {
                            $scope.tasks[task].selected = false;
                        }
                    }
                }
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
        $scope.data = {};
        selectedRequestId= -1;
        refreshTable(null);
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
          //console.log($scope.data);
        }
        if ($scope.requestLevel>0) {
          $scope.updateRequest();
        }
    };
    
    $scope.updateRequest = function() {
       $scope.message = 'به روز رسانی....';
       $http({
          method: 'post',
          url: '/data/updaterequest/',
          data: $scope.data
        }).success(function(data, status, headers, config) {
          console.log("update request  items OK");
          $scope.message = '';
        }).error(function(data, status, headers, config) {
          console.log("error update request items");
        });
    };
    
    $scope.insertbtnclick = function (id) {
        //console.log($scope.data);
        $http({
          method: 'post',
          url: '/data/insertrequest/',
          data: $scope.data
        }).success(function(data, status, headers, config) {
          console.log("insert request OK");
          refreshTable(null);
          $scope.backclick(id);
        }).error(function(data, status, headers, config) {
          console.log("error insert request");
        });
    }
    
    $scope.updatestatus = function (id) {
        $scope.data.status = requestStatus[id];
        var date = new Date();
        $scope.data.actiondate = gregorianToJalali(date , '/');
        $scope.data.actiontime = date.getHours() + ':' + date.getMinutes();
        $http({
          method: 'post',
          url: '/data/updatestatus/' + selectedRequestId,
          data: $scope.data
        }).success(function(data, status, headers, config) {
          console.log("update status OK");
          refreshTable(null);
          $scope.backclick(id);
        }).error(function(data, status, headers, config) {
          console.log("error update status");
        });
    }
    
    $scope.setUserIdName = function(index, val) {
        $scope.data.applicant = val;
    }
    
    $(function () {
        $('#requestsTable').on('all.bs.table', function (e, name, args) {
            //console.log('Event:', name, ', data:', args);
        })
        .on('click-row.bs.table', function (e, row, $element) {
        })
        .on('dbl-click-row.bs.table', function (e, row, $element) {
        })
        .on('sort.bs.table', function (e, name, order) {
        })
        .on('check.bs.table', function (e, row) {
            selectedRequestId = row.id;
            //console.log(selectedRequestId);
            $scope.getdata();
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
