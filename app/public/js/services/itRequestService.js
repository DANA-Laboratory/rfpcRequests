'use strict';

var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngMask', 'ui.bootstrap']);
var socket = io();
 
socket.on('update', function(data) {
    console.log("need referesh...");
});
socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));

dashboardApp.service('itRequestService', function($http){
    var iranmap = Snap('#iranmap');
    var anim = function (el) { Snap(el.target).animate({opacity:0.2}, 200, mina.easein, function() {
          Snap(el.target).animate({opacity:1.0}, 200, mina.easeout)
      }); };
    Snap.load("images/iran.svg", function (f) {
      var allPaths = f.selectAll('path').attr({opacity:0.0});
      for (var aPath in allPaths.items){
        allPaths[aPath].mouseover(anim);//  
      }
      var index = 0;
      var xScale = 71.1;
      var yScale = 80;
      var x0 = 44.5;
      var y0 = 39.65;
      var x1 = 35;
      var y1 = 35;
      var max = allPaths.items.length - 1;
      var recursive = function () {
        if (index<max) {
          index++;
          allPaths[index].animate({opacity:1.0}, 20, mina.easeout, recursive);
        } else {
          allPaths[index].animate({opacity:1.0}, 20, mina.easeout, getcities(function (cities) {
            for(var i in cities) {
              var x = (cities[i].x - x0);
              var y = (y0 - cities[i].y);
              iranmap.circle(x * xScale - (x^2)*2.1 + x1, y * yScale + y1, 5);
              console.log((cities[i].x - x0) * xScale + x1,'-', (y0 - cities[i].y) * yScale + y1);
            }
          }));
        }
      }
      allPaths[index].animate({opacity:1.0}, 20, mina.easeout, recursive);
      iranmap.append(f);
    });
    
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

    var getcities = function(callback) {
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
          url: '/data/users/'
        }).success(function(data, status, headers, config) {
          console.log("get users OK");
          callback(data);
        }).error(function(data, status, headers, config) {
          console.log("error update request items");
        });
    };
});
