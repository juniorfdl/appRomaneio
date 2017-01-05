/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        'use strict';
        /**
         * Interface de configuração da API.
         *
         * ~~~
         * angular.module('app').config(function(apiProvider: App.Services.ApiProvider) {
         *     apiProvider.setBaseUrl("/api");
         * });
         * ~~~
         *
         */
        var ApiProvider = (function () {
            function ApiProvider() {
            }
            /**
             * Retorna a URL configurada do back-end.
             */
            ApiProvider.prototype.getBaseUrl = function () {
                return this.baseUrl;
            };
            /**
             * Configura a URL do back-end.
             *
             * ~~~
             * apiProvider.setBaseUrl("/api");
             * ~~~
             *
             * @param baseUrl   Prefixo das APIs no back-end.
             */
            ApiProvider.prototype.setBaseUrl = function (baseUrl) {
                this.baseUrl = baseUrl;
            };
            /**
             * @private
             * Método de suporte do AngularJS. Não invocar diretamente.
             */
            /* @ngInject */
            ApiProvider.prototype.$get = function ($http, $q, TratarErroDaApi, intercept, toaster) {
                debugger;
                var _this = this;
                return function (api) {
                    return new ApiService(_this.baseUrl + '/' + api, $http, $q, TratarErroDaApi, intercept, toaster);
                };
            };
            return ApiProvider;
        })();
        Services.ApiProvider = ApiProvider;
        /**
         * Interface para operações de CRUD no back-end.
         */
        var ApiService = (function () {
            /**
             * @private
             */
            function ApiService(api, $http, $q, TratarErroDaApi, intercept, toaster) {
                debugger;
                this.api = api;
                this.$http = $http;
                this.$q = $q;
                this.TratarErroDaApi = TratarErroDaApi;
                this.intercept = intercept;
                this.toaster = toaster;
            }
            ApiService.prototype.fetch = function (url, params) {
                return this.$http.get(url, params ? { params: params } : null).then(function (response) {
                    if (angular.isObject(response.data) && response.data.lista) {
                        var lista = response.data.lista;
                        lista.$totalCount = response.data.totalCount;
                        lista.$pageSize = params ? params.itensPorPagina : null;
                        lista.$params = params;
                        return lista;
                    }
                    return response.data;
                });
            };
            /**
             * Obtem uma lista de registros.
             *
             * ~~~
             * api("TipoImovel")
             *     .all()
             *     .then(result => this.listaTipoImovel = result);
             * ~~~
             *
             * @param params    Parâmetros passados para a query string.
             * @returns         Promise para a lista de registros.
             */
            ApiService.prototype.all = function (params) {
                return this.fetch(this.api, params);
            };
            /**
             * Obtem um registro através do seu identificador.
             *
             * ~~~
             * api("TipoImovel")
             *     .get(20)
             *     .then(result => this.selected = result);
             * ~~~
             *
             * @param id    Identificar do registro, conforme indicado por [[ApiEntity.id]].
             * @returns     Promise para o registro retornado.
             */
            ApiService.prototype.get = function (id) {
                return this.$http.get(this.api + '/' + id).then(function (response)
                {
                    debugger;
                    return response.data;
                });
            };
            /**
             * Obtem uma lista de registros através de um comando específico da entidade.
             *
             * ~~~
             * api("Imovel")
             *     .query("localizar", {endereco: "Rua Indepêndencia 123"})
             *     .then(result => this.listaImovel = result);
             * ~~~
             *
             * @param method    Nome do método disponibilizado pelo back-end.
             * @param params    Parâmetros passados para a query string.
             * @returns         Promise para o retorno do back-end.
             */
            ApiService.prototype.query = function (method, params) {
                return this.fetch(this.api + "/" + method, params);
            };
            /**
             * Obtem uma lista de registros através de um comando específico da entidade.
             *
             * ~~~
             * api("TipoImovel")
             *     .command(1, "caracteristicas")
             *     .then(result => this.listaCaracteristicas = result);
             * ~~~
             *
             * @param id        Parâmetros passados para a query string.
             * @param method    Nome do método disponibilizado pelo back-end.
             * @returns         Promise para o retorno do back-end.
             */
            ApiService.prototype.relation = function (id, method) {
                var parameters = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    parameters[_i - 2] = arguments[_i];
                }
                var args = parameters ? '/' + parameters.join('/') : '';
                return this.$http.get(this.api + "/" + id + "/" + method + args).then(function (response) { return response.data; });
            };
            /**
             * Envia um registro para ser salvo no back-end.
             *
             * ~~~
             * api("TipoImovel")
             *     .save(selected);
             * ~~~
             *
             * @param entity    Registro a ser salvo. Em caso de sucesso, o objeto é atualizado com o retorno do back-end.
             * @returns         Promise para o registro atualizado.
             */
            ApiService.prototype.save = function (entity) {
                //debugger;
                var _this = this;
                var url = this.api + (entity.id ? '/' + entity.id : '');
                var method = entity.id ? 'PUT' : 'POST';

                if (entity.id == null) {
                    entity.id = 0;
                }

                return this.$http({
                    method: method,
                    url: url,
                    data: entity
                }).then(function (response) {
                    debugger;
                    var payload = (response.data || {});
                    payload.$status = response.status;

                    if (response.status != 201 && response.data.mensagem_erro != null) {
                        _this.toaster.error("Atenção", response.data.mensagem_erro);
                    } else {
                        _this.toaster.success("Atenção", "Operação executada com sucesso!");
                    }

                    return angular.extend(entity, payload);
                }).catch(function (data) {
                    return _this.$q.reject(_this.TratarErroDaApi(data));
                });
            };
            /**
             * Executa um POST para o método solicitado.
             *
             * URI's aceitas:
             *
             *  * /entity
             *  * /entity/action
             *  * /entity/id/action
             *
             * ~~~
             * api("Login")
             *     .invoke(null);
             * api("User")
             *     .invoke("ResetPassword", user.id);
             * ~~~
             *
             * @param method    Nome da action. Para invocar a action padrão da API, passar null.
             * @param id        Identificador do registro, caso requerido pela action.
             * @param headers   Headers específicos desta requisição.
             * @returns         Promise para o retorno da action.
             */
            ApiService.prototype.invoke = function (method, id, headers) {
                var _this = this;
                var url = this.api + (id != null ? '/' + id : '') + (method != null ? '/' + method : '');
                var method = 'POST';
                return this.$http({
                    method: method,
                    url: url,
                    headers: headers
                }).catch(function (data) { return _this.$q.reject(_this.TratarErroDaApi(data)); });
            };
            /**
             * Envia o comando de exclusão de um registro para o back-end.
             *
             * ~~~
             * api("TipoImovel")
             *     .delete(10);
             * ~~~
             *
             * @param id    Identificar do registro, conforme indicado por [[ApiEntity.id]].
             */
            ApiService.prototype.delete = function (id) {
                debugger;
                var _this = this;
                return this.$http.delete(this.api + '/' + id)
                    .catch(function (data) { return _this.$q.reject(_this.TratarErroDaApi(data)); })
                    .then(function (response) { return response.data; });
            };
            return ApiService;
        })();

        debugger;
        Services.ApiService = ApiService;
        App.modules.Services.provider('api', ApiProvider);
        App.modules.Services.config(function ($httpProvider, apiProvider) {
            $httpProvider.interceptors.push(function () {
                return {
                    'request': function (config) {
                        if (config.url.startsWith(apiProvider.getBaseUrl())) {
                            config.headers['Accept'] = 'application/json;charset=utf-8';
                        }
                        return config;
                    }
                };
            });
        });
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=api.js.map