define(['angular'], function (angular) {
    'use strict';

	/* Controllers */
	return angular.module('myApp.controllers', ['myApp.services', 'myApp.resources'])
        .controller('Login', ['$scope', 'AuthService', function($scope, AuthService) {
            // credentials to login with
            $scope.creds = {
                username: '',
                password: ''
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
        .controller('Tradelines', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'tradeline');
        }])
        .controller('Orders', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'order');
        }]);
});
