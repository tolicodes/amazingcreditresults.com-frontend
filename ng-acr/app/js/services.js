'use strict';

define(['angular', 'humane'], function (angular, humane) {
	
	/* Services */

	// Demonstrate how to register services
	// In this case it is a simple value service.
	angular.module('myApp.services', [])
		.value('version', '0.1')
        .factory('AuthService', ['$http', '$window', '$location', '$rootScope', function($http, $window, $location, $rootScope) {
            var userInfo = {},
                roles = {
                    admin: 0,
                    seller: 1,
                    buyer: 2
                },
                huntKey = function(key) {
                    // if no key, try and get from the session
                    if(angular.isUndefined(key)) {
                        // if they have a session, use it
                        if($window.sessionStorage.ACRUserInfo) {
                            key = $window.JSON.parse($window.sessionStorage.ACRUserInfo).huntKey;
                        } else {    // otherwise just stop and let them know it failed
                            return false;
                        }
                    } else if(key === false) { // If we're logging out
                        userInfo = {};
                        $rootScope.userInfo = userInfo;
                    }
                    // userInfo.id = data.id;
                    userInfo.huntKey = key;
                    // TODO remove the code from data before saving
                    $window.sessionStorage.ACRUserInfo = $window.JSON.stringify(userInfo);
                    // set the hunt key on the header so future requests work
                    $http.defaults.headers.common.huntKey = key;
                    // return the key
                    return key;
                };
            var authservice = {
                login: function(credentials, errorCb) {
                    $http.post('/api/v1/account/login', credentials)
                        .success(function(data) {
                            huntKey(data.huntKey);
                            userInfo.roles = data.roles;
                            $rootScope.userInfo = userInfo;
                            // Redirect buyers to the store, everyone else to the tradeline page
                            if(userInfo.roles.buyer) {
                                // TODO do automatic redirects back to the page users tried to visit in the first place
                                $location.path('/store');
                            } else {
                                $location.path('/tradelines');
                            }
                        })
                        .error(function(res) {
                            errorCb(res.errors[0].message);
                        });
                },
                logout: function() { huntKey(false); },
                // get the user if we already have him, otherwise go get and give it up.
                getUser: function(cb) {
                    cb = cb || function() {return false;};
                    if(userInfo.id) {
                        // give it back to the function
                        cb(userInfo);
                    } else if(huntKey()) {
                        $http.get('/api/v1/myself')
                            .success(function(user) {
                                userInfo = user;
                                $rootScope.userInfo = user;
                                // set userInfo
                                cb(userInfo);
                            })
                            // fallback just in case, this should never happen
                            .error(function() { window.console.log('error getting myself, but huntkey() worked'); });
                    } else {
                        // if we can't get the user, redirect them to login
                        $location.path('/login');
                    }
                },
                // simply return the role id for the requested role
                role: function(what) {
                    return roles[what];
                },
                canUser: function() {
                }

            };
            return authservice;
		}])
        .factory('utils', ['AuthService', 'Resources', 'ngTableParams', 'numberWithCommasFilter', function(AuthService, Resources, ngTable, numberWithCommas) {
            return {
                bootstrapTradelinesListScope: function($scope) {
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
                        // to make it accessible from everywhere
                        getCart: getCart,
                        removeFromCart: function(id) {
                            Resources.Buyer.removeTradeline(id, function() {
                                humane.log('Tradeline removed');
                                getCart();
                            });
                        }
                    };

                    getCart();
                },
                bootstrapScope: function($scope, which) {
                    var roles = {
                            seller: false,
                            buyer: false,
                            owner: false
                        },
                        // returns the base model used to reset the form
                        defaultModel = function(isUser) { return (isUser ? {roles: roles} : {}); },
                        isUserPage = (which in roles),
                        // the method for the resources service to use
                        method = null;

                    // just in case
                    which = which.toLowerCase();

                    if(isUserPage) {
                        // turn on the role this factory is boostrapping for
                        roles[which] = true;
                    }

                    // used to determine the resource methods we choose
                    if(isUserPage) {
                        method = 'User';
                    } else {
                        method = which[0].toUpperCase() + which.substr(1);
                    }

                    // set the object that the view will be using to access the variables to show the information
                    $scope.view = {
                        form: {
                            // load use for the form to edit
                            loadRow: function(who) { $scope.view.form.model = who; },
                            // save the model
                            save: function() {
                                Resources['Save' + method]($scope.view.form.model, function() {
                                    // Refresh the table data
                                    $scope.view.tableParams.reload();
                                    $scope.view.form.model = defaultModel(isUserPage);
                                    $scope.view.form.info = method + ' Saved';
                                });
                            },
                            delete: function() {
                                Resources['Delete' + method]($scope.view.form.model.id, function() {
                                    // Refresh the table data
                                    $scope.view.tableParams.reload();
                                    $scope.view.form.model = defaultModel(isUserPage);
                                    $scope.view.form.info = method + ' Deleted';
                                });
                            },
                            sendWelcomeEmail: function(id) {
                                Resources.sendWelcomeEmail(id, function(res) {
                                    $scope.view.form.info = 'Welcome message sent!';
                                    window.console.log(res.welcomeLink.replace(':3000', ''));
                                    // TODO add a timeout here to make the message disappear
                                    // make it piggy back off of ng-if or ng-show
                                });
                            },
                            resetPassword: function(id) {
                                Resources.resetPassword(id, function(res) {
                                    $scope.view.form.info = 'Password Reset Email Sent!';
                                    window.console.log(res.welcomeLink.replace(':3000', ''));
                                });
                            },
                            clear: function() {
                                $scope.view.model = defaultModel(isUserPage);
                            },
                            model: defaultModel(isUserPage)
                        },
                        tableParams: new ngTable({
                            page: 0,
                            count: 10,
                            sorting: {
                                name: 'asc'
                            }
                        }, {
                            counts: [],
                            total: 1,
                            getData: function($defer) {
                                Resources[which[0].toUpperCase() + which.substr(1) + 's'](function(data) {
                                    $defer.resolve(data);
                                });
                            }
                        })
                    };
                }
            };
        }]);
});
