define(function() {
	'use strict';

	var InitMoment = function($rootScope, amMoment) {
	    amMoment.changeLocale('es');
	};

	InitMoment.$inject = ['$rootScope', 'amMoment'];

	return InitMoment;
});