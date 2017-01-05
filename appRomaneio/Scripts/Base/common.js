//App.modules.Init.config(function ($compileProvider) {
    // para deploy desabilitamos informações de debug
    // para debug comentar a linha abaixo
    //$compileProvider.debugInfoEnabled(luarApp.ISDEBUG);
//});
App.modules.App.run(function ($locale) {
    $locale.DATETIME_FORMATS.short = 'dd/MM/yyyy HH:mm';
    $locale.DATETIME_FORMATS.shortDate = 'dd/MM/yyyy';
});
App.modules.App.config(function (unsavedWarningsConfigProvider) {
    unsavedWarningsConfigProvider.routeEvent = '$stateChangeStart';
    unsavedWarningsConfigProvider.navigateMessage = "As alterações não salvas serão perdidas.";
    unsavedWarningsConfigProvider.reloadMessage = "As alterações não salvas serão perdidas.";
});
App.modules.App.config(function (paginationConfig) {
    paginationConfig.previousText = 'Anterior';
    paginationConfig.nextText = "Próxima";
    paginationConfig.firstText = "Primeira";
    paginationConfig.lastText = "Última";
});
App.modules.App.config(function (uiSelectConfig) {
    uiSelectConfig.resetSearchInput = true;
});
App.modules.App.config(function (easyMaskProvider) {
    easyMaskProvider.publishMask('cep', '99999-999');
    easyMaskProvider.publishMask('cpf', '999.999.999-99');
    easyMaskProvider.publishMask('cnpj', '99.999.999/9999-99');
    easyMaskProvider.publishMask('ddd', '99');
    easyMaskProvider.publishMask('fone', '09999-9999');
    easyMaskProvider.publishMask('ddd+fone', '(99) 09999-9999');
});

App.modules.App.factory('DataSistema', function () {
    return {
        data: function (data) {
            if (data === void 0) { data = new Date(); }
            var date = data.toISOString().substring(0, 10) + "T00:00:00.000Z";
            return date;
        },
        hora: function (data) {
            if (!data) {
                data = new Date();
                data.setUTCHours(data.getHours(), data.getMinutes());
            }
            return data.toISOString().substring(0, 19);
        },
        alterarHora: function (dataBase, novaHora) {
            dataBase = new Date(new Date(dataBase).toISOString().substring(0, 10) + "T00:00:00.000Z");
            novaHora = new Date(novaHora);
            dataBase.setUTCHours(novaHora.getUTCHours(), novaHora.getUTCMinutes(), novaHora.getUTCSeconds());
            return dataBase.toISOString().substring(0, 19);
        },
        horaMinuto: function (data) {
            if (!data) {
                data = new Date();
                data.setUTCHours(data.getHours(), data.getMinutes());
                data.setUTCSeconds(0);
            }
            return data.toISOString().substring(0, 19);
        },
    };
});

App.modules.App.filter('enumLookup', function (Enums) {
    return function (nome, id) {
        return Enums[nome][id];
    };
});
App.modules.App.factory('EnumLookup', function (Enums) {
    return function (nome) {
        return function (id) {
            return Enums[nome][id];
        };
    };
});
App.modules.App.run(function ($rootScope, $log, $state, security) {
    var setupErrors = function () { return $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        $log.error('$stateChangeError', event, toState, error);
    }); };
    var setupRedirects = function () { return $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!security.isAuthenticated() && toState.name != 'login') {
            event.preventDefault();
        }
        if (toState.data && toState.data.redirectTo) {
            event.preventDefault();
            $state.go(toState.data.redirectTo, toParams);
        }
        if (/\.edit$/.test(toState.name) && !toParams.id) {
            var newState = toState.name.replace(/\.edit$/, '.new');
            if ($state.href(newState)) {
                event.preventDefault();
                $state.go(newState);
            }
        }
    }); };
    var setupTitle = function () { return $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        // Sets the layout name, which can be used to display different layouts (header, footer etc.)
        // based on which page the user is located
        $rootScope.layout = toState.layout;
        var title = "luar";
        if (toState.data && toState.data.title) {
            title += " | " + toState.data.title;
        }
        $rootScope.title = title;
    }); };
    setupErrors();
    setupRedirects();
    setupTitle();
});
App.modules.App.run(function ($document, $window, $rootScope) {
    if (isItMobile()) {
        $rootScope.onMobile = true;
    }
    function isItMobile() {
        return "ontouchstart" in $document[0].documentElement && $window.innerWidth < 768;
    }
});
//# sourceMappingURL=common.js.map