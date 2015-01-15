// FIXME remove stripe as a main dependency
define(['angular', 'humane', 'stripe'], function (angular, humane, Stripe) {
    'use strict';

    // Set stripe key
    Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

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
                verifyUser: function() {
                    // TODO actually make it so you can verify a user
                    Resources.Buyer.verifyUser(function() {
                        debugger;
                    });
                },
                saveACH: function() {
                    Resources.Buyer.saveACH($scope.view.form.achModel, function() {
                        humane.log('ACH info saved');
                    });
                },
                verifyACH: function() {
                    Resources.Buyer.verifyACH($scope.view.form.verifyModel, function() {
                        humane.log('ACH info verified');
                    });
                },
                form: {
                    save: function() {
                        Resources.SaveSelf($scope.view.form.model, function() {
                            humane.log('User Updated');
                        });
                    },
                    achModel: { meta: { test: true } },
                    verifyModel: { meta: { test: true } }
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
        .controller('Buyers', ['$scope', 'utils', 'Resources', function($scope, utils, Resources) {
            var today = new Date();
            utils.bootstrapScope($scope, 'buyer');
            $scope.view.accountCreditModel = {
                date: [today.getYear(), today.getMonth(), today.getDate()].join('-'),
                paidBy: 'Credit Card'
            };
            $scope.view.addAccountCredit = function() {
                Resources.Owner.addAccountCredit($scope.view.form.model.id, $scope.view.accountCreditModel, function() {
                    $scope.view.tableParams.reload();
                    humane.log($scope.view.accountCreditModel.amount + ' added to user.');
                });
            };
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
                        humane.log('Tradeline added to Cart');
                    }, function() {
                    });
                }
            };
            Resources.Buyer.getTradelines(function(data) {
                $scope.view.tradelines = data.data;
                window.console.log(data.data[0]);
            });
        }])
        .controller('Cart', ['$scope', 'utils', function($scope, utils) {
            utils.bootstrapTradelinesListScope($scope);
        }])
        .controller('Checkout', ['$scope', '$window', 'Resources', 'utils', function($scope, $window, Resources, utils) {
            utils.bootstrapTradelinesListScope($scope);
            // for the user credit amount
            Resources.Buyer.getBalance(function(data) {
                $scope.view.accountBalance = data.balance;
            });
            // make it so they can't checkout yet
            $scope.view.payWith = false;

            // card model to be shared with stripe
            $scope.view.cardModel = {
                number: '',
                exp_month: 12,
                exp_year: 2014,
                cvc: ''
            };

            // Check the person out and move on to the next step if all is well
            $scope.view.checkout = function() {
                var model = {},
                    requestCheckout = function(m) {
                        Resources.Buyer.checkout(m, function(res, code) {
                            if(code === 201) {
                                $scope.view.getCart();
                                humane.log('Items paid for! Thank you for your Business');
                            } else {
                                // add code here for when things don't go so great
                                // debugger;
                                humane.log('Error');
                            }
                        });
                    };
                // don't even go through if there is no payment method
                if(!$scope.view.payWith) {
                    humane.log('Please choose a method of payment');
                    return;
                } else if($scope.view.payWith === 'cc') {
                    // add stripe stuff here
                    Stripe.card.createToken($window.document.getElementById('credit-card-form'), function(code, res) {
                        // if the card request isn't right
                        if(code !== 200) {
                            // let the user know the error with the card
                            humane.log(res.error.message);
                        } else {
                            // set the credit card token
                            model.creditCardToken = res.id;
                            // submit the token
                            requestCheckout(model);
                        }
                    });
                } else { 
                    if($scope.view.payWith === 'ach') {
                        model.useAchAccount = true;
                    } else if($scope.view.payWith === 'bal') {
                        model.amountAccountCredit = 1000;
                    }
                    requestCheckout(model);
                }

            };
        }]);
});
