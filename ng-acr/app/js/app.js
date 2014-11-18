'use strict';

define([
	'angular',
    'table',
	'filters',
	'services',
	'directives',
    'resources',
	'controllers',
	'angularRoute',
	], function (angular /*, filters, services, directives, controllers*/) {

		// Declare app level module which depends on filters, and services
		
		return angular.module('myApp', [
			'ngRoute',
			'myApp.filters',
			'myApp.services',
			'myApp.directives',
			'myApp.resources',
			'myApp.controllers',
            'ngTable'
		]);
});
