/// <reference path="../base.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        "use strict";
        /**
         * @private
         */
        function ApiInterceptor($q, toaster) {
            return {
                responseError: function (response) {
                    switch (response.status) {
                        case 401:
                            toaster.warning("Atenção", "Sem permissão para prosseguir com a operação.");
                            break;
                        case 404:
                        case 405:
                        case 500:
                            toaster.error("Atenção", "Ocorreu um erro durante a execução da última ação. O erro foi gravado para verificação.");
                            break;
                        case 503:
                            toaster.warning("Atenção", "O serviço web está desativado. Entre em contato com o administrador.");
                            break;
                        case 201:
                            toaster.warning("Atenção", "Operação executada com sucesso!");
                            break;

                    }
                    return $q.reject(response);
                }
            };
        }
        App.modules.Infra
            .factory('apiInterceptor', ApiInterceptor)
            .config(function ($httpProvider) {
            $httpProvider.interceptors.push('apiInterceptor');
        });
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=apiInterceptor.js.map