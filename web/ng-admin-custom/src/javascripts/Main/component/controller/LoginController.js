/*global define*/

define(function () {
	'use strict';

	var LoginController = function ($scope, $rootScope, $state, AuthenticationService, progression, notification, TranslationService) {
		var oThis = this;
		this.$scope = $scope;
		this.$state = $state;
        this.progression = progression;
        this.notification = notification;
        this.translation = TranslationService;

		$scope.credentials = {
			username: '',
			password: ''
		};

		$rootScope.$on('event:auth-login-failed', function(event, data) {
            progression.done();
			$scope.errorMessage = TranslationService.trans(data.message ? 'status.' + data.code : 'Bad credentials');
		});

		$scope.$on('event:auth-login-complete', function(event, response) {
			$scope.errorMessage = null;
			$scope.username = response.data.username;
			$scope.loginComplete = true;
			$state.go($state.get('dashboard'));
            progression.done();
		});

		$scope.submit = function($event, credentials) {
			$event.preventDefault();
			if (!oThis.validateEntry()) {
				return;
			}
        	progression.start();
			AuthenticationService.login(credentials);
		};

		$scope.$on('$destroy', this.destroy.bind(this));
	};

	LoginController.prototype.validateEntry = function() {
		if (!this.form.$valid) {
			this.notification.log('invalid form', {
				addnCls: 'humane-flatty-error'
			});
			return false;
		}

		return true;
	};

	LoginController.prototype.destroy = function () {
		this.$scope = undefined;
		this.$state = undefined;
        this.progression = undefined;
        this.notification = undefined;
        this.translation = undefined;
	};

	LoginController.$inject = ['$scope', '$rootScope', '$state', 'AuthenticationService', 'progression', 'notification', 'TranslationService'];

	return LoginController;
});