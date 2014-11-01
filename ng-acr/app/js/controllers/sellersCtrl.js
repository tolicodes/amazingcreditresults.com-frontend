define(['angular', 'controllers'], function(angular, controllers) {
    'use strict';

    return angular.module('myApp.controllers').controller('Sellers', ['$scope', 'AuthService', function($scope, AuthService) {
            AuthService.getUser(function(a) {
            });
        }]);
});
