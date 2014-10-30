'use strict';

define(['angular', 'app'], function(angular, app) {

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'app/partials/login.html',
            controller: 'Login'
        });
        $routeProvider.when('/sellers', {
            templateUrl: 'app/partials/sellers.html',
            controller: 'Sellers'
        });
		$routeProvider.otherwise({redirectTo: '/sellers'});
	}]);

});
