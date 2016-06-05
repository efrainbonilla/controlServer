
var angular = require('../../../ng-admin/node_modules/angular');
var RouteIndex = angular.module('routeIndex', ['ui.router']);
RouteIndex.config(function ($urlRouterProvider) {
	$urlRouterProvider.when('', '/home');
});