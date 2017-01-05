/// <reference path="../base.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        App.modules.Infra.directive('menuItem', function ($rootScope, PermissoesService) {
            return {
                restrict: 'A',
                link: function menuItemLink(scope, element, attrs) {
                    element.addClass('btn');
                    function updatePermission() {
                        var permissao = PermissoesService.temPermissao(attrs['menuItem'], 'executar');
                        if (!permissao) {
                            element.addClass('disabled');
                        }
                        else {
                            element.removeClass('disabled');
                        }
                    }
                    updatePermission();
                    $rootScope.$on("PermissoesService:permissoes", function (event) {
                        updatePermission();
                    });
                }
            };
        });
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=menu.js.map