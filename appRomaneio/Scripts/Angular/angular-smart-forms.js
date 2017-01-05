// https://github.com/awerlang/angular-smart-forms
(function() {
    var KEYS = {
        RETURN: 13,
        SPACE: 32,
        PLUS: 43,
        COMMA: 44,
        MINUS: 45,
        DOT: 46
    };
    function isItMobile() {
        return "ontouchstart" in document.documentElement && window.innerWidth < 768;
    }
    function map(array, callbackFn) {
        return Array.prototype.map.call(array, callbackFn);
    }
    function find(element, selector) {
        return angular.element(map(element, function(item) {
            return item.querySelector(selector);
        }));
    }
    function findNextTabStop(el, parent) {
        var universe = (parent || document).querySelectorAll("input, button, select, textarea, a[href]");
        var list = Array.prototype.filter.call(universe, function(item) {
            return item.tabIndex >= "0";
        });
        var index = list.indexOf(el);
        return list[index + 1] || list[0];
    }
    function tabToNext(currentElement, parent) {
        var nextElement = findNextTabStop(currentElement);
        if (nextElement) {
            nextElement.focus();
        }
    }
    function smartForm() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.on("input", tabOnMaxLength);
                element.on("keydown", tabOnEnter);
                function tabOnMaxLength(event) {
                    var maxLength = event.target.maxLength;
                    if (maxLength && event.target.value.length === maxLength) {
                        tabToNext(event.target, element[0]);
                    }
                }
                function tabOnEnter(event) {
                    if (event.which === KEYS.RETURN) {
                        var el = event.target;
                        switch (el.tagName) {
                          case "INPUT":
                            if (el.type === "submit" || el.type === "button") return;

                          case "SELECT":
                            tabToNext(event.target, element[0]);
                            event.preventDefault();
                            break;
                        }
                    }
                }
            }
        };
    }
    function autoFocus() {
        if (isItMobile()) return {};
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                if (angular.isDefined(attrs["uiView"])) {
                    scope.$on("$viewContentLoaded", setFocusOnPartialLoaded);
                } else {
                    scope.$on("$includeContentLoaded:focus", setFocusOnPartialIncluded);
                }
                if (element[0].tagName === "FORM") {
                    element.on("submit", setFocusOnFormSubmit);
                }
                function setFocus(selector, sourceElement) {
                    scope.$applyAsync(function() {
                        var firstElement = (sourceElement || element)[0].querySelector(selector);
                        if (firstElement) {
                            firstElement.focus();
                        }
                    });
                }
                function setFocusOnPartialIncluded(event, data) {
                    setFocus([ "input:not([disabled])", "select:not([disabled])", "fieldset:not([disabled]) input:not([disabled])", "fieldset:not([disabled]) select:not([disabled])" ].join(","), data.sourceElement);
                }
                function setFocusOnPartialLoaded() {
                    setFocus([ "input:not([disabled])", "select:not([disabled])", "fieldset:not([disabled]) input:not([disabled])", "fieldset:not([disabled]) select:not([disabled])" ].join(","));
                }
                function setFocusOnFormSubmit() {
                    setFocus(".ng-invalid");
                }
            }
        };
    }
    function ngIncludeFocus() {
        if (isItMobile()) return {};
        return {
            link: function(scope, element) {
                scope.$emit("$includeContentLoaded:focus", {
                    sourceElement: element
                });
            }
        };
    }
    function isoDate() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function isoDateParser(value) {
                    if (angular.isDate(value)) {
                        return value.toISOString().substring(0, 10) + "T00:00:00.000Z";
                    }
                    return value;
                });
                ngModelCtrl.$formatters.push(function isoDateFormatter(value) {
                    if (angular.isString(value)) {
                        var regex = /(\d{4})-(\d{2})-(\d{2})T?.*/;
                        var dateParts = regex.exec(value);
                        if (dateParts) {
                            return new Date(parseInt(dateParts[1], 10), parseInt(dateParts[2], 10) - 1, parseInt(dateParts[3], 10));
                        }
                    }
                    return value;
                });
            }
        };
    }
    function isoDateFilter($filter) {
        var dateFilter = $filter("date");
        return function(date, format) {
            return dateFilter(date, format || "shortDate", "UTC");
        };
    }
    function numberInput() {
        return {
            restrict: "A",
            priority: 1,
            require: "ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                element.attr("type", "text");
                ngModelCtrl.$parsers.unshift(function(value) {
                    if (value == null) return value;
                    if (value.trim() === "") return null;
                    return parseToModel(value);
                });
                ngModelCtrl.$formatters.unshift(function(value) {
                    if (value == null) return value;
                    return formatWithDecimalSep(formatWithThousandSep(value));
                });
                element.on("focusout", function(e) {
                    var inputVal = element.val();
                    if (inputVal === "") return;
                    element.val(formatWithDecimalSep(inputVal));
                });
                element.on("input", function(e) {
                    var inputVal = element.val();
                    var res = formatOnInput(inputVal);
                    if (inputVal === res) return;
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(res);
                        ngModelCtrl.$render();
                    });
                });
            }
        };
    }
    function splice(intPart, idx, rem, s) {
        return intPart.slice(0, idx) + s + intPart.slice(idx + Math.abs(rem));
    }
    function formatWithThousandSep(nStr) {
        nStr += "";
        var x = nStr.split(".");
        var x1 = x[0];
        var x2 = x.length > 1 ? "," + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, "$1" + "." + "$2");
        }
        return x1 + x2;
    }
    function formatWithDecimalSep(value) {
        var regex = /\,(\d*)/;
        var result = regex.exec(value);
        var decPart = 2 - (result ? result[1].length : 0);
        if (result && result[0] == null) value = "0" + value;
        if (result === null) value += ",";
        while (decPart-- > 0) value += "0";
        return value;
    }
    function parseToModel(value) {
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
    }
    function formatOnInput(value) {
        var inputVal = value.trim();
        while (inputVal.charAt(0) === "0" && inputVal.charAt(0) !== ",") {
            inputVal = inputVal.substr(1);
        }
        if (inputVal.charAt(0) === ",") inputVal = "0" + inputVal;
        inputVal = inputVal.replace(/[^\d.\',']/g, "");
        var point = inputVal.indexOf(",");
        if (point >= 0) {
            inputVal = inputVal.slice(0, point + 3);
        }
        var decimalSplit = inputVal.split(",");
        var intPart = decimalSplit[0];
        var decPart = decimalSplit[1];
        intPart = intPart.replace(/[^\d]/g, "");
        if (intPart.length > 3) {
            var intDiv = Math.floor(intPart.length / 3);
            while (intDiv > 0) {
                var lastComma = intPart.indexOf(".");
                if (lastComma < 0) {
                    lastComma = intPart.length;
                }
                if (lastComma - 3 > 0) {
                    intPart = splice(intPart, lastComma - 3, 0, ".");
                }
                intDiv--;
            }
        }
        if (decPart === undefined) {
            decPart = "";
        } else {
            decPart = "," + decPart;
        }
        var res = intPart + decPart;
        return res;
    }
    function numpadInput() {
        return {
            link: function(scope, element, attrs) {
                var selector = element.attr("wt-numpad"), input = selector ? find(element, selector) : element;
                input.attr("type", "number").addClass("wt-numpad");
                input.on("keypress", function(event) {
                    switch (event.which) {
                      case KEYS.PLUS:
                      case KEYS.COMMA:
                      case KEYS.MINUS:
                      case KEYS.DOT:
                        event.preventDefault();
                        break;
                    }
                });
            }
        };
    }
    function modelIsError() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$validators["modelIsError"] = function(modelValue, viewValue) {
                    return modelValue !== true;
                };
            }
        };
    }
    "use strict";
    angular.module("wt.smart", []).directive("wtAutoFocus", [ autoFocus ]).directive("ngInclude", [ ngIncludeFocus ]).directive("wtSmartForm", [ smartForm ]).directive("wtIsoDate", [ isoDate ]).filter("wtIsoDate", [ "$filter", isoDateFilter ]).directive("wtNumber", [ numberInput ]).directive("wtNumpad", [ numpadInput ]).directive("wtModelIsError", [ modelIsError ]);
})();