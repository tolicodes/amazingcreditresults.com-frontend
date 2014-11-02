define(['angular', 'controllers'], function(angular) {
    'use strict';

    return angular.module('myApp.controllers').controller('Sellers', ['$scope', 'AuthService', 'Resources', function($scope, AuthService, Resources) {
            $scope.view = {};
            AuthService.getUser();
            Resources.Sellers(function(data) {
                debugger;
                $scope.view.sellers = data;
            });
        }]);
});
