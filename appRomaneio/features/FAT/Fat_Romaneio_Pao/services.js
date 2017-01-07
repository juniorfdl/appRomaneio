

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
        var CrudRomaneioService = (function (_super) {
            __extends(CrudRomaneioService, _super);

            function CrudRomaneioService($q, api, $rootScope) {
                _super.apply(this, arguments);
                this.$rootScope = $rootScope;
                this.apiCondPagamento = api('Cad_Cond_Pagamento');
                this.apiOperacaoSaida = api('Fat_Operacao_Saida');
                this.apiProdutosLook = api('cad_produto/ProdutosLook');

                this.ClientesLook = ClientesLook;
                this.CondPagamentoLook = CondPagamentoLook;
                this.OperacaoSaidaLook = OperacaoSaidaLook;
                this.ProdutosLook = ProdutosLook;
                this.TransportadoraLook = TransportadoraLook;
            }            
            
            Object.defineProperty(CrudRomaneioService.prototype, "filtrosBase", {
                /// @override
                get: function () {
                    
                    try {
                        if (this.$rootScope.currentUser.ADMIN == "S")
                            return null;
                        else
                            return [{ NOME: "COD_CADVENDEDOR", VALOR: this.$rootScope.currentUser.COD_CADVENDEDOR }];
                    }
                    catch (err) {
                        return null;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CrudRomaneioService.prototype, "baseEntity", {
                /// @override
                get: function () {
                    return 'FAT_ROMANEIO_PAO';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(CrudRomaneioService.prototype, "baseEntityConsulta", {
                /// @override
                get: function () {
                    return 'VW_FAT_ROMANEIO_PAO';
                },
                enumerable: true,
                configurable: true
            });

            function ClientesLook(fantasia) {                
                var param = { FANTASIA: fantasia };
                return this.api.allLook(param, 'cad_colaborador/ClientesLook');
            }

            function ProdutosLook(Nome) {
                return this.apiProdutosLook.get(Nome);
            }

            function CondPagamentoLook() {
                var params = { Empresa: '', campoOrdenacao: 'id', direcaoAsc: true };

                return this.apiCondPagamento.all(params);
            }

            function OperacaoSaidaLook() {
                var params = { Empresa: '', campoOrdenacao: 'NOME', direcaoAsc: true };

                return this.apiOperacaoSaida.all(params);
            }

            function TransportadoraLook() {
                var params = { CEMP: this.$rootScope.currentUser.userCEMP, TCLI: 'T' };
                return this.api.allLook(params, 'cad_colaborador/Tipo');
            }
           return CrudRomaneioService;
        })(Services.CrudBaseService);
        Services.CrudRomaneioService = CrudRomaneioService;
        App.modules.Services
            .service('CrudRomaneioService', CrudRomaneioService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map