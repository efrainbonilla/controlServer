var layoutTemplate = require('../view/layout.html'),
	loginTemplate = require('../view/login.html'),
	requestResettingTemplate = require('../view/Resetting/request.html'),
	resetResettingTemplate = require('../view/Resetting/reset.html'),
	checkEmailResettingTemplate = require('../view/Resetting/checkEmail.html'),
	passwordAlreadyRequestedTemplate = require('../view/Resetting/passwordAlreadyRequested.html'),
	registerTemplate = require('../view/Registration/register.html'),
	checkEmailTemplate = require('../view/Registration/checkEmail.html'),
	confirmedTemplate = require('../view/Registration/confirmed.html'),

	reportesControlImportacionTemplate = require('../view/Reports/ControlImportacion/reportes.html'),

	homeTemplate = require('../view/home.html'),
	profileShowTemplate = require('../view/Profile/show.html'),
	profileEditTemplate = require('../view/Profile/edit.html'),
	changePasswordTemplate = require('../view/ChangePassword/changePassword.html');


function dataStoreProvider() {
	return ['AdminDescription', function(AdminDescription) {
		return AdminDescription.getDataStore();
	}];
}

function routing($stateProvider, $urlRouterProvider) {
	$stateProvider.state('page', {
		abstract: true,
		controller: 'PageController',
		controllerAs: 'appController',
		template: layoutTemplate
	});

	$stateProvider.state('home', {
		parent: 'page',
		url: '/home',
		controller: 'HomeController',
		controllerAs: 'homeController',
		template: homeTemplate
	});

	$stateProvider.state('login', {
		parent: 'page',
		url: '/login',
		controller: 'LoginController',
		controllerAs: 'loginController',
		template: loginTemplate
	});

	$stateProvider.state('register_registration', {
		parent: 'page',
		url: '/register',
		controller: 'RegisterController',
		controllerAs: 'registerController',
		template: registerTemplate
	});

	$stateProvider.state('check_email_registration', {
		parent: 'page',
		url: '/register/check-email',
		template: checkEmailTemplate,
		resolve: {
			rawEntry: ['RestWrapper', function(RestWrapper) {
				return RestWrapper.getOne('check-email', '/api/register/check-email');
			}],
			entry: ['rawEntry', function(rawEntry) {
				if (rawEntry && rawEntry.originalElement) {
					return rawEntry.originalElement;
				}
			}],
		},
		controller: ['$scope', 'entry', function ($scope, entry) {
			$scope.user = entry || {};
		}]
	});

	$stateProvider.state('confirmed_registration', {
		parent: 'page',
		url: '/register/confirmed',
		template: confirmedTemplate,
		resolve: {
			rawEntry: ['RestWrapper', function(RestWrapper) {
				return RestWrapper.getOne('confirmed', '/api/register/confirmed');
			}],
			entry: ['rawEntry', function(rawEntry) {
				if (rawEntry && rawEntry.originalElement) {
					return rawEntry.originalElement;
				}
			}],
		},
		controller: ['$scope', 'entry', function ($scope, entry) {
			$scope.user = entry || {};
		}]
	});

	$stateProvider.state('confirm_registration', {
		parent: 'page',
		url: '/register/confirm/:token',
		template: confirmedTemplate,
		params: {
			token: null
		},
		resolve: {
			rawEntry: ['$stateParams', 'RestWrapper', function($stateParams, RestWrapper) {
				if ($stateParams && $stateParams.token) {
					return RestWrapper.getOne('confirm', '/api/register/confirm/'+ $stateParams.token);
				} else {
					return false;
				}
			}],
			entry: ['rawEntry', '$state', function(rawEntry, $state) {
				if (rawEntry && rawEntry.originalElement) {
					//$state.go('confirmed_registration');
					return rawEntry.originalElement;
				} else {
					$state.go('login');
				}
			}],
		},
		controller: ['$scope', 'entry', function ($scope, entry) {
			$scope.user = entry || {};
		}]
	});

	$stateProvider.state('profile_show', {
		parent: 'main',
		url: '/profile/show',
		controller: 'ProfileController',
		controllerAs: 'profileController',
		template: profileShowTemplate,
		resolve: {
			rawEntry: ['RestWrapper', 'UserService', function(RestWrapper, UserService) {
				if (UserService.getUser() && UserService.getUser().username) {
					return RestWrapper.getOne('profile', '/api/profile');
				} else {
					return false;
				}
			}],
			entry: ['rawEntry', 'UserService', '$state', function(rawEntry, UserService, $state) {
				if (rawEntry && rawEntry.originalElement) {
					UserService.setUser(rawEntry.originalElement);
				} else {
					$state.go('login');
				}
			}],
		}
	});

	$stateProvider.state('profile_edit', {
		parent: 'main',
		url: '/profile/edit',
		controller: 'ProfileController',
		controllerAs: 'profileController',
		template: profileEditTemplate,
		resolve: {
			rawEntry: ['RestWrapper', 'UserService', function(RestWrapper, UserService) {
				if (UserService.getUser() && UserService.getUser().username) {
					return RestWrapper.getOne('profile', '/api/profile');
				} else {
					return false;
				}
			}],
			entry: ['rawEntry', 'UserService', '$state', function(rawEntry, UserService, $state) {
				if (rawEntry && rawEntry.originalElement) {
					UserService.setUser(rawEntry.originalElement);
				} else {
					$state.go('login');
				}
			}],
		}
	});

	$stateProvider.state('profile_change_password', {
		parent: 'main',
		url: '/profile/change-password',
		controller: 'ChangePasswordController',
		controllerAs: 'changePasswordController',
		template: changePasswordTemplate,
		resolve: {
			rawEntry: ['RestWrapper', 'UserService', function(RestWrapper, UserService) {
				if (UserService.getUser() && UserService.getUser().username) {
					return RestWrapper.getOne('profile', '/api/profile');
				} else {
					return false;
				}
			}],
			entry: ['rawEntry', 'UserService', '$state', function(rawEntry, UserService, $state) {
				if (rawEntry && rawEntry.originalElement) {
					UserService.setUser(rawEntry.originalElement);
				} else {
					$state.go('login');
				}
			}],
		}
	});

	$stateProvider.state('request_resetting', {
		parent: 'page',
		url: '/resetting/request',
		controller: 'ResettingController',
		controllerAs: 'resettingController',
		template: requestResettingTemplate
	});

	$stateProvider.state('send_email_resetting', {
		parent: 'page',
		url: '/resetting/send-email',
		template: passwordAlreadyRequestedTemplate,
		controller: function() {}
	});

	$stateProvider.state('check_email_resetting', {
		parent: 'page',
		url: '/resetting/check-email?email',
		template: checkEmailResettingTemplate,
		params: {
			email: null
		},
		controller: ['$scope', '$stateParams', function($scope, $stateParams) {
			$scope.user = {email: $stateParams.email};
		}],
		resolve: {
			checkEmail: ['$stateParams', function ($stateParams) {
				var email = 'email' in $stateParams ? $stateParams.email : null;
				var emailRegEx = /^\...@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
				return (!emailRegEx.test(email))? false : true;
			}],
			entry: ['$state', 'progression', 'checkEmail',  function ($state, progression, checkEmail) {
				if (!checkEmail) {
					progression.done();
					$state.go('request_resetting');
				}
			}]
		},
	});

	$stateProvider.state('reset_resetting', {
		parent: 'page',
		url: '/resetting/reset/:token',
		controller: 'ResettingResetController',
		controllerAs: 'resettingResetController',
		template: resetResettingTemplate,
		params: {
			token: null
		},
		resolve: {
			rawEntry: ['$stateParams', 'RestWrapper', function($stateParams, RestWrapper) {
				if ($stateParams && $stateParams.token) {
					return RestWrapper.getOne('reset', '/api/resetting/reset/'+ $stateParams.token);
				} else {
					return false;
				}
			}],
			entry: ['rawEntry', '$state', function(rawEntry, $state) {
				if (rawEntry && rawEntry.originalElement) {
					//$state.go('confirmed_registration');
					return rawEntry.originalElement;
				} else {
					$state.go('request_resetting');
				}
			}],
		}
	});


	$stateProvider.state('guiacomclis_reports', {
		parent: 'main',
		url: '/controlimportacion/reportes',
		controller: 'ReportesControlImportacionController',
		controllerAs: 'reportesController',
		template: reportesControlImportacionTemplate
	});
}

routing.$inject = ['$stateProvider', '$urlRouterProvider'];

module.exports = routing;