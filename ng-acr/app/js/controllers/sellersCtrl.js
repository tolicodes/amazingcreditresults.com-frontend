define(['angular', 'table', 'controllers'], function(angular, table) {
    'use strict';

    return angular.module('myApp.controllers').controller('Sellers', ['$scope', 'AuthService', 'Resources', 'ngTableParams', function($scope, AuthService, Resources, ngTable) {
            // TODO move this to on route change success
            AuthService.getUser();
            table;


            $scope.view = {
                form: {
                    create: function() {
                    }
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
                        Resources.Sellers(function(data) {
                            $defer.resolve(data.map(function(u) {
                                u.fullName = [u.name.givenName, u.name.familyName].join(' ');
                                return u;
                            }));
                        });
                    }
                })
            };
        }]);
});
