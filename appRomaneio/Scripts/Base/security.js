/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        var cachedCredentials = {
            userName: "",
            password: ""
        };
        // TODO revisar implementação
        // source: https://github.com/amcdnl/angularpreso
        App.modules.Services.factory('security', function ($http, $window, $rootScope, $modal, api, luarApp) {
            var service = {
                login: function (userName, password) {
                    
                    cachedCredentials.userName = userName;
                    cachedCredentials.password = password;

                    var request = api("sis_usuario").query("localizar", { NOME: userName, PWD: password });

                    return request.then(function (response) {
                        try {
                            localStorage.setItem("luarusr", userName);
                            localStorage.setItem("luarpass", password);
                            localStorage.setItem("ADMIN", response.ADMIN);
                            localStorage.setItem("VENDEDOR", response.VENDEDOR);
                            localStorage.setItem("COD_CADVENDEDOR", response.COD_CADVENDEDOR);
                            $rootScope.ADMIN = response.ADMIN == "S";
                        }
                        catch (e) {
                        }

                        service.currentUser = response;
                        $rootScope.currentUser = service.currentUser;
                        $rootScope.$emit("security:login");
                        return service.isAuthenticated();
                    });

                },
                logout: function () {
                   
                    localStorage.clear();
                    cachedCredentials.userName = "";
                    cachedCredentials.password = "";
                    service.currentUser = null;
                    $rootScope.currentUser = service.currentUser;
                    $window.location.assign('login');
                    $rootScope.$emit("security:logout");
                    return service.isAuthenticated();                   
                },
                authorize: function () {
                    // authorizes the session by fetching
                    // the profile from the current cookie
                    var request = $http.get('api/account/profile');
                    return request.success(function (response) {
                        service.currentUser = response;
                    });
                },
                getHeaders: function () {
                    var headers = {};
                    if (cachedCredentials.userName) {
                        headers['Authorization'] = 'Basic ' + btoa(cachedCredentials.userName + ':' + cachedCredentials.password);
                    }
                    return headers;
                },
                alterarSenha: function () {
                    return $modal.open({
                        controller: CrudSenhaPreviewController,
                        controllerAs: 'ctrl',
                        resolve: {},
                        size: 'lg',
                        templateUrl: 'features/senha/pwSenha.html',
                        backdrop: 'static'
                    }).result;
                },

                empresas: function (id) {
                    var request = api("sis_usuario").query("Empresa", { id: id });
                    return request;                    
                },

                // Information about the current user
                currentUser: null,
                // Is the current user authenticated?
                isAuthenticated: function () {
                    return !!(service.currentUser);
                }
            };
            $rootScope.logout = service.logout;
            $rootScope.alterarSenha = service.alterarSenha;
            return service;
        });

        App.modules.Services.config(function ($httpProvider) {
            $httpProvider.interceptors.push(function () {
                return {
                    'request': function (config) {
                        if (!config.headers['Authorization'] && cachedCredentials.userName) {
                            config.headers['Authorization'] = 'Basic ' + btoa(cachedCredentials.userName + ':' + cachedCredentials.password);
                        }
                        return config;
                    }
                };
            });
        });

        var CrudSenhaPreviewController = (function () {
            function CrudSenhaPreviewController($modalInstance, $state, api, security, SweetAlert, $window) {
                this.$modalInstance = $modalInstance;
                this.$state = $state;
                this.api = api;
                this.security = security;
                this.SweetAlert = SweetAlert;
                this.$window = $window;
                this.mensagens = new App.Services.Mensagens();
            }
            CrudSenhaPreviewController.prototype.salvarSenha = function (senha) {
                var _this = this;
                this.mensagens.limpar();
                if (!senha || !senha.senhaNova || !senha.confirmarSenhaNova || !senha.senhaAtual) {
                    this.mensagens.adicionar('Senha', 'A senha não pode ser vazia.');
                    return false;
                }
                if (senha.senhaNova != senha.confirmarSenhaNova) {
                    this.mensagens.adicionar('Senha', 'As senhas não conferem.');
                    return false;
                }
                var loginSenhaAtual = btoa(this.security.currentUser.login + ':' + senha.senhaAtual);
                this.api('Usuario')
                    .query('alterarsenha/' + loginSenhaAtual + '/' + senha.senhaNova + '/' + btoa(senha.confirmarSenhaNova))
                    .then(function (msg) {
                        if (msg != "") {
                            _this.mensagens.adicionar('Senha', msg);
                            return false;
                        }
                        else {
                            _this.SweetAlert.swal({
                                title: "A senha foi alterada com sucesso.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "OK"
                            }, function (isConfirm) { return _this.$modalInstance.dismiss() && _this.$window.location.assign(luarApp.BASEURL + '/app/login'); });
                        }
                    });
            };
            CrudSenhaPreviewController.prototype.cancelarSenha = function () {
                this.$modalInstance.dismiss();
            };
            return CrudSenhaPreviewController;
        })();
        Services.CrudSenhaPreviewController = CrudSenhaPreviewController;
        App.modules.Controllers.controller('CrudSenhaPreviewController', CrudSenhaPreviewController);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=security.js.map