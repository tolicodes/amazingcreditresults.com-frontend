define(['angular', 'app'], function(angular, app) {
    'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/partials/login.html',
                controller: 'Login'
            })
            .when('/logout', {
                templateUrl: 'app/partials/logout.html',
                controller: 'Logout'
            })
            .when('/sellers', {
                templateUrl: 'app/partials/sellers.html',
                controller: 'Sellers',
                // In the AuthService; services.js
                resolve: { permission: function() {} }
            })
            .when('/buyers', {
                templateUrl: 'app/partials/buyers.html',
                controller: 'Buyers'
            })
		    .otherwise({redirectTo: '/sellers'});
	}]);

});
