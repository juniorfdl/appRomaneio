var App;
(function (App) {
    'use strict';

    App.modules.App.config(function ($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'views/index.html'
        }).state('login', {
            url: '/login',
            layout: 'basic',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'ctrl',
            data: {
                title: "Entrar"
            }
        }).state('romaneio', {
            url: '',
            templateUrl: 'features/FAT/Fat_Romaneio_Pao/edit.html',
            controller: 'CrudRomaneioCtrl',
            controllerAs: 'ctrl',
            resolve: {
                lista: function (CrudRomaneioService) {
                    return CrudRomaneioService.buscar('', 1, 'CODIGO', false, 15, ''); //'01', 5, 'CODIGO', false, 20, 'CEMP'
                }
            }
        }).state('usuario', {
            url: '',
            templateUrl: 'features/SIS/Sis_Usuario/edit.html',
            controller: 'CrudSis_UsuarioCtrl',
            controllerAs: 'ctrl',
            resolve: {
                lista: function (CrudSis_UsuarioService) {
                    return CrudSis_UsuarioService.buscar('', 1, 'NOME', false, 15, '');
                }
            }
        }).state('produto_fatopesaida', {
            url: '',
            templateUrl: 'features/CAD/Cad_Produto_FatOpeSaida/edit.html',
            controller: 'CrudCad_Produto_FatOpeSaidaCtrl',
            controllerAs: 'ctrl',
            resolve: {
                lista: function (CrudCad_Produto_FatOpeSaidaService) {
                    return CrudCad_Produto_FatOpeSaidaService.buscar('', 1, 'PRODUTO', false, 15, '');
                }
            }
        }
        ).state("otherwise",
          {
              url: '/home',
              templateUrl: 'views/index.html'
          }
        );
    });

})(App || (App = {}));
//# sourceMappingURL=app.js.map