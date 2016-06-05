import vehiculoCreateTemplate from '../../view/layoutModalVehiculoCreate.html';
import vehiculoMarcaModeloCreateTemplate from '../../view/layoutModalVehiculoMarcaModeloCreate.html';

class VehiculoMarcaModeloCreateModalController {
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

		this.$scope.marcas = [];
		this.$scope.modelos = [];

		this.$scope.isSaving = false;
		this.$scope.model = {};

		this.$scope.item = {
			loading: true
		};

		this.$scope.formName = this.ctrlParent.$scope.formName;

		this.$scope.close = this.close.bind(this);
		this.$scope.refresh = this.refresh.bind(this);

		this.getMarcas();

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	getMarcas($item, $model) {
		this.util
			.apiVehiculoMarca($item, $model)
			.then((response) => {
				this.$scope.marcas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getModelos($item, $model) {
		this.util
			.apiVehiculoModelo($item, $model)
			.then((response) => {
				this.$scope.modelos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	refreshMarca($event) {
		$event.preventDefault();
        $event.stopPropagation();

        this.getMarcas();
	}

	refresh(entity, apiName) {
		switch (apiName) {
			case "vehiculomarcas":
				this.ctrlParent.getMarcas();
				break;
			case "vehiculomodelos":
				this.ctrlParent.getModelos({}, this.ctrlParent.$scope.model.marca);
				break;
			default:
				break;
		}
	}

	submitEdition($event) {
		switch (this.$scope.formName) {
			case "vehiculomarcas":
				this.submit($event, this.$scope.formName);
				break;
			case "vehiculomodelos":
				this.submit($event, this.$scope.formName);
				break;
			default:
				break;
		}
	}

	submit($event, apiName) {
		$event.preventDefault();
		if (!this.validateForm()) {
			return;
		}

		let data = this.$scope.model || {};

		this.$scope.isSaving = true;

        this.progression.start();

		this.rest
			.createOne(data, apiName, '/api/' + apiName)
			.then((response) => {
                this.progression.done();
                this.notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
                this.refresh(response.originalElement, apiName);
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
		this.$rootScope = undefined;
		this.$scope = undefined;
		this.$modalInstance = undefined;
		this.notification = undefined;
		this.progression = undefined;
		this.util = undefined;
		this.$state = undefined;
		this.$stateParams = undefined;
		this.rest = undefined;
		this.ctrlParent = undefined;
	}
}


class VehiculoCreateModalController {
	constructor($rootScope, $scope, $modalInstance, $modal, notification, progression, UtilityService, $state, $stateParams, RestWrapper, ctrlParent) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$modalInstance = $modalInstance;
		this.$modal = $modal;
		this.notification = notification;
		this.progression = progression;
		this.util = UtilityService;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.rest = RestWrapper;
		this.ctrlParent = ctrlParent;

		this.$scope.marcas = [];
		this.$scope.modelos = [];

		this.$scope.isSaving = false;
		this.$scope.model = {};

		this.$scope.item = {
			loading: true
		};

		this.$scope.selMarca = this.selMarca.bind(this);

		this.$scope.open = this.openModal.bind(this);
		this.$scope.close = this.close.bind(this);
		this.$scope.refresh = this.refresh.bind(this);

		this.getMarcas();

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	selMarca($item, $model) {
		this.getModelos($item, $model);
	}

	getMarcas($item, $model) {
		this.util
			.apiVehiculoMarca($item, $model)
			.then((response) => {
				this.$scope.marcas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getModelos($item, $model) {
		this.util
			.apiVehiculoModelo($item, $model)
			.then((response) => {
				this.$scope.modelos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'modelo_anio'
				}, {
					value: 'id'
				}]);
			});
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
			.createOne(data, 'vehiculos', '/api/vehiculos')
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

	openModal($event, formName) {
		$event.preventDefault();
		$event.stopPropagation();

		this.$scope.formName = formName;

		this.$modal.open({
			animation: true,
			template: vehiculoMarcaModeloCreateTemplate,
			controller: VehiculoMarcaModeloCreateModalController,
			controllerAs: 'vehiculoMarcaModeloCreate',
			resolve: {
				ctrlParent: () => {
					return this;
				}
			}
		});
	}

	close() {
		this.$modalInstance.close();
	}

	destroy() {
		this.$rootScope = undefined;
		this.$scope = undefined;
		this.$modalInstance = undefined;
		this.$modal = undefined;
		this.notification = undefined;
		this.progression = undefined;
		this.util = undefined;
		this.$state = undefined;
		this.$stateParams = undefined;
		this.rest = undefined;
		this.ctrlParent = undefined;
	}
}

export default class VehiculoCreateController {
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
			template: vehiculoCreateTemplate,
			controller: VehiculoCreateModalController,
			controllerAs: 'vehiculoCreate',
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

VehiculoCreateModalController.$inject = ['$rootScope', '$scope', '$modalInstance', '$modal', 'notification', 'progression', 'UtilityService', '$state', '$stateParams', 'RestWrapper', 'ctrlParent'];
VehiculoMarcaModeloCreateModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'notification', 'progression', 'UtilityService', '$state', '$stateParams', 'RestWrapper', 'ctrlParent'];

VehiculoCreateController.$inject = ['$rootScope', '$scope', '$modal'];