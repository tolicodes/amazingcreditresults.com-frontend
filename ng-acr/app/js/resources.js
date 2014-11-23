define(['angular'], function(angular) {
    'use strict';

    return angular.module('myApp.resources', []).factory('Resources', ['$http', function($http) {
        var baseUrl = 'api/v1/',
            adminBase = baseUrl + 'admin/',
            adminRoute = adminBase + 'clients',
            productRoute = baseUrl + 'owner/products',
            orderRoute = baseUrl + 'owner/orders',
            tradelineRoute = baseUrl + 'owner/tradelines',
            errorCb = function(res) {
                if(res.errors && res.errors.length > 0) {
                    window.alert(res.errors[0].message);
                }
            },
            makeNiceName = function(u) {
                u.fullName = [u.name.givenName, u.name.familyName].join(' ');
                return u;
            },
            makeNiceProduct = function(p) {
                p.reportsTo = p.reportsTo.join(' ');
                return p;
            };
        return {
            // Tradelines
            Tradelines: function(cb) {
                $http.get(tradelineRoute)
                    .success(function(res) {cb(res.data);})
                    .error(errorCb);
            },
            // Orders
            Orders: function(cb) {
                $http.get(orderRoute)
                    .success(function(res) {cb(res.data);})
                    .error(errorCb);
            },
            // Products
            Products: function(cb) {
                $http.get(productRoute)
                    .success(function(res) {cb(res.data.map(makeNiceProduct));})
                    .error(errorCb);
            },
            // Save any Product
            SaveProduct: function(obj, cb) {
                $http[obj.id ? 'put' : 'post'](productRoute + (obj.id ? '/' + obj.id : '' ), obj)
                    .success(cb)
                    .error(errorCb);
            },
            Account: function(cb) {
                $http.get(baseUrl + 'account')
                    .success(function(res) {
                        cb(res);
                        // debugger;
                    })
                    .error(errorCb);
            },
            // GET Sellers
            Sellers: function(cb) {
                $http.get(adminRoute + '?seller=true')
                    .success(function(res) {cb(res.data.map(makeNiceName));})
                    .error(errorCb);
            },
            // GET Buyers
            Buyers: function(cb) {
                $http.get(adminRoute + '?buyer=true')
                    .success(function(res) {cb(res.data.map(makeNiceName));})
                    .error(errorCb);
            },
            // GET Owners
            Owners: function(cb) {
                $http.get(adminRoute + '?owner=true')
                    .success(function(res) {cb(res.data.map(makeNiceName));})
                    .error(errorCb);
            },
            sendWelcomeEmail: function(id, cb) {
                $http.get(adminRoute + '/welcome/' + id)
                    .success(function(res) { cb(res); })
                    .error(errorCb);
            },
            resetPassword: function(id, cb) {
                $http.get(adminRoute + '/resetPassword/' + id)
                    .success(function(res) { cb(res); })
                    .error(errorCb);
            },
            // creates any user Object.
            // Simply change the roles object to reflect the users capabilities
            // { buyer: true, seller: true, owner: true }
            SaveUser: function(obj, cb) {
                var saveRoute = adminBase + (obj.roles.owner ? 'owners' : 'client');
                $http[obj.id ? 'put' : 'post'](saveRoute + (obj.id ? '/' + obj.id : '' ), obj)
                    .success(cb)
                    .error(errorCb);
            }
        };
    }]);
});
