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
                this.AtualizarConsultaPorId = true;
                CondPagamentoLook();
                OperacaoSaidaLook();

                this.$rootScope.Cadastro = false;
                this.lista = lista;

                _this.data = [];
                _this.selectedItem = null;
                _this.searchText = null;
                _this.querySearch = querySearch;
                _this.selectedItemChange = selectedItemChange;
                _this.removeItens = removeItens;
                _this.AddAlterItem = AddAlterItem;

                function selectedItemChange(item) {
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

                function querySearch(query) {

                    _this.crudSvc.ClientesLook(query).then(function (lista) {
                        _this.data = lista;
                    });

                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(_this.data);
                    }, Math.random() * 500, false);
                    return deferred.promise;
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

                function removeItens(posicao, SweetAlert) {
                    debugger;
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
                    }
                }                
            }            

            return CrudRomaneioCtrl;
        })(Controllers.CrudBaseEditCtrl);
        Controllers.CrudRomaneioCtrl = CrudRomaneioCtrl;

        var ModalInstanceCtrl = function ($scope, $modalInstance, $q, $timeout) {
            
            $scope.ItemSelecionado = $scope.$parent.ctrl.ItemSelecionado;
            $scope.OperacaoSaidaLook = $scope.$parent.ctrl.OperacaoSaidaLook;

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
            else
            {
                $scope.dataProduto = [{ NOME: $scope.ItemSelecionado.PRODUTO }];
                $scope.searchTextProduto = $scope.ItemSelecionado.PRODUTO;             
            }                        

            function querySearchProduto(query) {

                debugger;

                $scope.$parent.ctrl.crudSvc.ProdutosLook(query).then(function (lista) {
                    $scope.dataProduto = lista;
                });

                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve($scope.dataProduto);
                }, Math.random() * 500, false);
                return deferred.promise;
            }

            function selectedItemChangeProduto(item) {
                debugger;
                if (item == null) {
                    $scope.ItemSelecionado.COD_CADPRODUTO = null;
                    $scope.ItemSelecionado.PRODUTO = null;
                    $scope.ItemSelecionado.COD_CADUNIDADE = null;

                } else {
                    $scope.ItemSelecionado.COD_CADPRODUTO = item.id;
                    $scope.ItemSelecionado.PRODUTO = item.NOME;
                    $scope.ItemSelecionado.COD_CADUNIDADE = item.COD_CADUNIDADE
                }
            }
            

            $scope.ok = function () {
                debugger;

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