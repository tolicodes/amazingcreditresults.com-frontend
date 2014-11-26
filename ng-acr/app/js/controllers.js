define(['angular'], function (angular) {
    'use strict';

	/* Controllers */
	return angular.module('myApp.controllers', ['myApp.services', 'myApp.resources'])
        .controller('Login', ['$scope', '$routeParams', 'AuthService', function($scope, $routeParams, AuthService) {
            // credentials to login with
            $scope.creds = {
                username: '',
                password: '',
                apiKey: $routeParams.apiKey,
                role: 'buyer'
            };
            $scope.res = {
                message: false
            };

            // the functions that do things
            $scope.do = {
                login: function() {
                    AuthService.login($scope.creds, function(err) {
                        // Show the error to the user
                        $scope.res.message = err;
                    });
                }
            };
        }])
        .controller('Logout', ['$scope', '$window', 'AuthService', '$location', function($scope, $window, AuthService, $location) {
            AuthService.logout();
            $scope.view = {secondLeftToRedirect: 5};
            var interval = $window.setInterval(function() {
                if($scope.view.secondLeftToRedirect-- <= 1) {
                    $location.path('/login');
                    $window.clearInterval(interval);
                }
                $scope.$apply();
            }, 1000);
        }])
        .controller('Account', ['$scope', 'Resources', function($scope, Resources) {
            $scope.view = {
                verifyPhone: function() {
                    Resources.verifyPhone(function(res) {
                        window.console.log(res);
                        //debugger;
                    });
                }
            };
            // Resources.Account(function() {
                // debugger;
            // });
        }])
        .controller('Sellers', ['$scope', 'utils', function($scope, utils) {
            // services.js
            utils.bootstrapScope($scope, 'seller');
        }])
        .controller('Buyers', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'buyer');
        }])
        .controller('Owners', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'owner');
        }])
        .controller('Products', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'product');
        }])
        .controller('Tradelines', ['$scope', 'utils', 'Resources', function($scope, utils, Resources) {
            utils.bootstrapScope($scope, 'tradeline');

            Resources.Products(function(data) { $scope.view.productList = data; });
            // TODO only get this if we're an admin
            Resources.Sellers(function(data) { $scope.view.sellerList = data; });
        //
        //
        // Not needed for now
        //}])
        //.controller('Orders', ['$scope', 'utils', function($scope, utils) {
            //utils.bootstrapScope($scope, 'order');
        }]);
});
