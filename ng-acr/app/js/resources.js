define(['angular'], function(angular) {
    'use strict';

    return angular.module('myApp.resources', []).factory('Resources', ['$http', function($http) {
        var baseUrl = 'api/v1/admin/clients',
            errorCb = function(res) {
                if(res.errors && res.errors.length > 0) {
                    window.alert(res.errors[0].message);
                }
            };
        return {
            Sellers: function(cb) {
                $http.get(baseUrl + '?sellers=true')
                    .success(function(res) {
                        cb(res.data);
                    })
                    .error(errorCb);
            },
            // creates any user Object.
            // Simply change the roles object to reflect the users capabilities
            // { buyer: true, seller: true, owner: true }
            Post: function(obj, cb) {
                $http.post(baseUrl (obj.id ? '/' + obj.id : '' ), obj)
                    .success(cb)
                    .error(errorCb);
            }
        };
    }]);
});
