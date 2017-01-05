/// <reference path="base.js" />
var App;
(function (App) {
    App.modules.App.directive('table', function ($compile) {
        return {
            priority: 2001,
            terminal: true,
            restrict: 'E',
            compile: function (element, attrs) {
                element.attr('wt-responsive-table', '');
                return function (scope, element, attrs) {
                    var linkFunction = $compile(element, null, 2000);
                    linkFunction(scope);
                };
            }
        };
    });
    App.modules.App.directive('navbarDefault', function () {
        function linkFunction(scope, iElement, iAttrs) {
            var navbarCollapsed = true;
            scope.navData = {
                toggleCollapsed: function () {
                    navbarCollapsed = !navbarCollapsed;
                },
                isCollapsed: function () {
                    return navbarCollapsed;
                }
            };
            iElement.on('click', function (event) {
                var target = event.target;
                if (target.tagName === "A" && target.getAttribute('href') !== "#") {
                    navbarCollapsed = true;
                }
            });
        }
        return {
            restrict: 'C',
            link: linkFunction
        };
    });
    App.modules.App.directive('showError', function ($compile) {
        /*
         * TODO: ignorar se type=checkbox ou radio
         * TODO: verificar se aplicado em algo diferente de INPUT e SELECT
         */
        var discoverTopForm = function (el) {
            var topForm, parent = el;
            while (parent) {
                if (parent.tagName === 'FORM' || parent.tagName === 'NG-FORM' || parent.attributes && parent.attributes.ngForm) {
                    topForm = parent;
                }
                parent = parent.parentElement;
            }
            return topForm;
        };
        return {
            restrict: 'A',
            priority: 2001,
            terminal: true,
            link: function (scope, element, attrs) {
                var showError = attrs['showError'];
                element.attr('ng-messages', showError + '.$error');
                element.append('<ng-messages-include src="views/error-messages.html"/>');
                var topForm = discoverTopForm(element[0]);
                var ifExpr = (showError + ".$invalid && (") + (showError + ".$dirty") + (topForm ? " || " + topForm.name + ".$submitted" : '') + ")";
                element.attr('ng-if', ifExpr);
                element.removeAttr('show-error');
                $compile(element, null, 2000)(scope);
            }
        };
    });
    App.modules.App.directive('uiSelect', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (attrs.$attr.multiple)
                    return;
                ngModelCtrl.$validators['select'] = function (modelValue, viewValue) {
                    if (modelValue == null)
                        return true;
                    return viewValue && (typeof viewValue === 'number' || typeof viewValue.id === 'number' || viewValue.toAdd);
                };
            }
        };
    });
})(App || (App = {}));
//# sourceMappingURL=directives.js.map