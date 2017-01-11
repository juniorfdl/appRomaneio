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
            function CrudSis_UsuarioCtrl($location, $anchorScroll, $modal, $rootScope, api, CrudSis_UsuarioService, lista, $timeout, $q, $scope) {
                var _this = this;
                _super.call(this);

                this.$location = $location;
                this.$anchorScroll = $anchorScroll;
                this.$modal = $modal;
                this.$rootScope = $rootScope;

                this.api = api;
                this.crudSvc = CrudSis_UsuarioService;
                this.lista = lista;
                _this.removeItens = removeItens;
                _this.AddAlterItem = AddAlterItem;

                VendedorLook();
                EmpresaLook();

                function VendedorLook() {
                    _this.crudSvc.VendedorLook().then(function (lista) {
                        _this.VendedorLook = lista;
                    });
                }

                function EmpresaLook() {
                    _this.crudSvc.EmpresaLook().then(function (lista) {
                        _this.EmpresaLook = lista;
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
                            _this.currentRecord.Empresas.splice(posicao, 1);
                        }
                    });
                }

                function AddAlterItem() {
                    _this.ItemSelecionado = null;

                    if (_this.currentRecord == null || _this.currentRecord.Empresas == null) {
                        _this.currentRecord.Empresas = [];
                    }

                    var modalInstance = $modal.open({
                        templateUrl: 'Itens.html',
                        scope: $scope,
                        controller: 'ModalUsuarioEmpresaCtrl',
                        controllerAs: 'Ctrl'
                    });
                }
            }

            CrudSis_UsuarioCtrl.prototype.crud = function () {
                return "Sis_Usuario";
            };

            return CrudSis_UsuarioCtrl;
        })(Controllers.CrudBaseEditCtrl);
        Controllers.CrudSis_UsuarioCtrl = CrudSis_UsuarioCtrl;

        var ModalUsuarioEmpresaCtrl = function ($scope, $modalInstance, $q, $timeout) {

            $scope.ItemSelecionado = {};
            $scope.NovoItem = {};
            $scope.EmpresaLook = $scope.$parent.ctrl.EmpresaLook;
            var Novo = true;                  
            
            $scope.ok = function () {
                var i;
                for (i = 0; i < $scope.$parent.ctrl.currentRecord.Empresas.length - 1; i++) {
                    if ($scope.NovoItem.id == $scope.$parent.ctrl.currentRecord.Empresas[i].CODIGOEMPRESA) {
                        $scope.$parent.ctrl.toaster.success("Atencao", "Registro ja esta na lista!");
                        return null;
                    }
                }

                $scope.ItemSelecionado.CODIGOEMPRESA = $scope.NovoItem.id;
                $scope.ItemSelecionado.CEMP = $scope.NovoItem.CEMP;
                $scope.ItemSelecionado.FANTASIA = $scope.NovoItem.FANTASIA;
                $scope.$parent.ctrl.currentRecord.Empresas.push($scope.ItemSelecionado);            
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        App.modules.Controllers.controller('CrudSis_UsuarioCtrl', CrudSis_UsuarioCtrl);
        App.modules.Controllers.controller('ModalUsuarioEmpresaCtrl', ModalUsuarioEmpresaCtrl);


    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=ctrl.js.map