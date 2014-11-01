define(['angular', 'app'], function(angular, app) {
    'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'app/partials/login.html',
            controller: 'Login'
        });
        $routeProvider.when('/logout', {
            templateUrl: 'app/partials/logout.html',
            controller: 'Logout'
        });
        $routeProvider.when('/sellers', {
            templateUrl: 'app/partials/sellers.html',
            controller: 'Sellers',
            // In the AuthService; services.js
            resolve: { permission: function() {} }
        });
		$routeProvider.otherwise({redirectTo: '/sellers'});
	}]);

});
