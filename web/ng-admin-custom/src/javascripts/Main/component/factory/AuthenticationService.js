define(function() {
	'use strict';

	function AuthenticationService($rootScope, $http, authService, UserService, $httpBackend, store, jwtHelper) {
		return {
			loginModal: function(credentials) {
				$http
					.post('/api/login_check', credentials, {
						ignoreAuthModule: true
					})
					.success(function(data, status, headers, config) {

						store.set('token', data.token);
						store.set('authorization', 'Bearer ' + data.token);
						$http.defaults.headers.common.Authorization = store.get('authorization'); //step 1
						UserService.setUser(jwtHelper.decodeToken(store.get('authorization')));
						authService.loginConfirmed(data, function(config) { // step2 & 3
							config.headers.Authorization = store.get('authorization');
							$rootScope.$broadcast('event:auth-login-complete', data);
							return config;
						});
					})
					.error(function(data, status, headers, config) {
						$rootScope.$broadcast('event:auth-login-failed', data, status);
					});
			},

			login: function(credentials) {
				$http
					.post('/api/login_check', credentials, {
						ignoreAuthModule: true
					})
					.success(function(data, status, headers, config) {

						store.set('token', data.token);
						store.set('authorization', 'Bearer ' + data.token);
						UserService.setUser(jwtHelper.decodeToken(store.get('authorization')));
						$http.defaults.headers.common.Authorization = store.get('authorization');
						$rootScope.$broadcast('event:auth-login-complete', data);
					})
					.error(function(data, status, headers, config) {
						$rootScope.$broadcast('event:auth-login-failed', data, status);
					});
			},

			logout: function(user) {
				delete $http.defaults.headers.common.Authorization;
				store.remove('token');
				store.remove('authorization');

				$rootScope.$broadcast('event:auth-logout-complete');
			},
			cancel: function() {
				authService.loginCancelled();
			}
		};
	}

	AuthenticationService.$inject = ['$rootScope', '$http', 'authService', 'UserService', '$httpBackend', 'store', 'jwtHelper'];

	return AuthenticationService;
});