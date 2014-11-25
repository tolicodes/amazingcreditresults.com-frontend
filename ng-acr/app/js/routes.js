define(['angular', 'app'], function(angular, app) {
    'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/partials/login.html',
                controller: 'Login'
            })
            .when('/login/:apiKey', {
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
            .when('/account', {
                templateUrl: 'app/partials/account.html',
                controller: 'Account'
            })
		    .otherwise({redirectTo: '/sellers'});
	}])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
        $rootScope.$on('$routeChangeStart', function(evt, next) {
            // if they're not already being redirected get the user;
            if(!$rootScope.userInfo && next.$$route.originalPath.indexOf('login') === -1) {
                AuthService.getUser();
            }
        });
    }]);

});
