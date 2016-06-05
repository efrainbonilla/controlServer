/*global define*/

define(function() {
    'use strict';

    var ResettingResetController = function($scope, $state, $stateParams, RestWrapper, progression, notification, TranslationService) {
        this.$scope = $scope;
        this.progression = progression;
        this.notification = notification;
        this.translation = TranslationService;
        this.rest = RestWrapper;
        this.$stateParams = $stateParams;
        this.$state = $state;

        this.resetMsg();

        $scope.user = {};

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ResettingResetController.prototype.submitEdition = function($event, restEntry) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }

        this.progression.start();
        this.resetMsg();

        this.rest
            .updateOne(restEntry, 'reset', '/api/resetting/reset/' + this.$stateParams.token)
            .then(() => {
                this.progression.done();
                this.notification.log('change_password.flash.success', {
                    addnCls: 'humane-flatty-success'
                });
                this.$state.go('login');
            }, this.handleError.bind(this));
    };

    ResettingResetController.prototype.validateEntry = function() {
        if (!this.form.$valid) {
            this.notification.log('invalid form', {
                addnCls: 'humane-flatty-error'
            });
            return false;
        }

        return true;
    };

    ResettingResetController.prototype.resetMsg = function() {
        this.$scope.msg = {
            plainPassword: {
                first: '',
                second: ''
            }
        };
    };

    ResettingResetController.prototype.handleError = function(response) {
        var errorMessage = null;
        if (response.data && response.data.message) {
            errorMessage = response.data.message;
        } else if (response.data && response.data.errors) {
            if (response.data.errors.errors.length > 0) {
                errorMessage = response.data.errors.errors;
            } else if (response.data.errors.errors.length === 0 && response.data.errors.form) {
                if (response.data.errors.form.children) {
                    angular.forEach(response.data.errors.form.children, function(aitem, akey) {
                        if (angular.isObject(aitem) && aitem.errors) {
                            if (angular.isArray(aitem.errors)) {
                                this.$scope.msg[akey] = aitem.errors.join('\n');
                            } else {
                                this.$scope.msg[akey] = aitem.errors;
                            }
                        } else if (angular.isObject(aitem) && aitem.children) {
                            angular.forEach(aitem.children, function(bitem, bkey) {
                                if (angular.isObject(bitem) && bitem.errors) {
                                    if (angular.isArray(bitem.errors)) {
                                        this.$scope.msg[akey][bkey] = bitem.errors.join('\n');
                                    }
                                }
                            }.bind(this));
                        }
                        errorMessage = 'invalid form';
                    }.bind(this));
                } else {
                    errorMessage = response.data.errors.form;
                }
            }
        } else if (response.message) {
            errorMessage = response.message;
        } else {
            errorMessage = response;
        }

        this.progression.done();
        this.notification.log(errorMessage, {
            addnCls: 'humane-flatty-error'
        });
    };

    ResettingResetController.prototype.destroy = function() {
        this.$scope = undefined;
        this.progression = undefined;
        this.notification = undefined;
        this.translation = undefined;
        this.rest = undefined;
    };

    ResettingResetController.$inject = ['$scope', '$state', '$stateParams', 'RestWrapper', 'progression', 'notification', 'TranslationService'];

    return ResettingResetController;
});