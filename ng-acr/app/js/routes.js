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
            .when('/owners', {
                templateUrl: 'app/partials/owners.html',
                controller: 'Owners'
            })
            .when('/products', {
                templateUrl: 'app/partials/products.html',
                controller: 'Products'
            })
            .when('/orders', {
                templateUrl: 'app/partials/products.html',
                controller: 'Orders'
            })
            .when('/tradelines', {
                templateUrl: 'app/partials/tradelines.html',
                controller: 'Tradelines'
            })
		    .otherwise({redirectTo: '/sellers'});
	}]);

});
