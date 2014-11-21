'use strict';

define(['angular', 'services'], function(angular/*, services*/) {

	/* Directives */
	
	angular.module('myApp.directives', ['myApp.services'])
		.directive('appVersion', ['version', function(version) {
                return function(scope, elm) {
                    elm.text(version);
            };
        }])
        .directive('kjToggleNavbarCollapse', function() {
            return {
                link: function($scope, $el) {
                    var $menu = $el.parent().next();
                    $el.on('click', function() { $menu.toggleClass('in'); });
                }
            };
        });
});
