/// <reference path="../base.ts" />
var App;
(function (App) {
    var Services;
    (function (Services) {
        var Wizard;
        (function (Wizard) {
            'use strict';
            /**
             * Representa o estado de controler de um assistente em execução
             */
            var WizardState = (function () {
                function WizardState() {
                    this._etapaAtual = null;
                }
                Object.defineProperty(WizardState.prototype, "etapaAtual", {
                    get: function () {
                        return this._etapaAtual;
                    },
                    set: function (value) {
                        this._etapaAtual = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return WizardState;
            })();
            Wizard.WizardState = WizardState;
            /**
             * Mixin que controla um assistente.
             *
             * @mixin
             */
            var WizardService = (function () {
                /**
                 * @private
                 */
                function WizardService($q, target, setarState) {
                    this.$q = $q;
                    this.target = target;
                    this.setarState = setarState;
                    this.wizardState = new WizardState();
                    this.registroDefault = angular.copy(target.currentRecord);
                }
                WizardService.prototype.obterEtapa = function (indice) {
                    return this.target.etapas[indice];
                };
                /**
                 * Instrui o assistente a voltar a para a primeira etapa, e resetar os dados em tela.
                 */
                WizardService.prototype.reiniciar = function () {
                    if (!this.target.currentRecord) {
                        throw new Error("wizard.currentRecord não está inicializado.");
                    }
                    this.target.mensagens.limpar();
                    angular.copy(this.registroDefault, this.target.currentRecord);
                    if (this.target.mainForm) {
                        this.target.mainForm.$setPristine();
                    }
                    this.setarState(0);
                };
                WizardService.prototype.podeRetornar = function () {
                    if (this.wizardState.etapaAtual === 0)
                        return false;
                    if (!this.target.currentRecord.id)
                        return true;
                    return true;
                };
                WizardService.prototype.retornar = function () {
                    if (!this.podeRetornar())
                        return;
                    this.target.mensagens.limpar();
                    var etapaFutura = this.wizardState.etapaAtual - 1;
                    while (!this.target.podeAtivarEtapa(this.obterEtapa(etapaFutura))) {
                        etapaFutura--;
                        if (etapaFutura < 0) {
                            throw new Error('retornar(): this.wizardState.etapaEmTransicao < 0');
                        }
                    }
                    this.setarState(etapaFutura);
                };
                WizardService.prototype.podeAvancar = function () {
                    return (this.wizardState.etapaAtual < this.target.etapas.length - 1);
                };
                WizardService.prototype.avancar = function () {
                    var _this = this;
                    if (!this.podeAvancar())
                        return;
                    var nomeEtapa = this.obterEtapa(this.wizardState.etapaAtual), nestedForm = this.target.mainForm[nomeEtapa];
                    nestedForm.$setSubmitted();
                    if (!nestedForm.$valid) {
                        return;
                    }
                    var promiseOrResult;
                    var servico1 = this.target.obterServico(nomeEtapa);
                    if (servico1) {
                        if (servico1.validar && servico1.validar(this) === false) {
                            return;
                        }
                        var confirmarServico = servico1.confirmar && servico1.confirmar(this);
                        promiseOrResult = this.$q.when(confirmarServico != null ? confirmarServico : true)
                            .then(function (result) {
                            if (result)
                                return _this.target.confirmarEtapa(nomeEtapa);
                            else
                                return _this.$q.reject(result);
                        });
                    }
                    else {
                        promiseOrResult = this.target.confirmarEtapa(nomeEtapa);
                    }
                    var avancarFinal = function () {
                        var etapaFutura = _this.wizardState.etapaAtual + 1;
                        while (!_this.target.podeAtivarEtapa(_this.obterEtapa(etapaFutura))) {
                            etapaFutura++;
                            if (etapaFutura >= _this.target.etapas.length) {
                                throw new Error('retornar(): this.wizardState.etapaEmTransicao < 0');
                            }
                        }
                        // solução paliativa enquanto não existe um método $setUnsubmitted()
                        // $setPristine() reseta os estados do formulário, inclusive submitted
                        // $setDirty() reverte os estados, mas mantem submitted = false
                        var wasDirty = _this.target.mainForm.$dirty;
                        _this.target.mainForm.$setPristine();
                        if (wasDirty) {
                            _this.target.mainForm.$setDirty();
                        }
                        _this.setarState(etapaFutura);
                    };
                    if (!promiseOrResult) {
                        avancarFinal();
                    }
                    else {
                        promiseOrResult.then(function () {
                            avancarFinal();
                        });
                    }
                };
                WizardService.prototype.currentTemplateUrl = function () {
                    var etapaAtual = this.target.etapas[this.wizardState.etapaAtual];
                    return etapaAtual ? "features/" + this.target.feature + "/" + etapaAtual + ".html" : '';
                };
                return WizardService;
            })();
            Wizard.WizardService = WizardService;
            function WizardFactory($q, $rootScope) {
                return function (target) {
                    function setarState(newState) {
                        this.wizardState.etapaAtual = newState;
                        $rootScope.$emit('wizard:stepChanged', { templateUrl: target.etapas[newState], feature: target.feature });
                    }
                    var mixin = new WizardService($q, target, setarState);
                    mixin.reiniciar();
                    return mixin;
                };
            }
            Wizard.WizardFactory = WizardFactory;
            App.modules.Services.factory('wizard', WizardFactory);
        })(Wizard = Services.Wizard || (Services.Wizard = {}));
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=wizard.js.map