define(function () {
	'use strict';

	function SessionDropdownController ($scope, $log) {
		$scope.status = {
			isopen: false
		};

		$scope.toggled = function(open) {
			$log.log('Dropdown is now: ', open);
		};

		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
	}

	SessionDropdownController.$inject = ['$scope', '$log'];

	return SessionDropdownController;
});