/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        var TOASTER_ID = 'notificacoes';
        App.modules.Services.factory('notificacoes', function ($rootScope, $interval, $modal, toaster, api) {
            var request = api('Notificacoes');
            var service = {
                iniciar: function () {
                    var ultimaVerificacao = 0;
                    var buscar = function () {
                        service.listar(true, false).then(function (lista) {
                            var novasNotificacoes = lista.filter(function (item) { return item.dataInc > ultimaVerificacao; });
                            if (novasNotificacoes.length === 0)
                                return;
                            ultimaVerificacao = new Date();
                            if ($rootScope.onMobile) {
                                service.removerNotificacoes();
                                toaster.info({
                                    toasterId: TOASTER_ID,
                                    title: 'Há novas mensagens',
                                    clickHandler: function () {
                                        service.mostrarLista();
                                        return true;
                                    }
                                });
                            }
                            else {
                                angular.forEach(novasNotificacoes, function (item) {
                                    toaster.info({
                                        toasterId: TOASTER_ID,
                                        title: item.mensagem,
                                        clickHandler: function () {
                                            service.marcarComoLida(item);
                                            service.abrirDetalhes(item);
                                            return true;
                                        }
                                    });
                                });
                            }
                        });
                    };
                    $interval(buscar, 60 * 1000);
                    buscar();
                    return request;
                },
                removerNotificacoes: function () {
                    toaster.clear(TOASTER_ID);
                },
                listar: function (bg, incluirLidas) {
                    if (bg === void 0) { bg = false; }
                    if (incluirLidas === void 0) { incluirLidas = true; }
                    return request.all({ incluirLidas: incluirLidas, bg: bg }).then(function (lista) {
                        return lista.map(function (item) {
                            item.dataInc = new Date(item.dataInc);
                            item.dataAtualizacao = new Date(item.dataAtualizacao);
                            return item;
                        });
                    });
                },
                marcarComoLida: function (item) {
                    request.invoke('MarcarComoLida', item.id).then(function () {
                        item.lida = true;
                    });
                },
                mostrarLista: function () {
                    service.removerNotificacoes();
                    $modal.open({
                        size: 'lg',
                        templateUrl: 'features/mensagens/list.html',
                        controller: 'MensagensListCtrl',
                        controllerAs: 'ctrl',
                        resolve: {
                            lista: function () {
                                return service.listar();
                            }
                        }
                    });
                },
                abrirDetalhes: function (mensagem) {
                    $modal.open({
                        size: 'lg',
                        templateUrl: 'features/mensagens/detalhes.html',
                        controller: function ($state, $modalInstance, mensagem, detalhes, tipoRegra) {
                            this.mensagem = mensagem;
                            this.detalhes = detalhes;
                            this.tipoRegra = tipoRegra;
                            this.abrirItem = function (detalhe) {
                                var _this = this;
                                switch (tipoRegra) {
                                    case 'atividade':
                                        api('Dashboard/Atividades').get(detalhe.id).then(function (item) {
                                            App.Controllers.CrudOportunidadeAtividadePreviewController
                                                .exibir($modal, item, function (registro) {
                                                _this.api('AtividadeOportunidade').save(registro);
                                            });
                                        });
                                        break;
                                    case 'imovel':
                                        App.Controllers.CrudOfertaPreviewController.exibir($modal, detalhe.id, "0", { mostrarAcoes: true });
                                        break;
                                    case 'listainteresseimovel':
                                        $state.go('oportunidade.edit', { id: detalhe.id });
                                        break;
                                }
                            };
                            this.fechar = function () {
                                $modalInstance.dismiss();
                            };
                        },
                        controllerAs: 'ctrl',
                        resolve: {
                            mensagem: function () { return mensagem; },
                            detalhes: function (api) { return request.relation(mensagem.id, mensagem.tipoRegra); },
                            tipoRegra: function () { return mensagem.tipoRegra; }
                        }
                    });
                }
            };
            return service;
        });
        App.modules.Services.controller('MensagensListCtrl', (function () {
            function class_1($modal, $modalInstance, notificacoes, lista) {
                this.$modal = $modal;
                this.$modalInstance = $modalInstance;
                this.notificacoes = notificacoes;
                this.mensagens = _(lista).groupBy(function (it) { return it.descricaoRegra; }).value();
                this.estaVazio = _.isEmpty(this.mensagens);
            }
            class_1.prototype.abrirDetalhes = function (mensagem) {
                this.notificacoes.abrirDetalhes(mensagem);
            };
            class_1.prototype.marcarComoLida = function (mensagem) {
                this.notificacoes.marcarComoLida(mensagem);
            };
            class_1.prototype.fechar = function () {
                this.$modalInstance.dismiss();
            };
            return class_1;
        })());
        App.modules.Services.directive('luarMensagensModal', function (notificacoes, $modal) {
            return {
                link: function (scope, element) {
                    element.on('click', function () {
                        notificacoes.mostrarLista();
                    });
                }
            };
        });
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=notificacoes.js.map