'use strict';

var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngMask', 'ui.bootstrap']);
var socket = io();
 
socket.on('update', function(data) {
    console.log("need referesh...");
});
socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));

dashboardApp.service('itRequestService', function($http){
    
    this.updatetasks = function(callback, tasks) {
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
          callback();
      }).error(function(data, status, headers, config) {
          console.log("error update tasks");
      });
    };

    this.getcities = function(callback) {
      $http({
          method: 'GET',
          url: '/map/irancities'
      }).success(function(data, status, headers, config) {
          callback(data);
      }).error(function(data, status, headers, config) {
          console.log("error get side bar data");
      });
    };
    
    this.refereshnavbar = function(callback) {
      $http({
          method: 'GET',
          url: '/data/nsidebar'
      }).success(function(data, status, headers, config) {
          //data binding
          callback(data);
      }).error(function(data, status, headers, config) {
          console.log("error get side bar data");
      });
    };
    
    this.refreshTable = function (id) {
        if (null==id) {
            $('#requestsTable').bootstrapTable('refresh', {url: '/data/table'});
        } else {
            $('#requestsTable').bootstrapTable('refresh', {url: '/data/table/' + id});
        }
    }
    
    this.getdata = function (callback) {
        if (selectedRequestId!==-1) {
            $http({
                method: 'GET',
                url: '/data/'+selectedRequestId
            }).success(function(data, status, headers, config) {
                data.requestitems = JSON.parse(data.requestitems);
                callback(data);
            }).error(function(data, status, headers, config) {
                console.log("error get");
            });
        }
    };
  
    this.updatestatus = function (callback, data) {
        $http({
          method: 'post',
          url: '/data/updatestatus/' + selectedRequestId,
          data: data
        }).success(function(data, status, headers, config) {
          console.log("update status OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error update status");
        });
    };
    
    this.insertrequest = function (callback, data) {
        $http({
          method: 'post',
          url: '/data/insertrequest/',
          data: data
        }).success(function(data, status, headers, config) {
          console.log("insert request OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error insert request");
        });
    };
    
    this.updaterequest = function (callback, data) {
        $http({
          method: 'post',
          url: '/data/updaterequest/',
          data: data
        }).success(function(data, status, headers, config) {
          console.log("update request  items OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error update request items");
        });
    };
    
    this.getusers = function (callback) {
        $http({
          method: 'get',
          url: '/admin/select/users/'
        }).success(function(data, status, headers, config) {
          callback(data);
        }).error(function(data, status, headers, config) {
          console.log("error update request items");
        });
    };
    
    this.updateuser = function (data, callback) {
        $http({
          method: 'post',
          url: '/admin/update/user',
          data: data
        }).success(function(data, status, headers, config) {
          console.log("update user account OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error update user account");
        });
    };

    this.deleteuser = function (data, callback) {
        $http({
          method: 'post',
          url: '/admin/delete/user',
          data: data
        }).success(function(data, status, headers, config) {
          console.log("delete user account OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error delete user account");
        });
    };
    
    this.insertuser = function (data, callback) {
        $http({
          method: 'post',
          url: '/admin/insert/user',
          data: data
        }).success(function(data, status, headers, config) {
          console.log("insert user account OK");
          callback();
        }).error(function(data, status, headers, config) {
          console.log("error insert user account");
        });
    };
});
