'use strict';

define(['angular', 'services'], function (angular) {

	/* Filters */
	
	angular.module('myApp.filters', ['myApp.services'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
        }])
        .filter('numberWithCommas', function() {
            return function(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            };
        });
});
