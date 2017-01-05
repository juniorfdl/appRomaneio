/// <reference path="Itens.html" />
/// <reference path="Itens.html" />
/// <reference path="../base.ts" />
/// <reference path="services.ts" />
/// <reference path="../tipoimovel/services.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        var CrudSis_UsuarioCtrl = (function (_super) {

            __extends(CrudSis_UsuarioCtrl, _super);
            function CrudSis_UsuarioCtrl($rootScope, api, CrudSis_UsuarioService, lista) {
                var _this = this;
                _super.call(this);
                
                this.$rootScope = $rootScope;
                this.api = api;
                this.crudSvc = CrudSis_UsuarioService;
                this.lista = lista;

                VendedorLook();

                function VendedorLook() {
                    _this.crudSvc.VendedorLook().then(function (lista) {
                        _this.VendedorLook = lista;
                    });
                }
            }  

            CrudSis_UsuarioCtrl.prototype.crud = function () {
                return "Sis_Usuario";
            };            

            return CrudSis_UsuarioCtrl;
        })(Controllers.CrudBaseEditCtrl);
        Controllers.CrudSis_UsuarioCtrl = CrudSis_UsuarioCtrl;        

        App.modules.Controllers.controller('CrudSis_UsuarioCtrl', CrudSis_UsuarioCtrl);
        

    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=ctrl.js.map