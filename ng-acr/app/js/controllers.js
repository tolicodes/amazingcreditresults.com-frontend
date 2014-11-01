define(['angular', 'services'], function (angular) {
    'use strict';

	/* Controllers */
	return angular.module('myApp.controllers', ['myApp.services'])
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
});
