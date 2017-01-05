var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        App.modules.Controllers.controller('LoginCtrl', function ($location, toaster, security, $scope, luarApp) {
            this.userName = localStorage.getItem("userName");
            this.password = "";
            //$scope.layout = true;
        
            this.login = function () {
                security.login(this.userName, this.password)
                    .then(function (result) {

                     $location.path('/home');
                     toaster.clear();
                    
                }, function (error) {
                    var mensagem = error[0];
                    if (mensagem) {
                        toaster.warning("Atenção", mensagem);
                    }else
                        {toaster.warning("Atenção", "Usuário não encontrado");}
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