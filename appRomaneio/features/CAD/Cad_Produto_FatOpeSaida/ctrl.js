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
        var CrudCad_Produto_FatOpeSaidaCtrl = (function (_super) {

            __extends(CrudCad_Produto_FatOpeSaidaCtrl, _super);
            function CrudCad_Produto_FatOpeSaidaCtrl($rootScope, api, CrudCad_Produto_FatOpeSaidaService, $q, $timeout, lista) {
                var _this = this;
                _super.call(this);
                this.AtualizarConsultaPorId = true; //Apos conformar um registro ele atualiza a consulta executendo uma pesquisa
                this.$rootScope = $rootScope;
                this.api = api;
                this.crudSvc = CrudCad_Produto_FatOpeSaidaService;
                this.lista = lista;
                ConfLookProduto();
                
                function ConfLookProduto() {
                    _this.data = [];
                    _this.selectedItem = null;
                    _this.searchText = null;
                    _this.querySearch = querySearch;
                    _this.selectedItemChange = selectedItemChange;                    
                }

                function selectedItemChange(item) {
                    if (item == null) {
                        _this.currentRecord.COD_PRODUTO = null;
                    } else {
                        _this.currentRecord.COD_PRODUTO = item.id;                       
                    }
                }

                function querySearch(query) {

                    _this.crudSvc.ProdutosLook(query).then(function (lista) {
                        _this.data = lista;
                    });

                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(_this.data);
                    }, Math.random() * 500, false);
                    return deferred.promise;
                }

                OperacaoSaidaLook();

                function OperacaoSaidaLook() {
                    _this.crudSvc.OperacaoSaidaLook().then(function (lista) {
                        _this.OperacaoSaidaLook = lista;
                    });
                }
            }  

            CrudCad_Produto_FatOpeSaidaCtrl.prototype.crud = function () {
                return "CAD_PRODUTO_FATOPESAIDA";
            };

            CrudCad_Produto_FatOpeSaidaCtrl.prototype.registroAtualizado = function () {
                if (this.currentRecord != null) {
                    this.data = [{ NOME: this.currentRecord.PRODUTO_NOME }];
                    this.searchText = this.currentRecord.PRODUTO_NOME;
                }
            }

            return CrudCad_Produto_FatOpeSaidaCtrl;
        })(Controllers.CrudBaseEditCtrl);
        Controllers.CrudCad_Produto_FatOpeSaidaCtrl = CrudCad_Produto_FatOpeSaidaCtrl;        

        App.modules.Controllers.controller('CrudCad_Produto_FatOpeSaidaCtrl', CrudCad_Produto_FatOpeSaidaCtrl);
        

    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=ctrl.js.map