var App;
(function (App) {
    'use strict';
    var modules = (function () {
        function modules() {
        }
        modules.Init = angular.module('app.init', []);
        modules.Infra = angular.module('app.infra', []);
        modules.Filters = angular.module('app.filters', []);
        modules.Directives = angular.module('app.directives', []);
        modules.Services = angular.module('app.services', []);
        modules.Controllers = angular.module('app.controllers', []);
        modules.App = angular.module('app', ['ngAnimate', 'ngMessages', 'ngLocale',
            'app.init', 'ui.router', 'ui.bootstrap', 'ui.select',
            'unsavedChanges',  'oitozero.ngSweetAlert', 'toaster',  'wt.easy', 'wt.apps', 'wt.smart', 'wt.responsive', 'ngCpfCnpj', 
            'app.infra', 'app.filters', 'app.services', 'app.directives', 'app.controllers',
            'ngMaterial', 'material.svgAssetsCache'
        ]);
        return modules;
    })();
    App.modules = modules;
})(App || (App = {}));
var App;
(function (App) {
    'use strict';
})(App || (App = {}));


//'angularFileUpload', 'as.sortable',