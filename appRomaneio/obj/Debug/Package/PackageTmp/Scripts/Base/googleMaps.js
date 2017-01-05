/// <reference path="../base.ts" />
var App;
(function (App) {
    var Infra;
    (function (Infra) {
        App.modules.Directives.directive('googleMap', function ($q, $timeout) {
            return {
                restrict: 'EA',
                template: "\n                <style>\n                    .luar-map {\n                        height: 350px; \n                        border: 3px solid #D3D3D3; \n                        border-radius: 3px; \n                        box-shadow: #666 1px 1px 10px;\n                    }\n                </style>\n                <p class=\"clearfix\">\n                    <a ng-href=\"https://www.google.com/maps?q={{coords.latitude}},{{coords.longitude}}\" class=\"pull-right\" target=\"_blank\">\n                        <i class=\"glyphicon glyphicon-globe\"></i> Abrir no Google Maps\n                    </a>\n                </p>\n                <div class=\" luar-map \"></div>\n            ",
                require: '^?form',
                scope: {
                    latitude: '=',
                    longitude: '=',
                },
                link: function (scope, element, attrs, ngForm) {
                    function addMarkerToMap(map, latlng) {
                        map.setCenter(latlng);
                        var draggable = attrs['allowEdit'] === 'true';
                        var marker = new google.maps.Marker({
                            map: map,
                            position: latlng,
                            draggable: draggable
                        });
                        if (draggable) {
                            var helpWindow = new google.maps.InfoWindow({
                                content: "Arraste para definir uma nova localiza\u00E7\u00E3o para o im\u00F3vel."
                            });
                            google.maps.event.addListener(marker, 'click', function () {
                                helpWindow.open(map, marker);
                            });
                            google.maps.event.addListener(marker, 'dragstart', function () {
                                helpWindow.close();
                            });
                            google.maps.event.addListener(marker, 'dragend', function () {
                                scope.$apply(function () {
                                    var latlng = marker.getPosition();
                                    scope['latitude'] = latlng.lat();
                                    scope['longitude'] = latlng.lng();
                                    ngForm && ngForm.$setDirty();
                                });
                            });
                        }
                    }
                    function getCoords() {
                        if (scope['latitude'] && scope['longitude']) {
                            var latlng = new google.maps.LatLng(scope['latitude'], scope['longitude']);
                            return $timeout(function () { }, 10).then(function () { return latlng; });
                        }
                        if (attrs['endereco']) {
                            var geocoder = new google.maps.Geocoder();
                            var geocodePromise = $q.defer();
                            geocoder.geocode({ 'address': attrs['endereco'] }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    var latlng = results[0].geometry.location;
                                    geocodePromise.resolve(latlng);
                                }
                                else {
                                    geocodePromise.reject(status);
                                }
                            });
                            return geocodePromise.promise;
                        }
                    }
                    var map;
                    function activate() {
                        if (map) {
                            return;
                        }
                        var mapOptions = {
                            zoom: 16
                        };
                        map = new google.maps.Map(element[0].querySelector('.luar-map'), mapOptions);
                        $q.when(getCoords()).then(function (latlng) {
                            google.maps.event.trigger(map, "resize");
                            addMarkerToMap(map, latlng);
                            scope['coords'] = {
                                latitude: latlng.lat(),
                                longitude: latlng.lng()
                            };
                            scope['endereco'] = attrs['endereco'];
                        });
                    }
                    attrs.$observe('active', function (value) {
                        if (value !== 'false') {
                            activate();
                        }
                    });
                    if (attrs['active'] === undefined) {
                        activate();
                    }
                }
            };
        });
    })(Infra = App.Infra || (App.Infra = {}));
})(App || (App = {}));
//# sourceMappingURL=googleMaps.js.map