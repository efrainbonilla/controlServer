import personaCreateTemplate from '../../view/layoutModalPersonaCreate.html';

class PersonaCreateModalController {
	constructor($rootScope, $scope, $modalInstance, notification, progression, UtilityService, $state, $stateParams, RestWrapper, ctrlParent) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$modalInstance = $modalInstance;
		this.notification = notification;
		this.progression = progression;
		this.util = UtilityService;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.rest = RestWrapper;
		this.ctrlParent = ctrlParent;

		this.$scope.nacs = this.util.choiceNac()();

		this.$scope.isSaving = false;
		this.$scope.model = {};

		this.$scope.item = {
			loading: true
		};

		this.$scope.close = this.close.bind(this);
		this.$scope.refresh = this.refresh.bind(this);

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	refresh(entity) {
		this.ctrlParent.broadcast(entity);
	}

	submitEdition($event) {
		$event.preventDefault();
		if (!this.validateForm()) {
			return;
		}

		let data = this.$scope.model || {};

		this.$scope.isSaving = true;

        this.progression.start();

		this.rest
			.createOne(data, 'personas', '/api/personas')
			.then((response) => {
                this.progression.done();
                this.notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
                this.refresh(response.originalElement);
				this.$scope.isSaving = false;
                this.close();
			}, () => {
				this.progression.done();
				this.$scope.isSaving = false;
        		this.notification.log('Error 500.', {addnCls: 'humane-flatty-error'});
			});
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

	close() {
		this.$modalInstance.close();
	}

	destroy() {
		this.$scope = undefined;
		this.$modalInstance = undefined;
		this.progression = undefined;
		this.RestWrapper = undefined;
		this.util = undefined;
	}
}

export default class PersonaCreateController {
	constructor($rootScope, $scope, $modal) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$modal = $modal;

		this.$scope.broadcast = '_';
		this.$scope.param = {};
		this.$scope.open = this.openModal.bind(this);
		this.$scope.refresh = this.refresh.bind(this);

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	openModal($event) {
		$event.preventDefault();
		$event.stopPropagation();

		console.log(this.$scope.param, "parametros");

		this.$modal.open({
			animation: true,
			template: personaCreateTemplate,
			controller: PersonaCreateModalController,
			controllerAs: 'personaCreate',
			size: 'lg',
			resolve: {
				ctrlParent: () => {
					return this;
				}
			}
		});
	}

	refresh($event, param) {
		$event.preventDefault();
		$event.stopPropagation();

		this.broadcast(param);
	}

	broadcast(param) {
		if (param) {
			this.$rootScope.$broadcast(this.$scope.broadcast, angular.extend(this.$scope.param, param));
		} else {
			this.$rootScope.$broadcast(this.$scope.broadcast);
		}
	}

	destroy() {
		this.$rootScope = undefined;
		this.$scope = undefined;
		this.$modal = undefined;
	}
}

PersonaCreateModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'notification', 'progression', 'UtilityService', '$state', '$stateParams', 'RestWrapper', 'ctrlParent'];

PersonaCreateController.$inject = ['$rootScope', '$scope', '$modal'];