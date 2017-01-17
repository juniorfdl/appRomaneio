/// <reference path="luar-crud-form.html" />
/// <reference path="../base.ts" />
/// <reference path="crud.ts" />
/// <reference path="permissoesservice.ts" />
var App;
(function (App) {
    var Directives;
    (function (Directives) {
        "use strict";
        /**
         * Auxilia na obtenção das permissões disponíveis da funcionalidade.
         *
         * @directive luar-crud
         *
         * @param crud  Controller da tela
         * @param title Título da tela
         */        
        var CrudCtrl = (function () {
            function CrudCtrl() {
            }
            return CrudCtrl;
        })();
        Directives.CrudCtrl = CrudCtrl; 
        function Crud() {//PermissoesService
            return {
                restrict: 'E',
                scope: {
                    crud: '=',
                    title: '@'
                },
                require: 'luarCrud',
                bindToController: true,
                controllerAs: 'crudCtrl',
                controller: CrudCtrl,
                link: function (scope, iElement, iAttrs, crudCtrl) {
                    iAttrs.$set('title', null);
                    var crudId = crudCtrl.crud.crud();
                    crudCtrl.podeVisualizar = true;//PermissoesService.temPermissao(crudId, 'visualizar');
                    crudCtrl.podeIncluir = true; //PermissoesService.temPermissao(crudId, 'incluir');
                    crudCtrl.podeEditar = true;//PermissoesService.temPermissao(crudId, 'editar');
                    crudCtrl.podeSalvar = crudCtrl.crud.overridePodeEditar() !== false;
                    crudCtrl.podeExcluir = true; //PermissoesService.temPermissao(crudId, 'excluir') && crudCtrl.crud.overridePodeExcluir() !== false;
                    crudCtrl.crud.permissoes = crudCtrl;

                    //function arrayObjectIndexOf(myArray, searchTerm, property) {
                    //    for (var i = 0, len = myArray.length; i < len; i++) {
                    //        if (myArray[i][property] === searchTerm) return i;
                    //    }
                    //    return -1;
                    //}

                    crudCtrl.voltar = function (item) {
                        this.crud.$rootScope.Cadastro = !this.crud.$rootScope.Cadastro;                        
                    }

                    crudCtrl.edit = function (item) {
                        this.crud.$rootScope.Cadastro = !this.crud.$rootScope.Cadastro;
                        this.crud.descricao = 'Alterar';                         
                        var _crud = this.crud;

                        this.crud.crudSvc.api.get(item.id).then(function (response) {
                            _crud.currentRecord = response;
                        });
                    };
                }

            };
        }
        Directives.Crud = Crud;
        /**
         * Componente para exibição de uma lista de registros. Funciona em conjunt com [[Column]] e [[Table]].
         *
         * ~~~html
         * <luar-list list="ctrl.lista">
         *     <column id="id" title="Código"></column>
         *     <column id="descricao" title="Descrição" searchable="true"></column>
         *     <column id="semIptuSeguro" title="Sem IPTU Seguro" filter="simnao" searchable="true"></column>
         *     <column id="informaEdificio" title="Informa edifício" filter="simnao" searchable="true"></column>
         *     <column id="dataAtualizacao" title="Atualizado em" type="date"></column>
         *
         *     <luar-table></luar-table>
         * </luar-list>
         * ~~~
         *
         * @directive luar-list
         * @require luar-crud
         */
        var ListCtrl = (function () {
            function ListCtrl($filter) {
                this.$filter = $filter;
                /**
                 * @view
                 */
                this.columns = [];
            }
            ListCtrl.prototype.addColumn = function (id, title, searchable, type, filter, sortBy, divClass) {
                var $filter = this.$filter;
                var newCol = {
                    id: id, title: title, searchable: searchable, type: type, filter: filter, sortBy: sortBy, divClass: divClass, format: function (data) {
                        var value = data[this.id];
                        if (value == undefined)
                            return value;
                        if (this.filter)
                            return $filter(this.filter)(value);
                        switch (this.type) {
                            case 'date': return $filter('date')(value, 'shortDate');
                            case 'update':
                                var now = new Date();
                                var date = new Date(value);
                                var minutesAgo = Math.trunc((now.getTime() - date.getTime()) / 1000 / 60) - now.getTimezoneOffset();
                                if (minutesAgo < 1) {
                                    return "agora";
                                }
                                else if (minutesAgo < 2) {
                                    return "h\u00E1 1 minuto";
                                }
                                else if (minutesAgo < 60) {
                                    return "h\u00E1 " + minutesAgo + " minutos";
                                }
                                else if (minutesAgo < 120) {
                                    return "h\u00E1 1 hora";
                                }
                                else if (now.toDateString() === date.toDateString()) {
                                    return "h\u00E1 " + Math.trunc(minutesAgo / 60) + " horas";
                                }
                                else {
                                    var daysAgo = (new Date(now.toISOString().substring(0, 10)).getTime() - new Date(date.toISOString().substring(0, 10)).getTime()) / 1000 / 60 / 60 / 24;
                                    if (daysAgo == 1) {
                                        return "h\u00E1 1 dia";
                                    }
                                    else if (daysAgo <= 30) {
                                        return "h\u00E1 " + daysAgo + " dias";
                                    }
                                    else {
                                        return $filter('date')(date, 'shortDate');
                                    }
                                }
                            case 'currency': return $filter('currency')(value);
                            default: break;
                        }
                        return value;
                    }
                };
                this.columns.push(newCol);
            };
            return ListCtrl;
        })();
        Directives.ListCtrl = ListCtrl;
        function List() {
            return {
                restrict: 'E',
                require: '^^luarCrud',
                template: function (element, attrs) {
                    //const ctrl = element.controller('luarCrud');
                    return "\n                    <h2 ng-if=\"luarCrudCtrl.title\">{{luarCrudCtrl.title}}</h2>\n                    <div ng-transclude></div>\n                ";
                },
                transclude: true,
                controllerAs: 'listCtrl',
                controller: ListCtrl,
                // TODO se scope=false as variáveis listCtrl e luarCrudCtrl acadam vazando para o scope do elemento luar-crud
                scope: true,
                link: function (scope, element, attrs, luarCrudCtrl) {
                    scope['luarCrudCtrl'] = luarCrudCtrl;
                    scope['listCtrl'].config = {
                        search: element.attr('search') !== 'false',
                        rowActions: element.attr('row-actions') !== 'false'
                    };
                }
            };
        }
        Directives.List = List;
        /**
         * Componente para definir uma coluna de dados dentro de uma [[ListCtrl]].
         *
         * ~~~html
         * <column id="semIptuSeguro" title="Sem IPTU Seguro" filter="simnao" searchable="true"></column>
         * ~~~
         *
         * @directive column
         * @require luar-list
         */
        function Column() {
            return {                
                restrict: 'E',
                require: '^^luarList',
                link: function (scope, iElement, iAttrs, listCtrl) {
                    listCtrl.addColumn(iAttrs['id'], iAttrs['title'], iAttrs['searchable'], iAttrs['type'], iAttrs['filter'], iAttrs['sortBy'], iAttrs['divClass']);
                }
            };
        }
        Directives.Column = Column;
        /**
         * Componente para apresentar a lista de registros definida na [[ListCtrl]] onde está contida.
         *
         * ~~~html
         * <luar-table></luar-table>
         * ~~~
         *
         * @directive luar-table
         * @require luar-list
         */
        function Table() {
            return {
                restrict: 'E',
                require: ['^^luarList', '^^luarCrud'],
                templateUrl: 'Scripts/Base/luar-list.html',
                scope: true,
                link: function (scope, element, attrs, ctrls) {
                    scope['listCtrl'] = ctrls[0];
                    scope['ctrl'] = ctrls[1].crud;
                    scope['clicked'] = function (item, $event) {
                        var ctrl = scope['ctrl'];
                        ctrl.$rootScope.Cadastro = !ctrl.$rootScope.Cadastro;
                        ctrl.descricao = 'Alterar';
                                                
                        ctrl.crudSvc.api.get(item.id).then(function (response) {
                            ctrl.currentRecord = response;
                        });

                    };
                }
            };
        }
        Directives.Table = Table;
        function ListCrud() {
            return {
                restrict: 'E',
                require: ['luarListSearch', '^^luarCrud'],
                scope: {
                    campos: '='
                },
                templateUrl: 'Scripts/Base/luar-list-search.html',
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () {
                    var _this = this;
                    this.submit = function () {
                        _this.listCtrl.buscar(_this.listCtrl.termoDigitado, _this.listCtrl.campoSelecionado);
                    };

                    
                    this.novo = function () {
                        _this.listCtrl.$rootScope.Cadastro = !_this.listCtrl.$rootScope.Cadastro;
                        _this.crudCtrl.crud.descricao = 'Novo';
                        _this.crudCtrl.crud.currentRecord = {};
                    };
                },
                link: function (scope, iElement, iAttrs, ctrls) {
                    var ctrl = ctrls[0];
                    ctrl.crudCtrl = ctrls[1];
                    ctrl.listCtrl = ctrl.crudCtrl.crud;
                    if (!ctrl.listCtrl.campoSelecionado) {
                        ctrl.listCtrl.campoSelecionado = ctrl.campos[0].id;
                    }
                    ctrl.camposParaFiltro = ctrl.campos.filter(function (campo) { return campo.searchable; });
                }
            };
        }
        Directives.ListCrud = ListCrud;

        function ListRowCrud() {
            return {
                restrict: 'E',
                require: '^^luarCrud',
                template: [
                    '<a class="btn btn-primary btn-sm" ng-disabled="!luarCrudCtrl.podeVisualizar" ng-click="luarCrudCtrl.edit({id: ctrl.key})"><span class="glyphicon glyphicon-edit"></span></a> ',
                    '<button class="btn btn-danger btn-sm" ng-disabled="!luarCrudCtrl.podeExcluir" ng-click="ctrl.excluir()"><span class="glyphicon glyphicon-trash"></span></button>'
                ].join(""),
                scope: {
                    key: '=',
                    excluir: '&'
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () { },
                link: function (scope, element, attrs, luarCrudCtrl) {
                    scope['luarCrudCtrl'] = luarCrudCtrl;
                }
            };
        }
        Directives.ListRowCrud = ListRowCrud;
        /**
         * Componente para criação do formulário principal da página.
         *
         * O nome do formulário é `mainForm` dentro do controller.
         *
         * @directive luar-main-form
         * @require luar-crud
         */
        function MainForm() {
            return {
                restrict: 'E',
                require: '^^luarCrud',
                templateUrl: 'Scripts/Base/luar-crud-form.html',
                transclude: true,
                scope: true,
                link: function (scope, element, attrs, luarCrudCtrl) {
                    scope['crudCtrl'] = luarCrudCtrl;
                    var h2 = angular.element(element[0].querySelectorAll('h2')), luarIdent = angular.element(element[0].querySelectorAll('luar-ident'));
                    if (luarIdent) {
                        h2.replaceWith(luarIdent);
                    }
                }
            };
        }
        Directives.MainForm = MainForm;
        function FieldSet() {
            return {
                restrict: 'E',
                require: '?^luarCrud',
                priority: 1,
                link: function (scope, element, attrs, ctrl) {
                    if (ctrl && !ctrl.podeEditar && !attrs['ngDisabled']) {
                        attrs.$set("disabled", true);
                    }
                }
            };
        }
        Directives.FieldSet = FieldSet;
        /**
         * Componente para exibição de uma lista de erros.
         *
         * @param mensagens Uma instância de [[App.Services.Mensagens]]
         *
         * @directive luar-erros
         */
        function Errors() {
            return {
                restrict: 'E',
                templateUrl: 'Scripts/Base/luar-erros.html',
                scope: {
                    mensagens: '='
                }
            };
        }
        Directives.Errors = Errors;
        function EditCrud() {
            return {
                restrict: 'E',
                require: '^^luarCrud',
                template: "\n                <alert type=\"info\" ng-if=\"!luarCrudCtrl.podeSalvar\">\n                    Voc\u00EA n\u00E3o possui permiss\u00E3o de edi\u00E7\u00E3o.\n                </alert>\n\n                <button class=\"btn btn-primary\" ng-click=\"ctrl.salvar()\" ng-disabled=\"!luarCrudCtrl.podeSalvar || luarCrudCtrl.crud.mainForm.$pristine\"><span class=\"glyphicon glyphicon-floppy-disk\"></span> Salvar</button>\n                <button class=\"btn btn-warning\" ng-click=\"voltar()\" type=\"reset\" unsaved-warning-clear>Cancelar</button>\n\n                <div class=\"btn-group pull-right\" dropdown ng-if=\"luarCrudCtrl.crud.acoes.length\">\n                  <button type=\"button\" class=\"btn btn-primary\" dropdown-toggle>\n                    A\u00E7\u00F5es <span class=\"caret\"></span>\n                  </button>\n                  <ul class=\"dropdown-menu\" role=\"menu\">\n                    <li role=\"menuitem\" ng-repeat=\"acao in luarCrudCtrl.crud.acoes\">\n                        <a class=\"btn\" href=\"#\" ng-click=\"acao.onClick()\" ng-disabled=\"acao.disabled && acao.disabled()\">\n                            <span class=\"glyphicon {{acao.iconeCls}}\"></span>\n                            <span> {{acao.titulo}}</span>\n                        </a>\n                    </li>\n                  </ul>\n                </div>\n\n                <button class=\"btn btn-danger pull-right\" ng-click=\"ctrl.excluir()\" ng-disabled=\"!luarCrudCtrl.podeExcluir\" ng-if=\"!!luarCrudCtrl.crud.currentRecord.id && luarCrudCtrl.crud.crudConfig.mostraExcluir\"><span class=\"glyphicon glyphicon-trash\"></span><span class=\"desktop-only\"> Excluir</span></button>\n            ",
                scope: {
                    salvar: '&',
                    excluir: '&'
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () { },
                link: function (scope, iElement, iAttrs, luarCrudCtrl) {
                    scope.luarCrudCtrl = luarCrudCtrl;
                    scope.voltar = function ()
                    {
                        this.$root.Cadastro = !this.$root.Cadastro;
                    };
                }
            };
        }
        Directives.EditCrud = EditCrud;
        function ActionBar() {
            return function (scope, iElement, iAttrs) {
                var el = iElement[0];
                el.addEventListener("click", function (event) { return event.stopPropagation(); });
            };
        }
        Directives.ActionBar = ActionBar;
        function OrderByClick() {
            return {
                restrict: 'A',
                scope: {
                    orderByClick: '&'
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () {
                    var _this = this;
                    var lastElement, caretEl;
                    this.orderBy = function (column, element) {
                        var directionAsc = _this.orderByClick({ column: column });
                        //th[order-by]::after {
                        //    content: " \25bc";
                        //}
                        if (lastElement !== element) {
                            if (lastElement && caretEl) {
                                lastElement.removeChild(caretEl);
                            }
                            if (element) {
                                if (!caretEl) {
                                    var caret = '<span class="order"><span class="caret"></span></span>';
                                    caretEl = angular.element(caret)[0];
                                }
                                element.insertAdjacentElement('beforeend', caretEl);
                            }
                        }
                        if (caretEl) {
                            if (directionAsc) {
                                caretEl.classList.add('dropup');
                            }
                            else {
                                caretEl.classList.remove('dropup');
                            }
                        }
                        lastElement = element;
                    };
                }
            };
        }
        Directives.OrderByClick = OrderByClick;
        function OrderBy() {
            return {
                restrict: 'A',
                require: '^^orderByClick',
                scope: {
                    orderBy: '@'
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () { },
                link: function (scope, iElement, iAttrs, orderByCtrl) {
                    iElement[0].addEventListener('click', function (event) {
                        orderByCtrl.orderBy(scope.ctrl.orderBy, iElement[0]);
                    });
                }
            };
        }
        Directives.OrderBy = OrderBy;
        App.modules.Directives
            .directive("luarCrud", Crud)
            .directive("luarList", List)
            .directive("luarListSearch", ListCrud)
            .directive("luarListRowCrud", ListRowCrud)
            .directive("column", Column)
            .directive("luarTable", Table)
            .directive("luarMainForm", MainForm)
            .directive("fieldset", FieldSet)
            .directive("luarErros", Errors)
            .directive("luarEditCrud", EditCrud)
            .directive("luarActionBar", ActionBar)
            .directive("orderByClick", OrderByClick)
            .directive("orderBy", OrderBy);
    })(Directives = App.Directives || (App.Directives = {}));
})(App || (App = {}));
//# sourceMappingURL=layoutCrud.js.map