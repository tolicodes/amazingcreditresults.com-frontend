define(['angular'], function(angular) {
    'use strict';

    return angular.module('myApp.resources', []).factory('Resources', ['$http', 'numberWithCommasFilter', function($http, numberWithCommas) {
        var baseUrl = 'api/v1/',
            adminBase = baseUrl + 'admin/',
            adminRoute = adminBase + 'clients',
            productRoute = baseUrl + 'seller/products',
            orderRoute = baseUrl + 'auPurchases',
            tradelineRoute = baseUrl + 'seller/tradelines',
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
                p.reportsTo = p.reportsTo ? p.reportsTo.join(' ') : ''; 
                p.niceName = [p.type, p.bank, p.name].join(' ');
                return p;
            },
            makeNiceTradeline = function(t) {
                t.nicePrice = numberWithCommas(t.price);
                t.niceLimit = numberWithCommas(t.creditLimit);
                return t;
            };
        return {
            // Tradelines
            Tradelines: function(cb) {
                $http.get(tradelineRoute)
                    .success(function(res) {cb(res.data);})
                    .error(errorCb);
            },
            // Save any Tradeline
            SaveTradeline: function(obj, cb) {
                $http[obj.id ? 'put' : 'post'](tradelineRoute + (obj.id ? '/' + obj.id : '' ), obj)
                    .success(cb)
                    .error(errorCb);
            },
            DeleteTradeline: function(id, cb) {
                $http.delete([tradelineRoute, '/', id].join(''))
                    .success(cb)
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
            DeleteProduct: function(id, cb) {
                $http.delete([productRoute, '/', id].join(''))
                    .success(cb)
                    .error(errorCb);
            },
            SaveSelf: function(obj, cb) {
                $http.put(baseUrl + 'myself', obj)
                    .success(cb)
                    .error(errorCb);
            },
            // expects username and password
            SetPassword: function(obj, cb) {
                $http.post(baseUrl + 'account/setPassword', obj)
                    .success(cb)
                    .error(errorCb);
            },
            // expects username
            ResetPassword: function(obj, cb) {
                $http.post(baseUrl + 'account/resetPassword', obj)
                    .success(cb)
                    .error(errorCb);
            },
            Account: function(cb) {
                $http.get(baseUrl + 'myself/transactions')
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
                $http.post(adminRoute + '/welcome/' + id)
                    .success(function(res) { cb(res); })
                    .error(errorCb);
            },
            resetPassword: function(id, cb) {
                $http.post(adminRoute + '/resetPassword/' + id)
                    .success(function(res) { cb(res); })
                    .error(errorCb);
            },
            verifyPhone: function(cb) {
                $http.get(baseUrl + 'verifyPhone')
                    .success(cb)
                    .error(errorCb);
            },
            // creates any user Object.
            // Simply change the roles object to reflect the users capabilities
            // { buyer: true, seller: true, owner: true }
            SaveUser: function(obj, cb) {
                var saveRoute = adminBase + (obj.roles.owner ? 'owners' : 'clients');
                $http[obj.id ? 'put' : 'post'](saveRoute + (obj.id ? '/' + obj.id : '' ), obj)
                    .success(cb)
                    .error(errorCb);
            },
            DeleteUser: function(id, cb) {
                $http.delete([adminRoute, id].join('/'))
                    .success(cb)
                    .error(errorCb);
            },
            Buyer: {
                getTradelines: function(cb) {
                    $http.get(baseUrl + 'tradelines')
                        .success(function(data) {
                            data.data = data.data.map(makeNiceTradeline);
                            cb(data);
                        })
                        .error(errorCb);
                },
                getCart: function(cb) {
                    $http.get(baseUrl + 'cart/tradelines')
                        .success(function(data) {
                            cb(data.data.map(makeNiceTradeline));
                        })
                        .error(errorCb);
                },
                addTradeline: function(id, success, failure) {
                    $http.post(baseUrl + 'cart/tradelines', {id: id})
                        .success(success)
                        .error(failure);
                },
                removeTradeline: function(id, cb) {
                    $http.delete(baseUrl + 'cart/tradelines/' + id)
                        .success(cb)
                        .error(errorCb);
                }
            }
        };
    }]);
});
