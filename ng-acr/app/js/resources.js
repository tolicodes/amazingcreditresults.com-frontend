define(['angular'], function(angular) {
    'use strict';

    return angular.module('myApp.resources', []).factory('Resources', ['$http', function($http) {
        var baseUrl = 'api/v1/admin/clients?';
        return {
            Sellers: function(cb) {
                $http.get(baseUrl + 'sellers=true')
                    .success(function(res) {
                        cb(res.data);
                    })
                    .error(function() {
                    });
            },
            Seller: function(obj, cb) {
            }
        };
    }]);
});
