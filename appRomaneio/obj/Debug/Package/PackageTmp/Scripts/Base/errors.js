/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        'use strict';
        /**
         * Examina a resposta do servidor e extrai mensagens de erro.
         *
         * @factory TratarErroDaApi
         *
         * @param response  Objeto recebido em um bloco ng.IQService.catch().
         * @returns         Um array de mensagens extraídas do retorno, caso seja um retorno de erro tratável.
         */
        function TratarErroDaApi(response) {
            var mensagens = [];
            if (response.status === 400) {
                var data = response.data;
                if (typeof data === "string") {
                    mensagens.push(data);
                }
                else if (data.modelState) {
                    var modelState = data.modelState;
                    for (var item in modelState) {
                        if (item.charAt(0) !== "$") {
                            modelState[item].forEach(function (errorMsg) { return mensagens.push(errorMsg); });
                        }
                    }
                }
                else if (data.message) {
                    mensagens.push(data.message);
                }
            }
            return mensagens;
        }
        App.modules.Services
            .factory('TratarErroDaApi', function () { return TratarErroDaApi; });
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=errors.js.map