

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

            function CrudRomaneioService($q, api) {
                _super.apply(this, arguments);

                this.apiview = api('VW_FAT_ROMANEIO_PAO');
                this.apiClientesLook = api('cad_colaborador/ClientesLook');
                this.apiCondPagamento = api('Cad_Cond_Pagamento');
                this.apiOperacaoSaida = api('Fat_Operacao_Saida');
                this.apiProdutosLook = api('cad_produto/ProdutosLook');


                this.ClientesLook = ClientesLook;
                this.CondPagamentoLook = CondPagamentoLook;
                this.OperacaoSaidaLook = OperacaoSaidaLook;
                this.ProdutosLook = ProdutosLook;
            }

            Object.defineProperty(CrudRomaneioService.prototype, "baseEntity", {
                /// @override
                get: function () {
                    return 'FAT_ROMANEIO_PAO';
                },
                enumerable: true,
                configurable: true
            });

            CrudRomaneioService.prototype.buscar = function (termoDePesquisa, pagina, campoOrdenacao, direcaoAsc, itensPorPagina, campoPesquisa) {
                var _this = this;
                debugger;
                if (termoDePesquisa === void 0) { termoDePesquisa = ''; }

                //if (campoOrdenacao == "CLIENTE_NOME") { campoOrdenacao = ""}

                var params = {
                    Empresa: '01',
                    termo: termoDePesquisa,
                    pagina: pagina,
                    itensPorPagina: itensPorPagina ? itensPorPagina : 20, //luarApp.ITENS_POR_PAGINA                    
                    campoOrdenacao: campoOrdenacao,
                    direcaoAsc: direcaoAsc,
                    campoPesquisa: campoPesquisa
                };

                return this.apiview.all(params);
            };

            function ClientesLook(fantasia) {
                return this.apiClientesLook.get(fantasia);
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
   
            return CrudRomaneioService;
        })(Services.CrudBaseService);
        Services.CrudRomaneioService = CrudRomaneioService;
        App.modules.Services
            .service('CrudRomaneioService', CrudRomaneioService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=services.js.map