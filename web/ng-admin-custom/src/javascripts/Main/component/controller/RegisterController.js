/*global define*/

define(function() {
	'use strict';

	var RegisterController = function($scope, $state, RestWrapper, progression, notification, TranslationService) {
		this.$scope = $scope;
		this.progression = progression;
		this.notification = notification;
		this.translation = TranslationService;
		this.rest = RestWrapper;
		this.$state = $state;

		$scope.user = {};
		$scope.msg = {
			plainPassword: {}
		};

		$scope.genders = [{
            label: 'Masculino',
            value: 'M'
        }, {
            label: 'Femenino',
            value: 'F'
        }];

		$scope.$on('$destroy', this.destroy.bind(this));
	};

	RegisterController.prototype.submitCreation = function($event, restEntry) {
		$event.preventDefault();
		if (!this.validateEntry()) {
			return;
		}

		this.progression.start();
		this.resetMsg();

		this.rest
			.createOne(restEntry, 'profile', '/api/register')
			.then(() => {
				this.progression.done();
				this.notification.log('registration.flash.user_created', {
					addnCls: 'humane-flatty-success'
				});
				this.$state.go('check_email_registration');

			}, this.handleError.bind(this));
	};

	RegisterController.prototype.validateEntry = function() {
		if (!this.form.$valid) {
			this.notification.log('invalid form', {
				addnCls: 'humane-flatty-error'
			});
			return false;
		}

		return true;
	};

	RegisterController.prototype.resetMsg = function() {
		angular.forEach(this.$scope.msg, (item, key) => {
			if (angular.isObject(item)) {
				angular.forEach(item, (bitem, bkey) => {
					this.$scope.msg[key][bkey] = '';
				});
			} else {
				this.$scope.msg[key] = '';
			}
		});
	};

	RegisterController.prototype.handleError = function(response) {
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

	RegisterController.prototype.destroy = function() {
		this.$scope = undefined;
		this.progression = undefined;
		this.notification = undefined;
		this.translation = undefined;
		this.rest = undefined;
		this.$state = undefined;
	};

	RegisterController.$inject = ['$scope', '$state', 'RestWrapper', 'progression', 'notification', 'TranslationService'];

	return RegisterController;
});