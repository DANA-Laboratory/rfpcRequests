'use strict';

var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngMask']);
var socket = io();

socket.on('update', function(data) {
    console.log("need referesh...");
});
socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));

dashboardApp.service('itRequestService', function($http){
    this.updatetasks = function(tasks) {
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
});
