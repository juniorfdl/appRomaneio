/// <reference path="../base.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        'use strict';
        /**
         * Implementa métodos utilitários para REST.
         */
        var Rest = (function () {
            function Rest() {
            }
            /**
             * Remove atributos `id` do objeto, recursivamente, para posterior salvamento de objetos
             * como se fosse uma inserção.
             *
             * @param dados Um objeto que pode conter uma propriedade ID, por exemplo, [[App.Services.ApiEntity]]
             */
            Rest.prototype.removerIds = function (dados) {
                var _this = this;
                if (angular.isObject(dados)) {
                    if (dados.id) {
                        delete dados.id;
                    }
                    Object.keys(dados).forEach(function (propertyName) {
                        _this.removerIds(dados[propertyName]);
                    });
                }
                //if (angular.isArray(dados)) {
                //    dados.forEach(item => {
                //        this.removerIds(item);
                //    });
                //}
                //else if (angular.isObject(dados)) {
                //    if (dados.id) {
                //        delete dados.id;
                //    }
                //    Object.keys(dados).forEach(propertyName => {
                //        this.removerIds(dados[propertyName]);
                //    });
                //}
                //Object.keys(dados).forEach(propName => {
                //    var item = dados[propName];
                //    if (angular.isArray(item)) {
                //        item.forEach(obj => this.removerIds(obj));
                //    }
                //});
                //var hasOwn = Object.prototype.hasOwnProperty;
                //for (var field in dados) {
                //    if (hasOwn.call(dados, field) && angular.isArray(dados[field])) {
                //        this.removerIds(dados[field]);
                //    }
                //}
                //for (var field in dados.filter(hasOwn, dados).filter(angular.isArray)) {
                //    removerIds(dados[field]);
                //}
            };
            return Rest;
        })();
        Infra.Rest = Rest;
        App.modules.Infra.service('rest', Rest);
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=rest.js.map