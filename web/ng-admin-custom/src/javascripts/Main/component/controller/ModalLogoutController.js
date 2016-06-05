define(function () {
	'use strict';

	var ModalLogoutController = function ($scope, $state, $modalInstance, AuthenticationService) {

		$scope.ok = function () {
			$modalInstance.close();
			AuthenticationService.logout({});
			$state.go($state.get('login'));
		};
		$scope.cancel = function () {
			$modalInstance.close();
		};

		console.log($scope.$id);
	};

	ModalLogoutController.$inject = ['$scope', '$state', '$modalInstance', 'AuthenticationService'];

	return ModalLogoutController;
});