define(function() {
	'use strict';

	var InitGlobal = function($rootScope) {
	    //init underscore
	    $rootScope._ = window._;
	};

	InitGlobal.$inject = ['$rootScope'];

	return InitGlobal;
});