/// <reference path="../base.ts" />
/// <reference path="../infra/api.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var App;
(function (App) {
    var Services;
    (function (Services) {
        "use strict";
        var CrudCad_Cond_PagamentoService = (function (_super) {
            __extends(CrudCad_Cond_PagamentoService, _super);
            function CrudCad_Cond_PagamentoService() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CrudCad_Cond_PagamentoService.prototype, "baseEntity", {
                /// @override
                get: function () {
                    return 'Cad_Cond_Pagamento';
                },
                enumerable: true,
                configurable: true
            });
            CrudCad_Cond_PagamentoService.prototype.criarVazio = function () {
                return {
                    NOME: '',
                    id: 0
                };
            };

            return CrudCad_Cond_PagamentoService;
        })(Services.CrudBaseService);
        Services.CrudCad_Cond_PagamentoService = CrudCad_Cond_PagamentoService;
        App.modules.Services
            .service('CrudCad_Cond_PagamentoService', CrudCad_Cond_PagamentoService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map