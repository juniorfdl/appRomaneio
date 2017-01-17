/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        "use strict";
        var PermissoesService = (function () {
            function PermissoesService($rootScope, api, security) {
                this.$rootScope = $rootScope;
                this.api = api;
                this.security = security;
                this.permissoesDoUsuario = [];
            }
            PermissoesService.prototype.obterPermissoes = function () {
                //var _this = this;
                //if (!this.security.isAuthenticated())
                //    return false;
                //this.api('Menu').query('Operacoes')
                //    .then(function (result) {
                //    _this.permissoesDoUsuario = result;
                //    _this.$rootScope.$emit("PermissoesService:permissoes");
                //});
                return true;
            };
            PermissoesService.prototype.temPermissao = function (funcionalidade, op1, op2) {
                //var yes = _.indexOf(this.permissoesDoUsuario, funcionalidade + '/' + op1) >= 0 ||
                //    _.indexOf(this.permissoesDoUsuario, funcionalidade + '/' + op2) >= 0;
                return true;
            };
            return PermissoesService;
        })();
        Services.PermissoesService = PermissoesService;
        App.modules.Services
            .service('PermissoesService', PermissoesService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=permissoesservice.js.map