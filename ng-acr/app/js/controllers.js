define(['angular'], function (angular) {
    'use strict';

	/* Controllers */
	return angular.module('myApp.controllers', ['myApp.services', 'myApp.resources'])
        /*
         *  Controllers for pages regardless of user type.
         *
         */
        .controller('Login', ['$scope', '$routeParams', 'AuthService', function($scope, $routeParams, AuthService) {
            // credentials to login with
            $scope.creds = {
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
            $scope.view = {secondLeftToRedirect: 3};
            var interval = $window.setInterval(function() {
                if($scope.view.secondLeftToRedirect-- <= 1) {
                    $location.path('/login');
                    $window.clearInterval(interval);
                }
                $scope.$apply();
            }, 1000);
        }])
        .controller('PasswordReset', ['$scope', '$window', '$location', 'Resources', function($scope, $window, $location, Resources) {
            $scope.form = {
                show: true,
                model: {},
                resetPassword: function() {
                    Resources.ResetPassword($scope.form.model, function(data) {
                        $scope.form.show = false;
                        // let the user know
                        $scope.form.message = data.message;
                    });
                }
            };
        }])
        .controller('PasswordSet', ['$scope', '$routeParams', 'Resources', function($scope, $routeParams, Resources) {
            $scope.form = {
                model: {
                    apiKey: $routeParams.apiKey
                },
                setPassword: function() {
                    Resources.SetPassword($scope.form.model, function() {
                        $scope.form.message = 'Password set. Please login';
                    });
                }
            };
        }])
        .controller('Welcome', ['$scope', '$window', '$routeParams', '$location', 'Resources',  function($scope, $window, $routeParams, $location, Resources) {
           $scope.form = {
                model: {
                    apiKey: $routeParams.apiKey
                },
                setPassword: function() {
                    var msg = 'Password set. Redirecting in ',
                        secondsLeftToRedirect = 3;
                    Resources.SetPassword($scope.form.model, function() {
                        $scope.form.passwordSet = true;
                        var interval = $window.setInterval(function() {
                            if(secondsLeftToRedirect-- <= 1) {
                                $location.path('/login');
                                $window.clearInterval(interval);
                            }
                            $scope.form.message = msg + secondsLeftToRedirect;
                            $scope.$apply();
                        }, 1000);
                    });
                }
           };
        }])
        .controller('Account', ['$scope', 'Resources', 'AuthService', function($scope, Resources, AuthService) {
            $scope.view = {
                verifyPhone: function() {
                    Resources.verifyPhone(function(res) {
                        window.console.log(res);
                        //debugger;
                    });
                },
                form: {
                    save: function() {
                                Resources.SaveSelf($scope.view.form.model, function() {
                                });
                    }
                }
            };

            AuthService.getUser(function(user) {
                $scope.view.form.model = user;
            });
        }])
        /*
         *  Owners
         */
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
        /*
         *  Sellers
         */
        .controller('Products', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'product');
        }])
        .controller('Tradelines', ['$scope', 'utils', 'AuthService', 'Resources', function($scope, utils, AuthService, Resources) {
            utils.bootstrapScope($scope, 'tradeline');

            Resources.Products(function(data) { $scope.view.productList = data; });

            AuthService.getUser(function(user) {
                if(user.roles.owner) {
                    Resources.Sellers(function(data) { $scope.view.sellerList = data; });
                }
            });
        
        
        }])
        .controller('Orders', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapScope($scope, 'order');
        }])
        /*
         *  Buyers
         */
        .controller('BuyerTradeline', ['$scope', 'Resources', function($scope, Resources) {
            $scope.view = {
                tradelines: [],
                addToCart: function(id) {
                    Resources.Buyer.addTradeline(id, function() {
                        $scope.view.message = 'Tradeline added to Cart';
                    }, function() {
                    });
                }
            };
            Resources.Buyer.getTradelines(function(data) {
                $scope.view.tradelines = data.data;
                window.console.log(data.data[0]);
            });
        }])
        .controller('Cart', ['$scope', 'Resources', 'numberWithCommasFilter', function($scope, Resources, numberWithCommas) {
            var getCart = function() {
                Resources.Buyer.getCart(function(data) {
                    $scope.view.items = data;
                    $scope.view.itemsInCart = data.itemsInCart;
                    $scope.view.total = numberWithCommas(data.reduce(function(prev, curr) {
                        return prev + curr.price;
                    }, 0));
                });
            };
            $scope.view = {
                items: [],
                itemsInCart: 0,
                total: 0,
                removeFromCart: function(id) {
                    Resources.Buyer.removeTradeline(id, function() {
                        $scope.view.message = 'Tradeline removed';
                        getCart();
                    });
                }
            };

            getCart();
        }]);
});
