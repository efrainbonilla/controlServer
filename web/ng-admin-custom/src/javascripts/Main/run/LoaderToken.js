
define(function () {
	'use strict';

	var LoaderToken = function ($rootScope, store, jwtHelper, $location, $http, $urlRouter, progression, $modal, UserService) {
		var token = store.get('token') || null;
		UserService.$get();
		if (token) {
			var bool =  jwtHelper.isTokenExpired(token);
			if (bool === false) {
				$http.defaults.headers.common.Authorization = store.get('authorization');
				UserService.setUser(jwtHelper.decodeToken(store.get('authorization')));
			} else {
				store.remove('authorization');
				store.remove('token');
				delete $http.defaults.headers.common.Authorization;
				UserService.clear();
			}
		}

		var deniedTemplate = require('../view/layoutModalDenied.html');

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

			var route = toState.name;

			if ( route != undefined ) {

				var grated = {
					'create': true,
					'edit': true,
					'list': true,
					'show': true,
					'delete': true
				};
				if (route in grated) {

					var roles = {
						'create': true,
						'edit': true,
						'list': true,
						'show': true,
						'delete': true
					};

					if (route in roles && roles[route]) {
						console.log("acceso concedido");
					} else {
						/*event.defaultPrevented = true;*/
						event.preventDefault();
						$modal.open({
							template: deniedTemplate,
							/*templateUrl: 'denied.html',*/
							controller: 'ModalAccessDeniedDeCtrl',
							backdrop: 'static',
							keyboard: false
						});
						return;
					}
				}
			}
		});
	};

	LoaderToken.$inject = ['$rootScope', 'store', 'jwtHelper', '$location', '$http', '$urlRouter', 'progression', '$modal', 'UserService'];

	return LoaderToken;
});