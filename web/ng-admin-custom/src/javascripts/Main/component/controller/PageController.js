/*global define*/

define(function () {
	'use strict';

	var PageController = function ($scope, $state, Configuration) {
		var application = Configuration();
		this.$scope = $scope;
		this.$state = $state;
		this.applicationName = application.title();
		this.header = application.header();
		$scope.$on('$destroy', this.destroy.bind(this));
	};

	PageController.prototype.displayHome = function () {
		this.$state.go(this.$state.get('home'));
	};

	PageController.prototype.destroy = function () {
		this.$scope = undefined;
		this.$state = undefined;
	};

	PageController.$inject = ['$scope', '$state', 'NgAdminConfiguration'];

	return PageController;
});