'use strict';

var itRequestApp = angular.module('itRequestApp', ['ngRoute']);

itRequestApp.directive('myOnKeyDownCall', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            console.log(event);
            if (event.key === 'Esc' || scope.filtertext.length > 2) {
                for (var item in scope.tasks) {
                    if (event.key === 'Enter' && scope.tasks[item].hide === false) {
                         scope.tasks[item].selected = true;
                    } else {
                        if (event.key === 'Esc' || scope.tasks[item].name.search(scope.filtertext) !== -1) {
                            scope.tasks[item].hide = false;
                        }
                        else {
                            scope.tasks[item].hide = true;
                        }
                    }
                }
                if (event.key === 'Esc' || event.key === 'Enter') {
                    scope.filtertext = '';
                }
            }
            scope.$apply();
        });
    };
});

itRequestApp.controller('TaskController', function ($scope) {
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

itRequestApp.controller('panelPrimary', function ($scope) {
    var date = new Date();
    $scope.currentDate = gregorianToJalali(date , '/');
    $scope.currentTime = date.getHours() + ':' + date.getMinutes();
});
