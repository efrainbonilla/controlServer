export default class ModalLoginController {
	constructor($rootScope, $scope, $modalInstance, AuthenticationService, progression, notification, $state) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$modalInstance = $modalInstance;
		this.AuthenticationService = AuthenticationService;
		this.progression = progression;
		this.notification = notification;
		this.$state = $state;

		this.$scope.credentials = {
			/*username: 'admin',
			password: '123456'*/
		};

		this.$scope.$on('event:auth-login-failed', this.authLoginFailed.bind(this));
		this.$scope.$on('event:auth-login-complete', this.authLoginComplete.bind(this));

		this.$scope.submit = this.submit.bind(this);
		this.$scope.cancel = this.cancel.bind(this);
		this.$scope.goHome = this.goHome.bind(this);
		this.$scope.goLostpassword = this.goLostpassword.bind(this);

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	authLoginFailed(even,data) {
		this.$scope.errorMessage = data.message ? 'status.' + data.code : 'Bad credentials';
	}

	authLoginComplete() {
		this.$modalInstance.close();
	}

	submit(credentials) {
		if (!this.validateForm()) {
			return;
		}

		this.AuthenticationService.loginModal(credentials);
	}

	validateForm() {
		if (!this.form.$valid) {
			this.notification.log('invalid form', {
				addnCls: 'humane-flatty-error'
			});
			return false;
		}

		return true;
	}

	cancel() {
		this.AuthenticationService.cancel();
	}

	goHome() {
		this.progression.done();
		this.$modalInstance.close();
		this.AuthenticationService.cancel();
        this.$state.go('home');
	}

	goLostpassword() {
		this.progression.done();
		this.$modalInstance.close();
		this.AuthenticationService.cancel();
		this.$state.go('lostpassword');
	}

	destroy() {
		this.$rootScope = undefined;
		this.$scope = undefined;
		this.$modalInstance = undefined;
		this.AuthenticationService = undefined;
		this.progression = undefined;
		this.$state = undefined;
	}
}

ModalLoginController.$inject = ['$rootScope', '$scope', '$modalInstance', 'AuthenticationService', 'progression', 'notification', '$state'];