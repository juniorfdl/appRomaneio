

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
        var CrudCad_Produto_FatOpeSaidaService = (function (_super) {
            __extends(CrudCad_Produto_FatOpeSaidaService, _super);

            function CrudCad_Produto_FatOpeSaidaService($q, api) {
                _super.apply(this, arguments);
                this.apiProdutosLook = api('cad_produto/ProdutosLook');
                this.OperacaoSaidaLook = OperacaoSaidaLook;
                this.ProdutosLook = ProdutosLook;
            }

            function ProdutosLook(NOME) {
                return this.apiProdutosLook.get(NOME);
            }

            Object.defineProperty(CrudCad_Produto_FatOpeSaidaService.prototype, "baseEntity", {
                /// @override
                get: function () {
                    return 'CAD_PRODUTO_FATOPESAIDA';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CrudCad_Produto_FatOpeSaidaService.prototype, "baseEntityConsulta", {
                /// @override
                get: function () {
                    return 'V_CAD_PRODUTO_FATOPESAIDA';
                },
                enumerable: true,
                configurable: true
            });

            function OperacaoSaidaLook() {
                var params = { Empresa: '', campoOrdenacao: 'NOME', direcaoAsc: true };                
                return this.api.allLook(params, 'Fat_Operacao_Saida');
            }
   
            return CrudCad_Produto_FatOpeSaidaService;
        })(Services.CrudBaseService);
        Services.CrudCad_Produto_FatOpeSaidaService = CrudCad_Produto_FatOpeSaidaService;
        App.modules.Services
            .service('CrudCad_Produto_FatOpeSaidaService', CrudCad_Produto_FatOpeSaidaService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map