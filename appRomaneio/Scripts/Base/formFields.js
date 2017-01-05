/// <reference path="../base.ts" />
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        'use strict';
        var nextCtrlId = 1;
        var FIELDS_PRIORITY = 200;
        function discoverTopForm(el) {
            var topForm, parent = el;
            while (parent) {
                if (parent.tagName === 'FORM' || parent.tagName === 'NG-FORM' || parent.attributes['ng-form']) {
                    topForm = parent;
                }
                parent = parent.parentElement;
            }
            if (!topForm)
                throw new Error('Top form not found.');
            if (topForm.tagName !== 'FORM')
                throw new Error('Top form must be a FORM element.');
            return topForm;
        }
        function discoverParentForm(el) {
            var parentForm, parent = el;
            while (parent && !parentForm) {
                if (parent.tagName === 'FORM' || parent.tagName === 'NG-FORM' || parent.attributes['ng-form']) {
                    parentForm = parent;
                }
                parent = parent.parentElement;
            }
            if (!parentForm)
                throw new Error('Parent form not found.');
            return parentForm;
        }
        function replaceAttr(tElement, tAttrs, inputTag) {
            var label = tElement.find('label');
            //label.insertAdjacentHTML('beforeend',(<any>tAttrs).label);
            label.append(tAttrs.label);
            if (tAttrs.$attr.required /* || tAttrs.$attr.ngRequired*/) {
                //label.append('*');
                tElement.attr('required', true);
            }
            if (inputTag) {
                var input = tElement.find(inputTag);
                var ctrlId = 'c' + (nextCtrlId++).toString();
                label.attr('for', ctrlId);
                input.attr('id', ctrlId);
                angular.forEach(tAttrs.$attr, function (domName, angularName) {
                    var attrVal = tAttrs[angularName];
                    var parentAttrs = [/label/, /luarText/, /luarSelect/, /luarCheck/, /container[A-Z].*/, /ngRepeat/, /ngIf/];
                    if (parentAttrs.every(function (regex) { return !regex.test(angularName); })) {
                        input.attr(domName, attrVal !== "" ? attrVal : true);
                    }
                    switch (angularName) {
                        case "required":
                        case "name":
                            break;
                        case "containerClass":
                            tElement.addClass(attrVal);
                            break;
                        default:
                            tAttrs.$set(domName, null);
                            break;
                    }
                });
            }
        }
        function setupErrors(elements, attrs) {
            var errorList = elements[0].querySelector('.control--error-list');
            if (errorList && attrs.name) {
                var ctrlName = attrs.name, topForm = discoverTopForm(elements[0]), parentForm = discoverParentForm(elements[0]), topFormName = topForm ? topForm.attributes.name.value : '', parentFormName = parentForm ? (parentForm.attributes.name || parentForm.attributes['ng-form']).value : '';
                var returnEl = angular.element(errorList);
                returnEl.attr('show-error', parentFormName + "." + ctrlName);
                return returnEl;
            }
        }
        function Text($compile) {
            return {
                restrict: 'EA',
                priority: FIELDS_PRIORITY,
                terminal: true,
                template: function (element, attrs) {
                    if (attrs.append || attrs.prepend) {
                        return "\n                        <div class=\"\">\n                            <label class=\"control-label\"></label>\n                            <div class=\"input-group\">\n                                " + (attrs.prepend ? '<span class="input-group-addon">' + attrs.prepend + '</span>' : '') + "\n                                <input type=\"text\" class=\"form-control\">\n                                " + (attrs.append ? '<span class="input-group-addon">' + attrs.append + '</span>' : '') + "\n                            </div>\n                            <div class=\"control--error-list\"></div>\n                        </div>";
                    }
                    else {
                        return "\n                        <div class=\"\">\n                            <label class=\"control-label\"></label>\n                            <input type=\"text\" class=\"form-control\">\n                            <div class=\"control--error-list\"></div>\n                        </div>";
                    }
                },
                replace: true,
                compile: function (element, attrs) {
                    replaceAttr(element, attrs, 'input');
                    return function postLink(scope, element, attrs) {
                        var messagesEl = setupErrors(element, attrs);
                        $compile(element, null, FIELDS_PRIORITY)(scope);
                    };
                }
            };
        }
        Directives.Text = Text;
        function TextArea($compile) {
            return {
                restrict: 'EA',
                template: function (element, attrs) {
                    return "\n                        <div class=\"\">\n                            <label class=\"control-label\"></label>\n                            <textarea class=\"form-control\"></textarea>\n                            <div class=\"control--error-list\"></div>\n                        </div>";
                },
                replace: true,
                compile: function (element, attrs) {
                    replaceAttr(element, attrs, 'textarea');
                    return function postLink(scope, element, attrs) {
                        var messagesEl = setupErrors(element, attrs);
                        $compile(messagesEl)(scope);
                    };
                }
            };
        }
        Directives.TextArea = TextArea;
        function Select($compile) {
            return {
                priority: FIELDS_PRIORITY,
                terminal: true,
                restrict: 'EA',
                template: function (element, attrs) {
                    return "\n                <div class=\"\">\n                    <label class=\"control-label\"></label>\n                    <select class=\"form-control\" ng-model-options=\"{ allowInvalid: true }\">\n                        <option value=\"\">-</option>\n                    </select>\n                    <div class=\"control--error-list\"></div>\n                </div>";
                },
                replace: true,
                transclude: true,
                compile: function (element, attrs) {
                    replaceAttr(element, attrs, 'select');
                    return function postLink(scope, element, attrs, ctrls, transcludeFn) {
                        var messagesEl = setupErrors(element, attrs);
                        var selectTag = element.find('select');
                        var linkFn = $compile(element, null, FIELDS_PRIORITY);
                        linkFn(scope);
                        if (!attrs['ngOptions']) {
                            transcludeFn(function (clone, scope) {
                                selectTag.append(clone);
                            });
                        }
                    };
                }
            };
        }
        Directives.Select = Select;
        function CheckGroup() {
            return {
                restrict: 'EA',
                template: "\n               <div class=\"\">\n                    <label class=\"control-label\"></label>\n                    <div ng-transclude></div>\n                </div>",
                replace: true,
                transclude: true,
                compile: function (tElement, tAttrs) {
                    replaceAttr(tElement, tAttrs);
                    return function postLink(scope, iElement, iAttrs) { };
                }
            };
        }
        Directives.CheckGroup = CheckGroup;
        function Check($compile) {
            return {
                restrict: 'EA',
                template: "\n                <div class=\"checkbox\">\n                    <label><input type=\"checkbox\" ng-false-value=\"'0'\" ng-true-value=\"'1'\"></label>\n                </div>",
                replace: true,
                compile: function (element, attrs) {
                    replaceAttr(element, attrs, 'input');
                    return function postLink(scope, element, attrs) {
                        var messagesEl = setupErrors(element, attrs);
                        $compile(messagesEl)(scope);
                    };
                }
            };
        }
        Directives.Check = Check;
        App.modules.Directives
            .directive("luarText", Text)
            .directive("luarTextarea", TextArea)
            .directive("luarSelect", Select)
            .directive("luarCheckGroup", CheckGroup)
            .directive("luarCheck", Check);
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
//# sourceMappingURL=formFields.js.map