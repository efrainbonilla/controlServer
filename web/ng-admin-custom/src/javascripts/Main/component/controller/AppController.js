define(function () {
	'use strict';

	var AppController = function ($scope, $modal, store, jwtHelper, $state, $location, progression) {

		this.$scope = $scope;
		this.$scope = $modal;

		var modalOpen = false;

		var loginTemplate = require('../../view/layoutModalLogin.html');
		var logoutTemplate = require('../../view/layoutModalLogout.html');

		$scope.$on('event:auth-loginRequired', function (rejection) {
			var path = $location.path();
			if (path === '/login'){
				progression.done();
				return;
			}

			if (!modalOpen) {
				$modal.open({
					template: loginTemplate,
					controller: 'ModalLoginCtrl',
					controllerAs: 'login',
					backdrop: 'static',
					size: 'sm',
					keyboard: false,
					resolve: {
						items: function () {
							return [];
						}
					}
				});
				modalOpen = true;
			}
		});

		$scope.loginCheck = function () {

			var token = store.get('token') || null;
			if (!token) {
				return false;
			}

			var bool = jwtHelper.isTokenExpired(token);
			if (bool === true) {
				return false;
			}

			var user = jwtHelper.decodeToken(token);
			$scope.username = user.username;

			return true;
		};

		$scope.username = 'anonimous.';

		$scope.logoutConfirm = function() {
			$modal.open({
				template: logoutTemplate,
				controller: 'ModalLogoutCtrl',
				backdrop: 'static',
				keyboard: false
			});
			modalOpen = false;
		};

		$scope.$on('$destroy', this.destroy.bind(this));
	};

	AppController.prototype.destroy = function () {
		this.$scope = undefined;
	};

	AppController.$inject = ['$scope', '$modal', 'store', 'jwtHelper', '$state', '$location', 'progression'];

	return AppController;
});