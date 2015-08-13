'use strict';

dashboardApp.controller('mapCont', function ($scope, itRequestService) {

    var iranmap = Snap('#iranmap');
    var anim = function (el) { Snap(el.target).animate({opacity:0.2}, 200, mina.easein, function() {
          Snap(el.target).animate({opacity:1.0}, 200, mina.easeout)
      }); };
    Snap.load("images/iran.svg", function (f) {
      var allPaths = f.selectAll('path').attr({opacity:0.0});
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
          allPaths[index].animate({opacity:1.0}, 20, mina.easeout, itRequestService.getcities(function (cities) {
            for(var i in cities) {
              var x = (cities[i].x - x0);
              var y = (y0 - cities[i].y);
              var branches = iranmap.circle(x * xScale - (x^2)*2.1 + x1, y * yScale + y1, 15);
              branches.mouseover(anim);//  
              // By default its black, lets change its attributes
              branches.attr({
                  fill: "#bada55",
                  stroke: "#fff",
                  strokeWidth: 5
              });
            }
          }));
        }
      }
      allPaths[index].animate({opacity:1.0}, 20, mina.easeout, recursive);
      iranmap.append(f);
    });

});