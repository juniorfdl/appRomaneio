var App;
(function (App) {
    var Services;
    (function (Services) {
        'use strict';
        /**
         * Representa uma ocorrência de mensagem.
         */
        var Mensagem = (function () {
            /**
             * @param tipo      Identificador do tipo da mensagem.
             * @param mensagem  Mensagem para o usuário.
             */
            function Mensagem(tipo, mensagem) {
                this.tipo = tipo;
                this.mensagem = mensagem;
            }
            return Mensagem;
        })();
        /**
         * Representa uma lista de mensagens de erro
         */
        var Mensagens = (function () {
            function Mensagens() {
                /**
                 * Recupera a lista de mensagens de erro.
                 *
                 * @view
                 */
                this.todas = [];
            }
            /**
             * Existe algum erro nesta lista?
             *
             * @view
             */
            Mensagens.prototype.haErros = function () {
                return this.todas.length > 0;
            };
            Object.defineProperty(Mensagens.prototype, "length", {
                /**
                 * Número de mensangens nesta lista.
                 *
                 * @view
                 */
                get: function () {
                    return this.todas.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Remove todas as mensagens desta lista.
             */
            Mensagens.prototype.limpar = function () {
                this.todas.length = 0;
            };
            /**
             * Remove mensagens do tipo específicado.
             *
             * @param tipo  Mensagens deste tipo devem ser removidas.
             */
            Mensagens.prototype.remover = function (tipo) {
                this.todas = this.todas.filter(function (item) { return item.tipo !== tipo; });
            };
            /**
             * Inclui uma mensagem com o tipo especificado.
             *
             * @param tipo
             * @param mensagem
             */
            Mensagens.prototype.adicionar = function (tipo, mensagem) {
                this.todas.push(new Mensagem(mensagem && tipo, mensagem || tipo));
            };
            /**
             * Incluir mensagens a partir de um array, com o tipo especificado.
             *
             * @param msgs
             * @param tipo
             */
            Mensagens.prototype.adicionarTodas = function (msgs, tipo) {
                var _this = this;
                msgs.forEach(function (msg) { return _this.adicionar(tipo, msg); });
            };
            return Mensagens;
        })();
        Services.Mensagens = Mensagens;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=mensagens.js.map