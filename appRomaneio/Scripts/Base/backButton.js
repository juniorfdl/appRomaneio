/// <reference path="base.js" />
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        'use strict';
        App.modules.Directives
            .directive('luarBackButton', function ($state) {
                return {
                    restrict: 'A',                    
                link: function luarBackButtonLink(scope, iElement, iAttrs) {
                    var href = $state.href("^.list");
                    iAttrs.$set("href", href);
                    iAttrs.$addClass("hidden-print");
                    iElement.text("Voltar para lista");
                }
            };
        });
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
//# sourceMappingURL=backButton.js.map