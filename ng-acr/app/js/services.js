'use strict';

define(['angular'], function (angular) {
	
	/* Services */

	// Demonstrate how to register services
	// In this case it is a simple value service.
	angular.module('myApp.services', [])
		.value('version', '0.1')
        .factory('AuthService', ['$http', '$window', '$location', '$rootScope', function($http, $window, $location/*, $rootScope*/) {
            var userInfo = {},
                roles = {
                    admin: 0,
                    seller: 1,
                    buyer: 2
                },
                huntKey = function(key) {
                    // if no key, try and get from the session
                    if(!key) {
                        // if they have a session, use it
                        if($window.sessionStorage.ACRUserInfo) {
                            key = $window.JSON.parse($window.sessionStorage.ACRUserInfo).huntKey;
                        } else {    // otherwise just stop and let them know it failed
                            return false;
                        }
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
                    $http.post('/api/v1/owner/login', credentials)
                        .success(function(data) {
                            huntKey(data.huntKey);
                            // redirect the user to the sellers page
                            // TODO do automatic redirects back to the page users tried to visit in the first place
                            $location.path('/sellers');
                        })
                        .error(function(res) {
                            errorCb(res.errors[0].message);
                        });
                },
                // get the user if we already have him, otherwise go get and give it up.
                getUser: function(cb) {
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
                            .error(function(d) { console.log('error getting myself, but huntkey() worked'); });
                    } else {
                        // if we can't get the user, redirect them to login
                        $location.path('/login');
                    }
                },
                // simply return the role id for the requested role
                role: function(what) {
                    return roles[what];
                },
                canUser: function(what) {
                }

            };
            return authservice;
		}]);
});
