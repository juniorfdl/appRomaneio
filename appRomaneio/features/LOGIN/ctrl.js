var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        App.modules.Controllers.controller('LoginCtrl', function ($location, toaster, security, $scope, luarApp, $rootScope) {
            this.userName = localStorage.getItem("userName");
            this.password = "";
            this.Empresas = false;
            var _this = this;
            _this.EmpresaSelecionada = { CEMP : ""};

            this.login = function () {
                security.login(this.userName, this.password)
                    .then(function (result) {

                        if (_this.EmpresaSelecionada.CEMP != "") {
                            localStorage.setItem("userCEMP", _this.EmpresaSelecionada.CEMP);
                            localStorage.setItem("userEmpresa", _this.EmpresaSelecionada.FANTASIA);
                            $rootScope.currentUser.userEmpresa = _this.EmpresaSelecionada.FANTASIA;
                            $rootScope.currentUser.userCEMP = _this.EmpresaSelecionada.CEMP;
                            $location.path('/home');
                            toaster.clear();
                        }
                        else {
                            security.empresas($rootScope.currentUser.id).then(function (dados) {
                                var emp = dados;

                                if (emp.length == null || emp.length == 0) {
                                    toaster.warning("Atenção", "Usuário sem empresa de acesso!");
                                }
                                else if (emp.length > 1) {
                                    _this.Empresas = true;                                    
                                    _this.ListaEmpresas = emp;
                                    toaster.warning("Atenção", "Selecione uma Empresa!");
                                }
                                else 
                                {
                                    $location.path('/home');
                                    toaster.clear();
                                }
                            });
                        }

                    }, function (error) {
                        var mensagem = error[0];
                        if (mensagem) {
                            toaster.warning("Atenção", mensagem);
                        } else { toaster.warning("Atenção", "Usuário não encontrado"); }
                    });
            };
        })
       .controller('Error404Ctrl', function ($location, $window) {
           $scope.$on('$viewContentLoaded', function () {
               $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
           });
       });
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=ctrl.js.map