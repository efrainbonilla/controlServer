/*global define*/

define(function() {
	'use strict';

	var LostpasswordController = function($scope, $rootScope, $http, progression, notification, TranslationService) {
		var oThis = this;
		this.$scope = $scope;
		this.progression = progression;
		this.notification = notification;
		this.translation = TranslationService;
		this.$http = $http;
		this.$rootScope = $rootScope;

		$scope.user = {};

		$rootScope.$on('event:lostpassword-failed', function(even, data) {
			progression.done();
			$scope.errorMessage = TranslationService.trans(data.message ? 'status.' + data.code : '');
		});

		$scope.$on('event:lostpassword-complete', function(event, data) {
			$scope.errorMessage = null;
			$scope.username = data.username;
			$scope.registerComplete = true;
			progression.done();
		});

		$scope.submit = function($event, user) {

			$event.preventDefault();
			if (!oThis.validateEntry()) {
				return;
			}

			progression.start();
			oThis.lostpassword(user);
		};

		$scope.$on('$destroy', this.destroy.bind(this));
	};

	LostpasswordController.prototype.lostpassword = function(user) {
		var oThis = this;
		oThis.$http
			.post('/api/lostpassword', user, {
				ignoreAuthModule: false
			})
			.success(function(data, status, headers, config) {
				oThis.$rootScope.$broadcast('event:lostpassword-complete', data, status);
			})
			.error(function(data, status, headers, config) {
				oThis.$rootScope.$broadcast('event:lostpassword-failed', data, status);
			});
	};

	LostpasswordController.prototype.validateEntry = function() {
		if (!this.form.$valid) {
			this.notification.log('invalid form', {
				addnCls: 'humane-flatty-error'
			});
			return false;
		}

		return true;
	};

	LostpasswordController.prototype.destroy = function() {
		this.$scope = undefined;
		this.progression = undefined;
		this.notification = undefined;
		this.translation = undefined;
		this.$http = undefined;
		this.$rootScope = undefined;
	};

	LostpasswordController.$inject = ['$scope', '$rootScope', '$http', 'progression', 'notification', 'TranslationService'];

	return LostpasswordController;
});