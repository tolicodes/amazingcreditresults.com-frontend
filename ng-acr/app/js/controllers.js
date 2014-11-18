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
        .controller('Sellers', ['$scope', 'usersCrud', function($scope, usersCrud) {
            // services.js
            usersCrud.bootstrapScope($scope, 'seller');
        }])
        .controller('Buyers', ['$scope', 'usersCrud', function($scope, usersCrud) {
            usersCrud.bootstrapScope($scope, 'buyer');
        }])
        .controller('Owners', ['$scope', 'usersCrud', function($scope, usersCrud) {
            usersCrud.bootstrapScope($scope, 'owner');
        }]);
});
