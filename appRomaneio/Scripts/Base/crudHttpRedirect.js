/// <reference path="../base.ts" />
/// <reference path="popup.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        // TODO: renomear para tornar mais explícito o objetivo deste componente.
        // até porque ele não intercepta, apenas trata quando chamado
        /**
         * Identifica se um registro foi criado no servidor e exibe o registro na tela.
         *
         * @param response      Serviço de rotas ui-router.
         */
        function intercept($state) {
            return function (response, result) {
                if (App.Infra.PopupContext.current)
                    return;
                if (result.$status === 201) {
                    // TODO
                    // OLD: o parâmetro notify é false para contornar a validação de dirty 
                    // NOW: notify = true para que carregue corretamente o estado e evite 
                    // problemas na próxima mudança de estado, que recria a controller antiga
                    // isto recarrega os dados novamente
                    $state.go("^.edit", {
                        id: result.id
                    }, {
                        notify: !false,
                        inherit: false,
                        location: "replace"
                    });
                }
            };
        }
        App.modules.Infra.factory('intercept', intercept);
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=crudHttpRedirect.js.map