'use strict';

dashboardApp.controller('mapCont', function ($scope, itRequestService) {
    var iranmap = Snap('#iranmap');
    $scope.hidelabels = true;
    iranmap.attr({ viewBox : "0 0 1400 1250", width : 700, height : 625 });
    var hoverin = function (el) { Snap(el.target).animate({opacity:1.0, r:30}, 1000, mina.elastic)};
    var hoverout = function (el) { Snap(el.target).stop(); Snap(el.target).animate({opacity:0.5, r:25}, 200, mina.easeout)};
    var animateIndex = 0;
    var branch = null;
    var branches = [];
    function animOn(){
      if (animateIndex < branches.length) {
        branches[animateIndex].animate({
          opacity: '1',  
            r: 30
        }, 1000, mina.elastic, animOut);
      } else {
        $scope.hidelabels = false;
        $scope.$apply();
      }
    }
    function animOut() {
      branches[animateIndex].animate({
          opacity: '0.5',  
          r: 25
       }, 500, mina.easeout, animOn);
       animateIndex++;
    };
    Snap.load("images/iran.svg", function (f) {
      var allPaths = f.selectAll('path').attr({opacity:0.0});
      var index = 0;
      var xScale = 78;
      var yScale = 82;
      var x0 = 45;
      var y0 = 39.65;
      var x1 = 25;
      var y1 = 35;
      var max = allPaths.items.length - 1;
      var recursive = function () {
        if (index<max) {
          index++;
          allPaths[index].animate({opacity:1.0}, 20, mina.easeout, recursive);
        } else {
          allPaths[index].animate({opacity:1.0}, 20, mina.easeout, itRequestService.getcities(function (cities) {
            $scope.cities = cities;
            for(var i in cities) {
              branch = iranmap.circle(cities[i].x, cities[i].y, 0);
              branch.hover(hoverin, hoverout);//  
              branch.attr({
                  fill: "#bada55",
                  stroke: "#000",
                  opacity: '0.0',
                  strokeWidth: 10
              });
              branches.push(branch);
            }
            animOn();
          }));
        }
      }
      allPaths[index].animate({opacity:1.0}, 20, mina.easeout, recursive);
      iranmap.append(f);
      iranmap.append(Snap('#labels'));
    });

});