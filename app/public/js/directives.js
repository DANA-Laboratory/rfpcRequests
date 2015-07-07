'use strict';

dashboardApp.directive('myOnKeyDownCall', function (itRequestService) {
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
                        itRequestService.updatetasks(scope.tasks);
                    }
                }
            }
            scope.$apply();
        });
    };
});
