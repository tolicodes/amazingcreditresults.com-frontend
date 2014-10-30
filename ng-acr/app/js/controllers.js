'use strict';

define(['angular', 'services'], function (angular) {

	/* Controllers */
	
	return angular.module('myApp.controllers', ['myApp.services'])
        .controller('Login', ['$scope', 'AuthService', function($scope, AuthService) {
            // credentials to login with
            $scope.creds = {
                username: '',
                password: ''
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
        .factory('AuthService', ['$http', '$window', '$location', '$rootScope', function($http, $window, $location/*, $rootScope*/) {
            var userInfo = false;
            var authservice = {
                login: function(credentials, errorCb) {
                    return $http
                        .post('/api/v1/owner/login', credentials)
                        .success(function(data) {
                            // userInfo.id = data.id;
                            // userInfo.huntKey = data.huntKey;
                            // TODO remove the code from data before saving
                            // $window.sessionStorage.userInfo = $window.JSON.stringify(userInfo);
                            //
                            //
                            //
                            // set the hunt key on the header so future requests work
                            $http.defaults.headers.common.huntKey = data.huntKey;

                            // redirect the user to the sellers page
                            // TODO do automatic redirects back to the page users tried to visit in the first place
                            $location.path('/sellers');
                        })
                        .error(function(res) {
                            errorCb(res.errors[0].message);
                        });
                },
                getUser: function(cb) {
                    if(userInfo) {
                        cb(userInfo);
                    } else {
                        $http.get('/api/v1/myself', function(data) {
                            // set userInfo
                            userInfo = data;
                            cb(userInfo);
                        });
                    }
                }
            };
            return authservice;
        }])
		// Sample controller where service is being used
		.controller('MyCtrl1', ['$scope', 'version', function ($scope, version) {
			$scope.scopedAppVersion = version;
		}])
		// More involved example where controller is required from an external file
		.controller('MyCtrl2', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/myctrl2'], function(myctrl2) {
				// injector method takes an array of modules as the first argument
				// if you want your controller to be able to use components from
				// any of your other modules, make sure you include it together with 'ng'
				// Furthermore we need to pass on the $scope as it's unique to this controller
				$injector.invoke(myctrl2, this, {'$scope': $scope});
			});
		}]);
});
