/*global define*/

define(function() {
	'use strict';

	var ResettingController = function($scope, $state, RestWrapper, progression, notification, TranslationService) {
		this.$scope = $scope;
		this.progression = progression;
		this.notification = notification;
		this.translation = TranslationService;
		this.rest = RestWrapper;
		this.$state = $state;

		$scope.user = {};
		$scope.msg = {};

		$scope.$on('$destroy', this.destroy.bind(this));
	};

	ResettingController.prototype.submitEdition = function($event, restEntry) {
		$event.preventDefault();
		if (!this.validateEntry()) {
			return;
		}

		this.progression.start();
		this.resetMsg();
		this.$scope.errorMessage = false;

		this.rest
			.oneUrl('resetting', '/api/resetting/send-email')
			.customPOST(restEntry)
			.then((values) => {
				this.progression.done();
				var redirectState = values.headers('Redirect-Route-Name');
				if (this.$state.get(redirectState)) {
					this.$state.go(redirectState, values.data.originalElement );
				} else {
					console.log('not found route state ' + redirectState );
				}
			}, (values) => {
				this.progression.done();

				if (values.data.errors && values.data.errors.invalid_username) {
					this.$scope.errorMessage = true;
					this.$scope.invalid_username = values.data.errors.invalid_username;
				}
			});
	};

	ResettingController.prototype.validateEntry = function() {
		if (!this.form.$valid) {
			this.notification.log('invalid form', {
				addnCls: 'humane-flatty-error'
			});
			return false;
		}

		return true;
	};

	ResettingController.prototype.resetMsg = function() {
		angular.forEach(this.$scope.msg, (item, key) => {
			this.$scope.msg[key] = '';
		});
	};

	ResettingController.prototype.destroy = function() {
		this.$scope = undefined;
		this.progression = undefined;
		this.notification = undefined;
		this.translation = undefined;
		this.rest = undefined;
		this.$state = undefined;
	};

	ResettingController.$inject = ['$scope', '$state', 'Restangular', 'progression', 'notification', 'TranslationService'];

	return ResettingController;
});