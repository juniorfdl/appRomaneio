/// <reference path="../base.ts" />
/// <reference path="api.ts" />
/// <reference path="mensagens.ts" />
/// <reference path="crudServices.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        'use strict';
        /**
         * Controller básica para telas de crud (listagem e edição).
         *
         * É recomendado utilizar alguma alguma de suas heranças específicas:
         *
         * * [[CrudBaseListCtrl]]
         * * [[CrudBaseEditCtrl]]
         */
        var CrudBaseCtrl = (function () {
            function CrudBaseCtrl() {
                this.crudConfig = {
                    mostraExcluir: true
                };
                this.SweetAlert = this.injector.get('SweetAlert');
                this.toaster = this.injector.get('toaster');
                this.luarApp = this.injector.get('luarApp');
            }
            Object.defineProperty(CrudBaseCtrl.prototype, "injector", {
                /**
                 * Referência ao injector do angular para obtenção de serviços sob demanda.
                 *
                 * Normalmente, as dependências devem ser obtidas através do construtor.
                 * Entretanto, em casos específicos como herança, o uso deste injector pode
                 * tornar mais simples o uso.
                 *
                 * ~~~
                 * this.SweetAlert = this.injector.get('SweetAlert');
                 * ~~~
                 */
                get: function () {
                    return angular.element(document).injector();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Retorna o nome da funcionalidade desta controller.
             * Este identificador é utilizado para determinar as permissões do usuário nesta funcionalidade.
             *
             * ~~~
             * crud() {
             *     return 'TipoImovel';
             * }
             * ~~~
             *
             * @abstract
             */
            CrudBaseCtrl.prototype.crud = function () {
                return "";
            };

            /**
             * Retorna o identificador primário da entidade desta controller. Por padrão é `id`.
             *
             * ~~~
             * get chave() {
             *     return 'codigoTipoImovel';
             * }
             * ~~~
             *
             * @virtual
             */
            CrudBaseCtrl.prototype.chave = function () {
                return "id";
            };
            /**
             * Método utiliário para solicitar ao usuário a confirmação da operação de exclusão.
             *
             * @param confirmarFn   Callback que será chamada quando usuário confirmar a exclusão.
             */
            CrudBaseCtrl.prototype.confirmarExclusao = function (confirmarFn) {
                this.SweetAlert.swal({
                    title: "Excluir este registro?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Sim, excluir!",
                    cancelButtonText: "Não, mudei de ideia"
                }, function (isConfirm) { return isConfirm && confirmarFn(); });
            };
            /**
             * Método onde deve ser sobrescrita a permissão de edição, se necessário.
             *
             * @returns true, se possui permissão; false, se nega permissão.
             *
             * @virtual
             */
            CrudBaseCtrl.prototype.overridePodeEditar = function () {
                return undefined;
            };
            /**
             * Método onde deve ser sobrescrita a permissão de exclusão, se necessário.
             *
             * @returns true, se possui permissão; false, se nega permissão.
             *
             * @virtual
             */
            CrudBaseCtrl.prototype.overridePodeExcluir = function () {
                return undefined;
            };
            return CrudBaseCtrl;
        })();
        Controllers.CrudBaseCtrl = CrudBaseCtrl;

        var CrudBaseEditCtrl = (function (_super) {
            __extends(CrudBaseEditCtrl, _super);
            function CrudBaseEditCtrl() {
                _super.call(this);
                this.mensagens = new App.Services.Mensagens();
                this.changeOnBlur = { updateOn: 'blur' };
                this.$state = this.injector.get('$state');
                this.$q = this.injector.get('$q');
                this.intercept = this.injector.get('intercept');
                this.termoDigitado = "";
                this.campoSelecionado = "";
            }
            /**
             * Método utilitário para aplicar um mixin nesta instância do controller.
             *
             * @params mixin    Uma instância de mixin, que pode ser um objeto literal ou classe.
             */
            CrudBaseEditCtrl.prototype.applyMixin = function (mixin) {
                angular.extend(this, mixin);
                if (mixin.constructor !== Object) {
                    angular.extend(this, mixin.constructor.prototype);
                }
            };
            /**
             * Conta o número de erros nos elementos associados a ng-model.
             *
             * @param elemName  Nome do sub-form
             */
            CrudBaseEditCtrl.prototype.contarErros = function (elemName) {
                function sum(obj) {
                    var sum = null;
                    for (var el in obj) {
                        if (obj.hasOwnProperty(el)) {
                            sum += obj[el].length;
                        }
                    }
                    return sum;
                }
                if (this.mainForm) {
                    var subForm = this.mainForm[elemName];
                    if (!subForm) {
                        // neste momento o subform pode não ter sido ligado ao form, por isso não convem disparar um erro
                        //throw new Error("Elemento '" + elem + "' não definido.");
                        return null;
                    }
                    return sum(subForm.$error) || "";
                }
            };
            Object.defineProperty(CrudBaseEditCtrl.prototype, "currentRecord", {
                get: function () {
                    return this._currentRecord;
                },
                set: function (value) {
                    this._currentRecord = value;
                    this.registroAtualizado();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CrudBaseEditCtrl.prototype, "services", {
                /**
                 * @abstract
                 */
                get: function () {
                    return [];
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @abstract
             */
            CrudBaseEditCtrl.prototype.prepararParaSalvar = function () { };
            /**
             * @abstract
             * @event
             */

            CrudBaseEditCtrl.prototype.SetItemLista = function (item) {
                if (this.NovoRegistro) {
                    this._lista.unshift(item);
                }
                else {
                    try {
                        var i;
                        for (i = 0; i < this._lista.length; i++) {
                            if (this._lista[i].id == item.id) {
                                this._lista[i] = item;
                                break;
                            }
                        }
                    } catch (err) {

                    }
                }
            }

            CrudBaseEditCtrl.prototype.AtualizarLista = function (result) {
                debugger

                if (result != null) {

                    var _this = this;

                    if (_this.AtualizarConsultaPorId) {
                        _this.crudSvc.buscarConsultaPorId(result.id).then(function (dados) {
                            //result = dados;
                            _this.SetItemLista(dados);
                        });
                    } else {
                        _this.SetItemLista(result);
                    }
                }

            };
            CrudBaseEditCtrl.prototype.registroAtualizado = function () { };
            CrudBaseEditCtrl.prototype.internalSalvar = function () {
                var _this = this;
                if (this.mainForm.$pristine)
                    return null;
                var promise = this.prepararParaSalvar();
                return this.$q.when(promise).then(function (result) {
                    return _this.crudSvc.salvar(_this.currentRecord)
                        .then(function (result) {
                            // resetar status do form para evitar validação de dirty ao navegar para outra página 
                            if (result != null) {
                                _this.mainForm.$setPristine();
                                _this.mainForm.$setUntouched();
                                _this.registroAtualizado();
                                _this.AtualizarLista(result);
                                _this.$rootScope.Cadastro = false;
                            }
                            return result;
                        }).catch(function (erros) { return _this.$q.reject(_this.tratarErros(_this.mainForm, erros)); });
                });
            };
            /**
             * @final
             */
            CrudBaseEditCtrl.prototype.salvar = function () {
                var _this = this;
                this.mensagens.limpar();
                this.mainForm.$setSubmitted();
                var services = this.services;
                if (services.every(function (svc) { return svc == null || svc.validar == null || svc.validar(_this) !== false; })) {
                    if (!this.mainForm.$valid)
                        return;

                    this.NovoRegistro = (_this.currentRecord.id == null);

                    var result = this.internalSalvar();
                }
            };
            CrudBaseEditCtrl.prototype.tratarErros = function (form, erros) {
                var _this = this;
                this.mensagens.remover('API');
                // http://webaim.org/techniques/formvalidation/
                erros.forEach(function (item) {
                    var matches = item.match(/.([A-Z])(\w*)/), fieldName = matches ? matches[1].toLowerCase() + matches[2] : '', field = form[fieldName];
                    if (field && field.$validators) {
                        field.$validators['server'] = function (modelValue, viewValue) {
                            return false;
                        };
                        var viewChanged = function () {
                            field.$setValidity('server', true);
                            delete field.$validators['server'];
                            field.$viewChangeListeners.splice(field.$viewChangeListeners.indexOf(viewChanged), 1);
                        };
                        field.$viewChangeListeners.push(viewChanged);
                        field.$validate();
                    }
                    //*this.mensagens.adicionar(item.replace(matches[1] + matches[2], field.));
                    //this.mensagens.adicionar(item.replace(/(Codigo)?([A-Z]\w+)+/g, substring => substring.replace(/[A-Z]/g, substring => ' ' + substring)));
                    _this.mensagens.adicionar('API', item.replace(/(Codigo)?([A-Z]\w+)+/g, '$2').replace(/[A-Z]/g, function (substring) { return ' ' + substring; }));
                });
            };
            /**
             * @final
             */

            CrudBaseEditCtrl.prototype.setParams = function (params) {
                if (!params)
                    return;
                this._paginaAtual = params.pagina;
                if (params.campoPesquisa) {
                    this.campoSelecionado = params.campoPesquisa;
                }
                this.termoDigitado = params.termo;
            };
            Object.defineProperty(CrudBaseEditCtrl.prototype, "lista", {
                /**
                 * Lista paginada de registros.
                 *
                 * @view
                 */
                get: function () {
                    return this._lista;
                },
                set: function (valor) {
                    this._lista = valor;
                    if (valor) {
                        this.setParams(valor.$params);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CrudBaseEditCtrl.prototype, "ultimoTermo", {
                /* campos de controle de buscas */
                get: function () {
                    return this.lista.$params.termo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CrudBaseEditCtrl.prototype, "ultimoCampo", {
                get: function () {
                    return this.lista.$params.campoPesquisa;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CrudBaseEditCtrl.prototype, "paginaAtual", {
                get: function () {
                    return this._paginaAtual;
                },
                set: function (valor) {
                    this._paginaAtual = valor;
                    this.buscar();
                },
                enumerable: true,
                configurable: true
            });

            CrudBaseEditCtrl.prototype.buscar = function (termo, campo) {
                var _this = this;
                if (termo === undefined)
                    termo = this.ultimoTermo;
                if (campo === undefined)
                    campo = this.ultimoCampo;

                try {

                    if (termo !== this.ultimoTermo || campo !== this.ultimoCampo) {
                        this._paginaAtual = 1;
                    }
                }
                catch (err) {
                    this._paginaAtual = 1;
                }

                this.crudSvc
                    .buscar(termo, this.paginaAtual, this._campoOrdenacao, this._direcaoAsc, this.luarApp.ITENS_POR_PAGINA, campo)
                    .then(function (lista) {
                        _this.lista = lista;
                        _this.mainForm.$setPristine();
                        _this.mainForm.$setUntouched();

                    });
            };

            CrudBaseEditCtrl.prototype.excluir = function (item) {
                var _this = this;
                var confirmarFn = function () {

                    if (item == null) {
                        item = _this.currentRecord;
                    }

                    _this.crudSvc.excluir(item).then(function (response) {
                        if (response.status != 201 && response.data.mensagem_erro != null) {
                            _this.toaster.error("Atenção", response.data.mensagem_erro);
                        } else {
                            var index = _this.lista.indexOf(item);
                            if (index >= 0) {
                                _this.lista.splice(index, 1);
                                _this.currentRecord = null;
                            }
                            else {

                                var i;
                                for (i = 0; i < _this.lista.length - 1; i++) {

                                    if (_this.lista[i].id = item.id) {
                                        _this.lista.splice(_this.lista[i], 1);
                                        break;
                                    }
                                }
                            }

                            _this.$rootScope.Cadastro = false;
                            _this.toaster.warning("Atenção", "Registro excluido com sucesso!");
                        }
                    }).catch(function (erros) { return _this.toaster.warning("Atenção", erros[0]); });
                };
                this.confirmarExclusao(confirmarFn);
            };

            CrudBaseEditCtrl.prototype.ordenar = function (nomeCampo) {
                if (nomeCampo === this._campoOrdenacao) {
                    this._direcaoAsc = !this._direcaoAsc;
                }
                else {
                    this._campoOrdenacao = nomeCampo;
                    this._direcaoAsc = true;
                }
                this.buscar();
                return this._direcaoAsc;
            };

            return CrudBaseEditCtrl;
        })(CrudBaseCtrl);
        Controllers.CrudBaseEditCtrl = CrudBaseEditCtrl;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=crud.js.map