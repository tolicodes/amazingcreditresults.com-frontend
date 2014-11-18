define(['angular', 'table', 'controllers'], function(angular) {
    'use strict';

    return angular.module('myApp.controllers').controller('Buyers', ['$scope', 'AuthService', 'Resources', 'ngTableParams', function($scope, AuthService, Resources, ngTable) {
            // TODO move this to on route change success
            AuthService.getUser();

            $scope.view = {
                form: {
                    create: function() {
                        $scope.view.form.model.roles = {
                            seller: false,
                            buyer: true,
                            owner: false
                        };
                        Resources.Post($scope.view.form.model, function(/* newObj */) {
                            // Refresh the table data
                            $scope.view.tableParams.reload();
                            $scope.view.form.model = {};
                        });
                    }
                },
                // TODO perhaps make this a service
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
                        Resources.Buyers(function(data) {
                            $defer.resolve(data);
                        });
                    }
                })
            };
        }]);
});
