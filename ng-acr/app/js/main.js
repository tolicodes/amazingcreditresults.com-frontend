'use strict';

require.config({
	paths: {
		angular: '../bower_components/angular/angular',
		table: '../bower_components/ng-table/ng-table', // http://ngmodules.org/modules/ng-table
		angularRoute: '../bower_components/angular-route/angular-route',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		text: '../bower_components/requirejs-text/text',
		humane: '../bower_components/humane-js/humane',
        stripe: 'https://js.stripe.com/v2/?1'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
        'table': ['angular'],
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
        'stripe': {
            exports: 'Stripe'
        }
	},
	priority: [
		'angular'
	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require( [
	'angular',
	'app',
	'routes'
], function(angular, app) {
	// var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app.name]);
	});
});
