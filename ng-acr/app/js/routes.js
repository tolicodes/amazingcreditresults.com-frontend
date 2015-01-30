define(['angular', 'app'], function(angular, app) {
    'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/partials/login.html',
                controller: 'Login'
            })
            .when('/welcome/:apiKey', {
                templateUrl: 'app/partials/welcome.html',
                controller: 'Welcome'
            })
            .when('/passwordReset', {
                templateUrl: 'app/partials/password1.html',
                controller: 'PasswordReset'
            })
            .when('/password/:apiKey', {
                templateUrl: 'app/partials/passwordSet.html',
                controller: 'PasswordSet'
            })
            .when('/logout', {
                templateUrl: 'app/partials/logout.html',
                controller: 'Logout'
            })
            .when('/sellers', {
                templateUrl: 'app/partials/sellers.html',
                controller: 'Sellers',
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
                templateUrl: 'app/partials/orders.html',
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
            .when('/store', {
                templateUrl: 'app/partials/buyer-tradeline.html',
                controller: 'BuyerTradeline'
            })
            .when('/cart', {
                templateUrl: 'app/partials/cart.html',
                controller: 'Cart'
            })
            .when('/checkout', {
                templateUrl: 'app/partials/checkout.html',
                controller: 'Checkout'
            })
            // FIXME make it so buyers get redirected to the store
		    .otherwise({redirectTo: '/tradelines'});
	}])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
        $rootScope.$on('$routeChangeStart', function(evt, next) {
            var userCanContinue = ['login', 'passwordReset', 'welcome', 'password'].reduce(function(prev, curr) {
                    return prev || next.$$route.originalPath.indexOf(curr) > -1;
                }, false);
            // if they're not already being redirected get the user;
            if(!($rootScope.userInfo && $rootScope.userInfo.id) && !userCanContinue) {
                AuthService.getUser(function(user) {
                    window.console.log(user);
                });
            }
        });
    }]);

});
