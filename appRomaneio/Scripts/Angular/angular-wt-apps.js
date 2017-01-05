// https://github.com/awerlang/angular-wt-apps
(function() {
    "use strict";
    var app = angular.module("wt.apps", []);
    var app = angular.module("wt.apps");
    app.directive("table", [ function() {
        return {
            restrict: "C",
            compile: function(element, attrs) {
                element.addClass("table-striped responsive");
            }
        };
    } ]);
    var app = angular.module("wt.apps");
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$templateRequest", [ "$delegate", "$templateCache", function($delegate, $templateCache) {
            return function(tpl) {
                var wasCachedBeforeRequest = !!$templateCache.get(tpl);
                var originalReturn = $delegate.apply(null, arguments);
                if (!wasCachedBeforeRequest) {
                    originalReturn.then(function() {
                        $templateCache.remove(tpl);
                    });
                }
                return originalReturn;
            };
        } ]);
    } ]);
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$interpolate", [ "$delegate", "$log", "$rootScope", function($delegate, $log, $rootScope) {
            return angular.extend(function interpolateDecorator() {
                var textToInterpolate = arguments[0].trim();
                var interpolationFn = $delegate.apply(this, arguments);
                if (!interpolationFn) return;
                return function() {
                    var result = interpolationFn.apply(this, arguments);
                    if (textToInterpolate) {
                        if (!result) {
                            $log.debug("$interpolate(", textToInterpolate, "): ", typeof result);
                        } else if ($rootScope.logAll) {
                            $log.debug("$interpolate(", textToInterpolate, "): ", result.trim());
                        }
                    }
                    return result;
                };
            }, $delegate);
        } ]);
    } ]);
    var app = angular.module("wt.apps");
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$exceptionHandler", [ "$delegate", "PanicMode", function($delegate, PanicMode) {
            return function $exceptionHandler(exception, cause) {
                PanicMode.reportError(exception);
                $delegate(exception, cause);
            };
        } ]);
    } ]);
    app.factory("PanicMode", [ "$window", function PanicMode($window) {
        function reportError(exception) {
            $window.alert(exception.reason || exception.message);
        }
        return {
            reportError: reportError            
        };
    } ]);
    var app = angular.module("wt.apps");
    app.filter("simnao", function() {
        return function SimNaoFilter(valor) {
            return valor == 1 ? "Sim" : "Não";
        };
    });
    var app = angular.module("wt.apps");
    app.directive("button", [ function() {
        return {
            restrict: "E",
            compile: function(element, attrs) {
                if (!attrs.type) {
                    attrs.$set("type", "button");
                }
            }
        };
    } ]);
    app.config([ "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common = {
            "X-Requested-With": "XMLHttpRequest"
        };
        $httpProvider.useApplyAsync(true);
    } ]);
    app.config([ "$locationProvider", function($locationProvider) {
        $locationProvider.html5Mode(true);
    } ]);
    app.run([ "$templateCache", "$document", function($templateCache, $document) {
        var view = $document.querySelectorAll("#ui-view")[0];
        if (view) {
            var tmplUrl = view.attributes["data-tmpl-url"].value;
            var tmplHtml = view.innerHTML;
            $templateCache.put(tmplUrl, tmplHtml);
        }
    } ]);
    app.run([ "$rootScope", "$injector", function($rootScope, $injector) {
        if (!$injector.has("$modalStack")) return;
        var $modalStack = $injector.get("$modalStack");
        $rootScope.$on("$locationChangeStart", function(event) {
            var top = $modalStack.getTop();
            if (top) {
                $modalStack.dismissAll();
                event.preventDefault();
            }
        });
    } ]);
    var app = angular.module("wt.apps");
    function FullPageSpinner(START_REQUEST, END_REQUEST) {
        return function(scope, element, attrs) {
            element[0].style.display = "none";
            scope.$on(START_REQUEST, function() {
                element[0].style.display = "";
            });
            scope.$on(END_REQUEST, function() {
                element[0].style.display = "none";
            });
        };
    }
    function SpinnerHttpInterceptor($q, $rootScope, START_REQUEST, END_REQUEST) {
        var numLoadings = 0;
        var skip = function(config) {
            return config.params && config.params.bg === true;
        };
        return {
            request: function(config) {
                if (!skip(config)) {
                    numLoadings++;
                    $rootScope.$broadcast(START_REQUEST);
                }
                return config || $q.when(config);
            },
            requestError: function(rejection) {
                if (--numLoadings === 0) {
                    $rootScope.$broadcast(END_REQUEST);
                }
                return $q.reject(rejection);
            },
            response: function(response) {
                if (!skip(response.config)) {
                    if (--numLoadings === 0) {
                        $rootScope.$broadcast(END_REQUEST);
                    }
                }
                return response || $q.when(response);
            },
            responseError: function(response) {
                if (!skip(response.config)) {
                    if (--numLoadings === 0) {
                        $rootScope.$broadcast(END_REQUEST);
                    }
                }
                return $q.reject(response);
            }
        };
    }
    app.constant("START_REQUEST", "START_REQUEST").constant("END_REQUEST", "END_REQUEST").directive("wtFullPageSpinner", [ "START_REQUEST", "END_REQUEST", FullPageSpinner ]).factory("spinnerHttpInterceptor", [ "$q", "$rootScope", "START_REQUEST", "END_REQUEST", SpinnerHttpInterceptor ]).config([ "$httpProvider", function($httpProvider) {
        $httpProvider.interceptors.push("spinnerHttpInterceptor");
    } ]);
})();