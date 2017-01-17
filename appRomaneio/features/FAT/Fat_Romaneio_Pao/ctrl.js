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
        var CrudRomaneioCtrl = (function (_super) {

            __extends(CrudRomaneioCtrl, _super);
            function CrudRomaneioCtrl($location, $anchorScroll, $modal, $rootScope, api, CrudRomaneioService, lista, $timeout, $q, $scope) {
                var _this = this;
                _super.call(this);
                this.$location = $location;
                this.$anchorScroll = $anchorScroll;
                this.$modal = $modal;
                this.$rootScope = $rootScope;
                this.api = api;
                this.CrudRomaneioService = CrudRomaneioService;
                this.crudSvc = CrudRomaneioService;
                this.AtualizarConsultaPorId = true; //Apos conformar um registro ele atualiza a consulta executendo uma pesquisa
                CondPagamentoLook();
                OperacaoSaidaLook();
                TransportadoraLook();
                EntregadorLook();

                this.$rootScope.Cadastro = false;
                this.lista = lista;

                _this.data = [];
                _this.selectedItem = null;
                _this.searchText = null;
                _this.selectedItemChange = selectedItemChange;
                _this.removeItens = removeItens;
                _this.AddAlterItem = AddAlterItem;

                function selectedItemChange(item) {

                    if (_this.currentRecord != null) {
                        if (item == null) {
                            _this.currentRecord.CLIENTE_CODIGO = null;
                            _this.currentRecord.CLIENTE_NOME = null;
                            _this.currentRecord.COD_CADCOLABORADOR = null;
                        } else {
                            _this.currentRecord.CLIENTE_CODIGO = item.CODIGO;
                            _this.currentRecord.CLIENTE_NOME = item.FANTASIA;
                            _this.currentRecord.COD_CADCOLABORADOR = item.id;
                        }
                    }
                }

                this.querySearch = function (query) {

                    //if (query != this.currentRecord.CLIENTE_NOME) {
                    return _this.crudSvc.ClientesLook(query).then(function (response) {
                         return response;
                     })                    
                }
                
                function CondPagamentoLook() {
                    _this.crudSvc.CondPagamentoLook().then(function (lista) {
                        _this.CondPagamentoLook = lista;
                    });
                }

                function OperacaoSaidaLook() {
                    _this.crudSvc.OperacaoSaidaLook().then(function (lista) {
                        _this.OperacaoSaidaLook = lista;
                    });
                }

                function TransportadoraLook() {
                    _this.crudSvc.TransportadoraLook().then(function (lista) {
                        _this.TransportadoraLook = lista;
                    });
                }

                function EntregadorLook() {
                    _this.crudSvc.TransportadoraLook().then(function (lista) {
                        _this.EntregadorLook = lista;
                    });
                }

                function removeItens(posicao, SweetAlert) {
                    var _this = this;
                    SweetAlert.swal({
                        title: "Excluir este registro?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Sim, excluir!",
                        cancelButtonText: "Não, mudei de ideia"
                    }, function (isConfirm) {
                        if (isConfirm) {
                            _this.currentRecord.Itens.splice(posicao, 1);
                        }
                    });
                }

                function AddAlterItem(item) {
                    if (item == -1) {
                        _this.ItemSelecionado = null;

                        if (_this.currentRecord == null || _this.currentRecord.Itens == null) {
                            _this.ProximoItem = 1;
                            _this.currentRecord.Itens = [];
                        }
                        else
                            _this.ProximoItem = _this.currentRecord.Itens.length + 1;
                    }
                    else
                        _this.ItemSelecionado = _this.currentRecord.Itens[item];

                    var modalInstance = $modal.open({
                        templateUrl: 'Itens.html',
                        scope: $scope,
                        controller: 'ModalInstanceCtrl',
                        controllerAs: 'Ctrl'
                    });
                }

            }

            CrudRomaneioCtrl.prototype.prepararParaSalvar = function () {
                this.currentRecord.CFIL = '01';
                this.currentRecord.CEMP = this.$rootScope.currentUser.userCEMP;
            };

            CrudRomaneioCtrl.prototype.crud = function () {
                return "FAT_ROMANEIO_PAO";
            };
        
            CrudRomaneioCtrl.prototype.registroAtualizado = function () {
                if (this.currentRecord != null) {
                    this.data = [{ FANTASIA: this.currentRecord.CLIENTE_NOME }];
                    this.searchText = this.currentRecord.CLIENTE_NOME;

                    if (this.currentRecord.id == null) {
                        this.currentRecord.VENDEDOR = localStorage.getItem("VENDEDOR");
                        this.currentRecord.COD_CADVENDEDOR = localStorage.getItem("COD_CADVENDEDOR");
                        this.currentRecord.TIPO_FRETE = "C";
                    }
                }
            }
                 
            return CrudRomaneioCtrl;
        })(Controllers.CrudBaseEditCtrl);
        Controllers.CrudRomaneioCtrl = CrudRomaneioCtrl;

        var ModalInstanceCtrl = function ($scope, $modalInstance, $q, $timeout) {

            $scope.ItemSelecionado = $scope.$parent.ctrl.ItemSelecionado;
            $scope.OperacaoSaidaLook = $scope.$parent.ctrl.OperacaoSaidaLook;
            var currentRecord = $scope.$parent.ctrl.currentRecord;

            var Novo = $scope.ItemSelecionado == null;

            $scope.selectedItemProduto = null;
            $scope.querySearchProduto = querySearchProduto;
            $scope.selectedItemChangeProduto = selectedItemChangeProduto;

            if (Novo) {
                $scope.dataProduto = [];
                $scope.searchTextProduto = null;
                $scope.ItemSelecionado = {};
                $scope.ItemSelecionado.ITEM = $scope.$parent.ctrl.ProximoItem;
            }
            else {
                $scope.dataProduto = [{ NOME: $scope.ItemSelecionado.PRODUTO }];
                $scope.searchTextProduto = $scope.ItemSelecionado.PRODUTO;
            }            

            function querySearchProduto (query) {
                return $scope.$parent.ctrl.crudSvc.ProdutosLook(query).then(function (response) {
                    return response;
                })
            }

            function selectedItemChangeProduto(item) {
                if (item == null) {
                    $scope.ItemSelecionado.COD_CADPRODUTO = null;
                    $scope.ItemSelecionado.PRODUTO = null;
                    $scope.ItemSelecionado.COD_CADUNIDADE = null;

                } else {
                    $scope.ItemSelecionado.COD_CADPRODUTO = item.id;
                    $scope.ItemSelecionado.PRODUTO = item.NOME;
                    $scope.ItemSelecionado.COD_CADUNIDADE = item.COD_CADUNIDADE;

                    if (item.CODIGO != null) {
                        GetPreco(item.CODIGO,
                        currentRecord.DATA_EMISSAO,
                        $scope.$parent.$root.currentUser.userCEMP,
                        currentRecord.COD_CADCONDPAGAMENTO,
                        currentRecord.CLIENTE_CODIGO);
                    }
                }
            }

            function GetPreco(PRODUTO, DATA, CEMP, CONDICAO_PAGAMENTO, COD_CLIENTE) {
                $scope.$parent.ctrl.crudSvc.GetPreco(PRODUTO, DATA, CEMP, CONDICAO_PAGAMENTO, COD_CLIENTE)
                    .then(function (dadospreco) {
                        $scope.ItemSelecionado.VALOR_UNITARIO = dadospreco;
                    });
            }

            $scope.ok = function () {

                if (Novo) {
                    $scope.$parent.ctrl.currentRecord.Itens.push($scope.ItemSelecionado);
                }

                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        App.modules.Controllers.controller('CrudRomaneioCtrl', CrudRomaneioCtrl);
        App.modules.Controllers.controller('ModalInstanceCtrl', ModalInstanceCtrl);

    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=ctrl.js.map