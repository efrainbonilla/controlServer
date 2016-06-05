/*global define*/

define(function () {
    'use strict';

    var ProfileController = function ($scope, UserService, RestWrapper, progression, notification, TranslationService) {
        this.$scope = $scope;
        this.progression = progression;
        this.notification = notification;
        this.translation = TranslationService;
        this.rest = RestWrapper;

        $scope.msg = {};
        $scope.user = UserService.getUser();

        $scope.genders = [{
            label: 'Masculino',
            value: 'M'
        }, {
            label: 'Femenino',
            value: 'F'
        }];

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ProfileController.prototype.submitEdition = function($event, restEntry) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }

        this.progression.start();
        this.resetMsg();

        this.rest
            .updateOne(restEntry, 'profile', '/api/profile')
            .then(() => {
                this.progression.done();
                this.notification.log('profile.flash.updated', { addnCls: 'humane-flatty-success' });
                this.$scope.user.current_password = '';
            }, this.handleError.bind(this));
    };

    ProfileController.prototype.validateEntry = function() {
        if (!this.form.$valid) {
            this.notification.log('invalid form', {
                addnCls: 'humane-flatty-error'
            });
            return false;
        }

        return true;
    };

    ProfileController.prototype.resetMsg = function() {
        angular.forEach(this.$scope.msg, function(item, key) {
            if (this.$scope.msg[key]) {
                this.$scope.msg[key] = '';
            }
        }.bind(this));
    };

    ProfileController.prototype.handleError = function (response) {
        var errorMessage = null;
        if (response.data && response.data.message) {
            errorMessage = response.data.message;
        } else if (response.data && response.data.errors) {
            if (response.data.errors.errors.length > 0) {
                errorMessage = response.data.errors.errors;
            } else if(response.data.errors.errors.length === 0 && response.data.errors.form) {
                if (response.data.errors.form.children) {
                    angular.forEach(response.data.errors.form.children, function (item, id) {
                        if (angular.isObject(item) && item.errors) {
                            if (angular.isArray(item.errors)) {
                                this.$scope.msg[id] = item.errors.join('\n');
                            } else {
                                this.$scope.msg[id] = item.errors;
                            }
                        }
                        errorMessage = 'Formulario invalido.';
                    }.bind(this));
                } else{
                    errorMessage = response.data.errors.form;
                }
            }
        } else if (response.message) {
            errorMessage = response.message;
        } else {
            errorMessage = response;
        }

        this.progression.done();
        this.notification.log(errorMessage, {addnCls: 'humane-flatty-error'});
    };

    ProfileController.prototype.destroy = function () {
        this.$scope = undefined;
        this.progression = undefined;
        this.notification = undefined;
        this.translation = undefined;
        this.rest = undefined;
    };

    ProfileController.$inject = ['$scope', 'UserService', 'RestWrapper', 'progression', 'notification', 'TranslationService'];

    return ProfileController;
});
