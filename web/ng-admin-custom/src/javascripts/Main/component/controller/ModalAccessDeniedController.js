define(function  () {
	'use strict';

	var ModalAccessDeniedController = function ($scope, $modalInstance, AuthenticationService, progression) {
		$scope.cancel = function () {
			progression.done();

			$modalInstance.close();
		};

		console.log($scope.$id);
	};

	ModalAccessDeniedController.$inject = ['$scope', '$modalInstance', 'AuthenticationService', 'progression'];

	return ModalAccessDeniedController;
});