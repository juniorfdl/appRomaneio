/// <reference path="../base.ts" />
/// <reference path="api.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        /**
         * Classe base para implementação de serviços para CRUD's
         *
         * @abstract
         */
        var CrudBaseService = (function () {
            
            /* @ngInject */
            function CrudBaseService($q, api) {
                debugger;
                this.$q = $q;
                this.api = api(this.baseEntity); // ver aqui tb
                this.cache = {};
            }
            
            Object.defineProperty(CrudBaseService.prototype, "baseEntity", {
                /**
                 * Retorna o nome da entidade deste serviço. Cada serviço deve implementar este método.
                 *
                 * ~~~
                 * get baseEntity() {
                 *     return 'TipoImovel';
                 * }
                 * ~~~
                 *
                 * @abstract
                 */
                get: function () { return ""; },
                enumerable: true,
                configurable: true
            });
            /**
             * Efetua uma pesquisa de registros.
             *
             * @final
             *
             * @param termoDePesquisa   Um valor que a API no back-end pode filtrar nos resultados.
             * @param pagina            Número da página desejada, iniciando por 1.
             * @param campoOrdenacao    Os resultados devem retornar classificados por este campo.
             * @param direcaoAsc        Se `campoOrdenacao` for informado, `true` para classificação ascendente. Default `true`.
             * @param itensPorPagina    Número de itens por página. Default [[luarApp.ITENS_POR_PAGINA]]
             * @param campoPesquisa     Nome do campo pelo qual [[termoDePesquisa]] deve ser pesquisado.
             * @returns                 Promise para a lista de registros.
             */
            CrudBaseService.prototype.buscar = function (termoDePesquisa, pagina, campoOrdenacao, direcaoAsc, itensPorPagina, campoPesquisa) {
                var _this = this;
                debugger;
                if (termoDePesquisa === void 0) { termoDePesquisa = ''; }
                if (arguments.length === 0 && this.cache.result) {
                    return this.$q.when(this.cache.result);
                }
                var params = {
                    termo: termoDePesquisa,
                    pagina: pagina,
                    itensPorPagina: itensPorPagina ? itensPorPagina : 15, //luarApp.ITENS_POR_PAGINA
                    //continuar
                    campoOrdenacao: campoOrdenacao,
                    direcaoAsc: direcaoAsc,
                    campoPesquisa: campoPesquisa
                };
                var results = this.api.all(params);
                results.then(function (result) {
                    _this.cache.result = result;
                });
                return results;
            };
            /**
             * Efetua uma pesquisa de registros para utilização como lookup.
             * Dado que não é aplicado limite na listagem, convem não utilizar este método quando existem grandes quantidades de registros (200+)
             *
             * @final
             *
             * @param termoDePesquisa   Um valor que a API no back-end pode filtrar nos resultados.
             * @param campoOrdenacao    Os resultados devem retornar classificados por este campo.
             * @param direcaoAsc        Se `campoOrdenacao` for informado, `true` para classificação ascendente. Default `true`.
             * @returns                 Promise para a lista de registros.
             */
            CrudBaseService.prototype.lookup = function (termoDePesquisa, campoOrdenacao, direcaoAsc) {
                if (termoDePesquisa === void 0) { termoDePesquisa = ''; }
                return this.api.all({
                    termo: termoDePesquisa,
                    campoOrdenacao: campoOrdenacao,
                    direcaoAsc: direcaoAsc
                });
            };
            /**
             * Busca um registro no back-end através de seu [[ApiEntity.id]].
             *
             * @param id    Código do registro.
             * @returns     Promise para o registro retornado.
             */
            CrudBaseService.prototype.buscarPorId = function (id) {
                debugger;
                return this.api.get(id);
            };
            /**
             * Busca um registro no back-end através de seu [[ApiEntity.id]].
             * Utilizar com $q.when()
             *
             * @param id    Código do registro.
             * @returns     Promise para o registro retornado.
             */
            CrudBaseService.prototype.resolver = function (id) {
                debugger;
                return id ? this.buscarPorId(id) : this.criarVazio();
            };
            /**
             *
             */
            CrudBaseService.prototype.criarVazio = function () {
                return {};
            };
            /**
             * Envia um registro para ser salvo no back-end.
             *
             * @param entity    Registro a ser salvo. Em caso de sucesso, o objeto é atualizado com o retorno do back-end.
             * @returns         Promise para o registro atualizado.
             */
            CrudBaseService.prototype.salvar = function (entity) {
                debugger;
                return this.api.save(entity);
            };
            /**
             * Envia o comando de exclusão de um registro para o back-end.
             *
             * @param entity    Identificar do registro, conforme indicado por [[ApiEntity.id]].
             */
            CrudBaseService.prototype.excluir = function (entity) {
                var id = typeof entity === "object"
                    ? entity.id
                    : typeof entity === "number"
                        ? entity
                        : typeof entity === "string" ? parseInt(entity, 10) : null;
                return this.api.delete(id);
            };
            return CrudBaseService;
        })();
        Services.CrudBaseService = CrudBaseService;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=crudServices.js.map