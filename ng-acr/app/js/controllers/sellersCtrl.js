define(['angular', 'table', 'controllers'], function(angular) {
    'use strict';

    return angular.module('myApp.controllers').controller('Sellers', ['$scope', 'AuthService', 'Resources', 'ngTableParams', function($scope, AuthService, Resources, ngTable) {
            // TODO move this to on route change success
            AuthService.getUser();

            $scope.view = {
                form: {
                    create: function() {
                        $scope.view.form.model.roles = {
                            seller: true,
                            buyer: false,
                            owner: false
                        };
                        Resources.Post($scope.view.form.model, function(/* newObj */) {
                            // Refresh the table data
                            $scope.view.tableParams.reload();
                            $scope.view.form.model = {};
                        });
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
                            $defer.resolve(data);
                        });
                    }
                })
            };
        }]);
});
