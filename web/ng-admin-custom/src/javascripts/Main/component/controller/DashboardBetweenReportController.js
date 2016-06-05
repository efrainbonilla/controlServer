/*global define*/

define(function() {
    'use strict';

    var DashboardBetweenReportController = function($scope, RestWrapper, progression, notification, UtilityService) {
        this.$scope = $scope;
        this.progression = progression;
        this.notification = notification;
        this.util = UtilityService;
        this.rest = RestWrapper;

        this.getOne('all', function(response) {
            this.$scope.alls = response;
        }.bind(this));

        this.getOne('day', function(response) {
            this.$scope.days = response;
        }.bind(this));

        this.getOne('dayBefore', function(response) {
            this.$scope.daysBefore = response;
        }.bind(this));

        this.getOne('week', function(response) {
            this.$scope.weeks = response;
        }.bind(this));

        this.getOne('weekBefore', function(response) {
            this.$scope.weeksBefore = response;
        }.bind(this));

        this.getOne('month', function(response) {
            this.$scope.months = response;
        }.bind(this));

        this.getOne('monthBefore', function(response) {
            this.$scope.monthsBefore = response;
        }.bind(this));

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DashboardBetweenReportController.prototype.getOne = function(dateFormat, cb) {

        this.progression.start();

        var dataDate = {
            optionDate: 'del',
            dataDate: {
                dateFormat: dateFormat
            }
        };

        var queryString = this.util.toQueryString(dataDate);


        this.rest
            .getOne('report', '/api/report?' + queryString)
            .then((data) => {
                this.progression.done();
                cb(data.originalElement);
            }, (response) => {
                this.progression.done();
                console.log(response.originalElement, "failed");
            });
    };


    DashboardBetweenReportController.prototype.destroy = function() {
        this.$scope = undefined;
        this.progression = undefined;
        this.notification = undefined;
        this.rest = undefined;
    };

    DashboardBetweenReportController.$inject = ['$scope', 'RestWrapper', 'progression', 'notification', 'UtilityService'];

    return DashboardBetweenReportController;
});