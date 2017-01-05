/// <reference path="../base.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        var PopupContext = (function () {
            function PopupContext() {
                this.previous = PopupContext.current;
                PopupContext.current = this;
            }
            PopupContext.prototype.release = function () {
                PopupContext.current = this.previous;
                this.previous = null;
            };
            return PopupContext;
        })();
        Infra.PopupContext = PopupContext;
        var PopupCtrl = (function () {
            function PopupCtrl($modalInstance) {
                this.$modalInstance = $modalInstance;
            }
            PopupCtrl.prototype.confirmar = function () { };
            PopupCtrl.prototype.ok = function () {
                var popupContext = new PopupContext();
                try {
                    this.confirmar();
                }
                finally {
                    popupContext.release();
                }
            };
            PopupCtrl.prototype.cancel = function () {
                this.$modalInstance.dismiss('cancel');
            };
            return PopupCtrl;
        })();
        Infra.PopupCtrl = PopupCtrl;
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=popup.js.map