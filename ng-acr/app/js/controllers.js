'use strict';

define(['angular', 'services'], function (angular) {

	/* Controllers */
	
	return angular.module('myApp.controllers', ['myApp.services'])
        .controller('Login', ['$scope', '$http', '$q', '$window', 'AuthService', function($scope, $http, $q, $window, AuthService) {
            // credentials to login with
            $scope.creds = {
                username: '',
                password: ''
            };

            // the functions that do things
            $scope.do = {
                login: function() {
                    AuthService.login($scope.creds);
                }
            }
        }])
        .factory('AuthService', function($http, Session) {
            var authservice = {
                login: function(credentials) {
                    return $http
                        .post('/api/v1/owner/login', credentials)
                        .then(function(res) {
                            debugger;
                        });
                }
            }
        });
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
