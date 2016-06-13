import rubroCreateTemplate from '../../view/layoutModalRubroCreate.html';
import productoMarcaCreateTemplate from '../../view/layoutModalProductoMarcaCreate.html';

class RubroCreateModalController {
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

		this.$scope.rubroproductos = [];

		this.$scope.model = {};
		this.$scope.isSaving = false;

		this.$scope.formName = this.ctrlParent.$scope.formNamePopup;

		this.$scope.close = this.close.bind(this);

		this.getRubroProductos();
		this.getMarcaProductos();

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	getRubroProductos($item, $model) {
		this.util
			.apiRubroProducto($item, $model)
			.then((response) => {
				this.$scope.rubroproductos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getMarcaProductos($item, $model) {
		this.util
			.apiMarcaProducto($item, $model)
			.then((response) => {
				this.$scope.marcaproductos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	refresh(entity, apiName) {
		switch (apiName) {
			case "rubroproductos":
				this.ctrlParent.getRubroProductos();
				break;
			case "marcaproductos":
				this.ctrlParent.getMarcaProductos();
				break;
			default:
				break;
		}
	}

	submitEdition($event) {
		switch (this.$scope.formName) {
			case "rubroproductos":
			case "marcaproductos":
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

class ProductoMarcaCreateModalController {
	constructor($rootScope, $scope, $modal, $modalInstance, notification, progression, UtilityService, $state, $stateParams, RestWrapper, ctrlParent) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$modal = $modal;
		this.$modalInstance = $modalInstance;
		this.notification = notification;
		this.progression = progression;
		this.util = UtilityService;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.rest = RestWrapper;
		this.ctrlParent = ctrlParent;

		this.$scope.productos = [];
		this.$scope.productomarcas = [];
		this.$scope.rubroproductos = [];
		this.$scope.marcaproductos = [];
		this.$scope._marcaproductos = [];

		this.$scope.model = {};
		this.$scope.isSaving = false;
		this.$scope.active = true;

		this.$scope.formName = this.ctrlParent.$scope.formName;

		this.active();

		this.$scope.open = this.openModal.bind(this);
		this.$scope.close = this.close.bind(this);
		this.$scope.refresh = this.refresh.bind(this);

		this.$scope.selProducto = this.selProducto.bind(this);

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	active() {
		switch (this.$scope.formName) {
			case "medidas":
				this.getMagnituds();
				break;
			case "productos":
				this.getProductos();
				this.getRubroProductos();

				break;
			case "productomarcas":
				this.$scope.active = false;
				this.getMarcaProductos();
				this.getProductos();
				break;
			default:
				break;
		}
	}

	selProducto($item, $model) {
		this.getProductoMarcas($item, $model);
	}

	getProductos($item, $model) {
		this.util
			.apiProducto($item, $model)
			.then((response) => {
				this.$scope.productos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getProductoMarcas($item, $model) {
		this.$scope.loading = true;
		this.$scope.active = false;
		this.$scope.model._marca = [];
		this.$scope.model.marca = [];
		this.util
			.apiProductoMarca($item, $model)
			.then((response) => {
				this.$scope.productomarcas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'marca.nomb'
				}, {
					value: 'marca.id'
				}]);

				this.parseMarcas();

				this.$scope.loading = false;
				this.$scope.active = true;
			});
	}

	parseMarcas() {
		this.$scope.marca = [];
		angular.forEach(this.$scope.productomarcas, (item) => {
			this.$scope.marca.push(item.value);
		});

		let data = [];
		for (var a in this.$scope.marcaproductos) {
			if (!(this.$rootScope._.indexOf(this.$scope.marca, this.$scope.marcaproductos[a].value) != -1)) {
				data.push(this.$scope.marcaproductos[a]);
			}
		}

		this.$scope._marcaproductos = data;
	}

	getRubroProductos($item, $model) {
		let rubro = this.$scope.model.rubro;
		this.$scope.model.rubro = [];

		this.util
			.apiRubroProducto($item, $model)
			.then((response) => {
				this.$scope.rubroproductos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);

				this.$scope.model.rubro = rubro;
			});
	}

	getProductoRubros($item, $model) {
		this.util
			.apiProductoMarca($item, $model)
			.then((response) => {
				this.$scope.productorubros = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getMarcaProductos($item, $model) {
		let _marca = this.$scope.model._marca;
		this.$scope.model._marca = [];

		this.util
			.apiMarcaProducto($item, $model)
			.then((response) => {
				this.$scope.marcaproductos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);

				this.parseMarcas();

				this.$scope.model._marca = _marca;
			});
	}

	getMagnituds($item, $model) {
		this.util
			.apiMagnitud($item, $model)
			.then((response) => {
				this.$scope.magnituds = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getMedidas($item, $model) {
		this.util
			.apiMedida($item, $model)
			.then((response) => {
				this.$scope.medidas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	refreshProducto($event) {
		$event.preventDefault();
        $event.stopPropagation();

        this.getProductos();
	}

	refreshMagnitud($event) {
		$event.preventDefault();
        $event.stopPropagation();

        this.getMagnituds();
	}

	refresh(entity, apiName, id) {
		if (id) {
			switch (apiName) {
				case "productos":
					break;
				default:
					break;
			}
		} else {
			switch (apiName) {
				case "productos":
					this.ctrlParent.getProductos();
					break;
				case "medidas":
					this.ctrlParent.getMedidas();
					break;
				default:
					break;
			}
		}
	}

	submitEdition($event) {
		switch (this.$scope.formName) {
			case "productos":
				this.submit($event, this.$scope.formName);
				break;
			case "productomarcas":
				this.$scope.model.marca = this.$rootScope._.union(this.$scope.marca, this.$scope.model._marca);
				this.submit($event, 'productos', this.$scope.model.producto);
				break;
			case "medidas":
				this.submit($event, this.$scope.formName);
				break;
			default:
				break;
		}
	}

	submit($event, apiName, id) {
		$event.preventDefault();
		if (!this.validateForm()) {
			return;
		}

		let data = this.$scope.model || {};

		this.$scope.isSaving = true;

        this.progression.start();

        if (id) {
        	this.rest
				.updateOne(data, apiName, '/api/' + apiName + '/'+ id)
				.then((response) => {
	                this.progression.done();
	                this.notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
	                this.refresh(response.originalElement, apiName, id);
					this.$scope.isSaving = false;
	                this.close();
				}, () => {
					this.progression.done();
					this.$scope.isSaving = false;
	        		this.notification.log('Error 500.', {addnCls: 'humane-flatty-error'});
				});
        } else {
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

		this.$scope.formNamePopup = formName;

		this.$modal.open({
			animation: true,
			template: rubroCreateTemplate,
			controller: RubroCreateModalController,
			controllerAs: 'rubro',
			size: 'sm',
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
		this.notification = undefined;
		this.progression = undefined;
		this.util = undefined;
		this.$state = undefined;
		this.$stateParams = undefined;
		this.rest = undefined;
		this.ctrlParent = undefined;
	}
}

class ClienteController {
	constructor($scope, $rootScope, $modal, $stateParams, $log, UtilityService, notification) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$modal = $modal;
		this.$stateParams = $stateParams;
		this.$log = $log;
		this.util = UtilityService;
		this.notification = notification;

		this.$scope.clientes = [];
		this.$scope.vehiculos = [];
		this.$scope.personas = [];

		this.$scope.productos = [];
		this.$scope.prestaciones = [];
		this.$scope.medidas = [];

		this.$scope.keyNameFirst = 'vehiculo';
		this.$scope.keyNameSecond = 'cliente';
		this.$scope.keyNameThird = 'producto';

		this.keyNameFirst = this.$scope.keyNameFirst;
		this.keyNameSecond = this.$scope.keyNameSecond;
		this.keyNameThird = this.$scope.keyNameThird;

		this.$scope.isSaving = false;

		this.$scope.model = {};
		this.$scope.model[this.keyNameFirst] = [];

		this.$scope.select = {};
		this.$scope.select[this.keyNameFirst] = [];

		this.$scope.selProducto = this.selProducto.bind(this);
		this.$scope.selCliente = this.selCliente.bind(this);
		this.$scope.selConductor = this.selConductor.bind(this);
		this.$scope.selVehiculo = this.selVehiculo.bind(this);

		this.$scope.refreshCliente = this.refreshCliente.bind(this);
		this.$scope.refreshProducto = this.refreshProducto.bind(this);
		this.$scope.refreshMedida = this.refreshMedida.bind(this);

		this.$scope.addVehiculo = this.addVehiculo.bind(this);
		this.$scope.removeVehiculo = this.removeVehiculo.bind(this);

		this.$scope.addCliente = this.addCliente.bind(this);
		this.$scope.removeCliente = this.removeCliente.bind(this);

		this.$scope.addProducto = this.addProducto.bind(this);
		this.$scope.removeProducto = this.removeProducto.bind(this);

		this.getClientes();
        this.getVehiculos();
        this.getConductors();
        this.getProductos();
        this.getMedidas();

        this.$scope.conductor = this.$rootScope.$on('choice:conductor:get', this.getConductor.bind(this));
        this.$scope.vehiculo = this.$rootScope.$on('choice:vehiculo:get', this.getVehiculo.bind(this));

		this.$scope.open = this.openModal.bind(this);

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	selProducto(indexVehiculo, indexCliente, indexProducto, $item, $model) {
		this.getProductoMarcas(indexVehiculo, indexCliente, indexProducto, $item, $model);
	}

	selCliente(indexVehiculo, $select) {
		this.$scope.select[this.keyNameFirst][indexVehiculo].cliente = $select;
	}

	selConductor(indexVehiculo, $select) {
		this.$scope.select[this.keyNameFirst][indexVehiculo].conductor = $select;
	}

	selVehiculo(indexVehiculo, $select) {
		this.$scope.select[this.keyNameFirst][indexVehiculo].vehiculo = $select;
	}

	getProductos() {
		this.util
			.apiProducto()
			.then((response) => {
				this.$scope.productos = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}]);
			});
	}

	getMedidas() {
		this.util
			.apiMedida()
			.then((response) => {
				this.$scope.medidas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'nomb'
				}, {
					value: 'id'
				}, {
					mag: 'magnitud.nomb'
				}]);
				this.$scope.prestaciones = this.$scope.medidas;
			});
	}

	getProductoMarcas(indexVehiculo, indexCliente, indexProducto, $item, $model) {
		this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird][indexProducto].marca = [{label: 'Cargando...',value: -2}];
		this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird][indexProducto]['prod_marca'] = -2;
		this.util
			.apiProductoMarca($item, $model)
			.then((response) => {
				this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird][indexProducto]['prod_marca'] = '';

				this.$scope.productomarcas = this.util.dataPrepare(response.data.originalElement, [{
					label: 'marca.nomb'
				}, {
					value: 'id'
				}]);

				if (this.$scope.productomarcas.length === 0) {
					this.$scope.productomarcas = [{label: '(0) Marcas. Asignar en acciones.',value: -1}];
					this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird][indexProducto]['prod_marca'] = -1;
				}

				this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird][indexProducto].marca = this.$scope.productomarcas;
			});
	}

	getClientes($item, $model) {
		this.util
			.apiMercantilCliente($item, $model)
			.then((response) => {
				this.$scope.clientes = this.util.dataPrepare(response.data.originalElement, [{
					label: 'razon_social_rif'
				}, {
					value: 'id'
				}]);
			});
	}

	getConductor($event, $item, $model) {
		$event.preventDefault();

        this.getConductors($item, $model);
	}

	getConductors($item, $model) {
		this.util
			.apiPersona($item, $model)
			.then((response) => {
				this.$scope.personas = this.util.dataPrepare(response.data.originalElement, [{
						label: 'nac_cedu_nomb_apell'
					}, {
						value: 'id'
					}]);

				if ($item && $item.cedu) {
					this.$scope.entry.values[$item.keyNameFirst][$item.keyFirst].persona = $item.id;
				}
			});
	}

	getVehiculo($event, $item, $model) {
		$event.preventDefault();

        this.getVehiculos($item, $model);
	}

	getVehiculos($item, $model) {
		this.util
			.apiVehiculo($item, $model)
			.then((response) => {
				this.$scope.vehiculos = this.util.dataPrepare(response.data.originalElement, [{
						label: 'placa_marca_modelo_anio_color'
					}, {
						value: 'id'
					}]);

				if ($item && $item.placa) {
					this.$scope.entry.values[$item.keyNameFirst][$item.keyFirst].vehiculo = $item.id;
				}
			});
	}

	refreshVehiculo($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.getVehiculos();
	}

	refreshCliente($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.getClientes();
	}

	refreshProducto($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.getProductos();
	}

	refreshMedida($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.getMedidas();
	}

	addVehiculo($event){
		$event.preventDefault();
		$event.stopPropagation();

		var indexVehiculo = this.$scope.model[this.keyNameFirst].length;

		this.$scope.model[this.keyNameFirst].push({ value: indexVehiculo });

		let index = this.$scope.model[this.keyNameFirst].length - 1;

		if (!angular.isDefined(this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond])) {
			this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond] = [];
		}

		if (!angular.isDefined(this.$scope.entry.values[this.keyNameFirst])) {
			this.$scope.entry.values[this.keyNameFirst] = [];
			this.$scope.select[this.keyNameFirst] = [];
		}


		if (!this.$scope.entry.values[this.keyNameFirst][index]) {
			this.$scope.entry.values[this.keyNameFirst][index] = {};
			this.$scope.select[this.keyNameFirst][index] = {};
		}

		this.$scope.entry.values[this.keyNameFirst][index][this.keyNameSecond] = [];

		this.$scope.select[this.keyNameFirst][index].cli = '';
		this.$scope.select[this.keyNameFirst][index].cliente = null;
		this.$scope.select[this.keyNameFirst][index].vehiculo = null;
		this.$scope.select[this.keyNameFirst][index].conductor = null;
	}

	removeVehiculo($event, indexVehiculo) {
		$event.preventDefault();
        $event.stopPropagation();

		if (indexVehiculo >= 0 && indexVehiculo < this.$scope.model[this.keyNameFirst].length) {
			this.$scope.model[this.keyNameFirst].splice(indexVehiculo, 1);
			this.$scope.entry.values[this.keyNameFirst].splice(indexVehiculo, 1);
			this.$scope.select[this.keyNameFirst].splice(indexVehiculo, 1);
		}
	}

	addCliente($event, indexVehiculo) {
        $event.preventDefault();
		$event.stopPropagation();

        if (this.util.isEmpty(this.$scope.select[this.keyNameFirst][indexVehiculo].cli)) {
			this.notification.log('Error: seleccione cliente.', { addnCls: 'humane-flatty-error' });
			return;
        }

        if (this.$scope.select[this.keyNameFirst][indexVehiculo].cliente == null) {
			return;
        }

        let value = this.$scope.select[this.keyNameFirst][indexVehiculo].cliente.selected.value,
			label = this.$scope.select[this.keyNameFirst][indexVehiculo].cliente.selected.label,
			item = this.$scope.select[this.keyNameFirst][indexVehiculo].cliente.selected;

		if (this.util.isEmpty(this.util.trim(value))) {
			return;
		}

		for (var i in this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond]) {
			if (this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][i].value === value) {
				this.notification.log('Error: ' + label + '<br/> ya está agregado en la lista de clientes del vehículo #' + (indexVehiculo + 1), { addnCls: 'humane-flatty-error' });
				return;
			}
		}

		this.notification.log('' +label+  '<br/> agregado correctamente a la lista de clientes del vehículo #' + (indexVehiculo + 1), { addnCls: 'humane-flatty-success' });

		this.$scope.select[this.keyNameFirst][indexVehiculo].cli = '';

		this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond].push({item: item, value: value });

		let index = this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond].length - 1;

		if (!angular.isDefined(this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index][this.keyNameThird])) {
			this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index][this.keyNameThird] = [{value: 0, marca: []}];
		}

		if (!angular.isDefined(this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond])) {
			this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond] = [];
		}

		if (!this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index]) {
			this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index] = {};
		}

		this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index].cliente = value;
		this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][index][this.keyNameThird] = [];
	}

	removeCliente($event, indexVehiculo, indexCliente) {
        $event.preventDefault();
        $event.stopPropagation();

        if (indexCliente >= 0 && indexCliente < this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond].length) {
			this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond].splice(indexCliente, 1);
			this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond].splice(indexCliente, 1);
		}
	}

	addProducto($event, indexVehiculo, indexCliente) {
		$event.preventDefault();
        $event.stopPropagation();

        let indexProducto = this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird].length;
		this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird].push({value: indexProducto, marca: []});
	}

	removeProducto($event, indexVehiculo, indexCliente, indexProducto) {
		$event.preventDefault();
        $event.stopPropagation();

        if (indexProducto >= 0 && indexProducto < this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird].length) {
			this.$scope.model[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird].splice(indexProducto, 1);
			this.$scope.entry.values[this.keyNameFirst][indexVehiculo][this.keyNameSecond][indexCliente][this.keyNameThird].splice(indexProducto, 1);
		}
	}

	openModal($event, formName) {
		$event.preventDefault();
		$event.stopPropagation();

		this.$scope.formName = formName;

		this.$modal.open({
			animation: true,
			template: productoMarcaCreateTemplate,
			controller: ProductoMarcaCreateModalController,
			controllerAs: 'productoMarca',
			resolve: {
				ctrlParent: () => {
					return this;
				}
			}
		});
	}

	destroy() {
		this.$scope = undefined;
		this.$rootScope = undefined;
		this.$stateParams = undefined;
		this.$log = undefined;
		this.util = undefined;
	}
}

/**
 * Show ui cliente
 *
 * Usage:
 * <sicap-cliente entry="entry"></sicap-cliente>
 */
export default function sicapClienteDirective() {
	return {
		restrict: 'E',
		scope: {
			entry: '=',
		},
		controllerAs: 'cliente',
		controller: ClienteController,
		template: `
<style>
.bs-callout-info{
	padding: 0px 1px 0px 5px;
	margin: 10px 0px;
}
.bs-callout-warning{
	padding: 0px 1px 0px 5px;
	margin: 10px 0px;
}
#wrapper .page-header {
	margin:0px;
	padding-bottom: 4px;
	padding-top: 8px;
}
#wrapper .page-header h4{
	margin-bottom: 3px;
}

.table > thead > tr > th, .table > tbody > tr > td{
	padding:3px;
}
</style>
<div class="bs-callout bs-callout-warning">
	<div class="row">
    	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
    		<div class="page-header text-right">
    			<h4>TRANSPORTE </h4>
    		</div>
    	</div>
    	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="input-group" style="margin-top:5px;display:inline-block;">
                <button type="button" ng-click="addVehiculo($event)" class="btn btn-default btn-sm">
                    <span class="fa fa-truck" aria-hidden="true"></span> Agregar vehículo
                </button>
            </div>
    		<span class="fa fa-truck" style="margin:10px;display:inline-block;" aria-hidden="true"> #{{model[keyNameFirst].length}} Vehículo</span>

    	</div>
    </div>

	<div class="bs-callout bs-callout-warning"  style="padding-top:3px;padding-right:3px;" ng-repeat="(keyVehiculo, valueVehiculo) in model[keyNameFirst] track by $index">
		<div class="page-header">
            <h4>
                <div style="float:none; display: inline-block;">
                    <span>VEHICULO #{{$index + 1}} &nbsp;&nbsp;</span>
                    <small>
                        <div class="pull-right">
                            <div class="btn-group btn-group-sm" dropdown>
                                <button type="button" class="btn btn-default">Acción</button>
                                <button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle>
                                    <span class="caret"></span>
                                    <span class="sr-only">Split button!</span>
                                </button>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a href="#" ng-click="removeVehiculo($event, keyVehiculo)">Borrar</a></li>
                                </ul>
                            </div>
                        </div>
                    </small>
                </div>
            </h4>
        </div>
	    <div class="row">
        	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
        		<label for="" class="control-label requerid">
                    Vehículo <span class="requerid">&nbsp;*</span>&nbsp;
                </label>
        		<div class="input-group">
                    <span class="input-group-btn">
                        <button type="button" ng-click="refreshVehiculo($event)" class="btn btn-default">
                            <span class="glyphicon glyphicon-refresh"></span>
                        </button>
                    </span>
                    <ui-select on-select="selVehiculo(keyVehiculo, $select)" ng-model="entry.values[keyNameFirst][keyVehiculo].vehiculo" ng-required="true" id="vehiculo" name="vehiculo">
                        <ui-select-match allow-clear="false" placeholder="Seleccione vehículo.">{{ $select.selected.label }}</ui-select-match>
                        <ui-select-choices repeat="item.value as item in vehiculos | filter: {label: $select.search} track by $index">
                            {{ item.label }}
                        </ui-select-choices>
                    </ui-select>
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default" ng-click="open($event)" ng-init="broadcast='choice:vehiculo:get'; param.keyNameFirst = keyNameFirst; param.keyFirst = keyVehiculo;" ng-controller="VehiculoCreateController">
                            <span class="fa fa-truck"></span> Registrar
                        </button>
                    </span>
                </div>
        	</div>
        	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
        		<label for="" class="control-label requerid">
                    Conductor <span class="requerid">&nbsp;*</span>&nbsp;
                </label>
        		<div class="input-group">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default">
                            <span class="glyphicon glyphicon-refresh"></span>
                        </button>
                    </span>
                    <ui-select on-select="selConductor(keyVehiculo, $select)" ng-model="entry.values[keyNameFirst][keyVehiculo].persona" ng-required="true" id="cond" name="cond">
                        <ui-select-match allow-clear="false" placeholder="Seleccione conductor.">{{ $select.selected.label }}</ui-select-match>
                        <ui-select-choices repeat="item.value as item in personas | filter: {label: $select.search} track by $index">
                            {{ item.label }}
                        </ui-select-choices>
                    </ui-select>
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default"  ng-click="open($event)" ng-init="broadcast='choice:conductor:get'; param.keyNameFirst = keyNameFirst; param.keyFirst = keyVehiculo;" ng-controller="PersonaCreateController">
                            <span class="fa fa-user-plus"></span> Registrar
                        </button>
                    </span>
                </div>
        	</div>
        </div>
        <div class="row">
        	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        		<div class="page-header" style="margin-bottom: 30px;"></div>
        	</div>
        </div>
        <div class="row">
        	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
			    <div class="page-header text-right">
			        <h4>EMPRESA DESTINO</h4>
			    </div>
        	</div>
        	<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
        		<div class="input-group">
        			<span class="input-group-btn">
                        <button type="button" ng-click="refreshCliente($event)" class="btn btn-default">
                            <span class="glyphicon glyphicon-refresh"></span>
                        </button>
                    </span>
                    <ui-select on-select="selCliente(keyVehiculo, $select)" ng-init="cliente.selCliente(keyVehiculo, $select)" ng-model="select[keyNameFirst][keyVehiculo].cli" id="cli" name="cli">
                        <ui-select-match allow-clear="false" placeholder="Seleccione cliente.">{{ $select.selected.label }}</ui-select-match>
                        <ui-select-choices repeat="item.value as item in clientes | filter: {label: $select.search} track by $index">
                            {{ item.label }}
                        </ui-select-choices>
                    </ui-select>
                    <span class="input-group-btn">
                        <button type="button" ng-click="addCliente($event, keyVehiculo)" class="btn btn-default">
                            <span class="glyphicon glyphicon-plus-sign"></span> Agregar cliente
                        </button>
                    </span>
                </div>
        	</div>
        </div>
	    <div class="row">
	        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
	            <div class="bs-callout bs-callout-info" style="padding-top:3px;padding-right:3px;" ng-repeat="(keyCliente, valueCliente) in valueVehiculo[keyNameSecond] track by $index">
	                <div class="page-header">
	                    <h4>
	                        <div style="float:none; display: inline-block;">
	                            <span>{{valueCliente.item.label}} &nbsp;&nbsp;</span>
		                        <small>
		                            <div class="pull-right">
		                                <div class="btn-group btn-group-sm" dropdown>
		                                    <button type="button" class="btn btn-default">Acción</button>
		                                    <button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle>
		                                        <span class="caret"></span>
		                                        <span class="sr-only">Split button!</span>
		                                    </button>
		                                    <ul class="dropdown-menu" role="menu">
		                                        <li><a href="#" ng-click="removeCliente($event, keyVehiculo, keyCliente)">Borrar</a></li>
		                                    </ul>
		                                </div>
		                            </div>
		                        </small>
	                        </div>
	                        <div style="float:right; display: inline-block;">
	                        	<small>
		                            <div class="pull-left">
    									<span class="fa fa-list" style="margin-top:5px; margin-right: 20px" aria-hidden="true"> #{{model[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird].length}} </span>
		                            </div>
		                        </small>
	                            <span class="text-right">Producto &nbsp;&nbsp;</span>
		                        <small>
		                            <div class="pull-right">
		                                <div class="btn-group btn-group-sm" dropdown>
		                                    <button type="button" class="btn btn-default">Acciones</button>
		                                    <button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle>
		                                        <span class="caret"></span>
		                                        <span class="sr-only">Split button!</span>
		                                    </button>
		                                    <ul class="dropdown-menu dropdown-menu-right" role="menu">
		                                        <li>
		                                        	<a href="#" ng-click="addProducto($event, keyVehiculo, keyCliente)">Agregar elemento</a>
		                                        </li>
		                                         <li role="separator" class="divider"></li>
		                                        <li>
		                                        	<a href="#" ng-click="open($event, 'productos')">Registrar producto</a>
		                                        </li>
		                                        <li>
		                                        	<a href="#" ng-click="open($event, 'productomarcas')">Registrar marca de producto</a>
		                                        </li>
		                                         <li role="separator" class="divider"></li>
		                                         <li>
		                                        	<a href="#" ng-click="open($event, 'medidas')">Registrar medida</a>
		                                        </li>
		                                    </ul>
		                                </div>
		                            </div>
		                        </small>
	                        </div>
	                    </h4>
	                </div>
	                <div class="row">
	                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
	                        <table class="table table-hover" style="margin-bottom: 3px;">
	                            <thead>
	                                <tr>
	                                    <th width="19%">Producto</th>
	                                    <th width="28%">Presentación</th>
	                                    <th width="19%">Cantidad</th>
	                                    <th width="12%">Prec. compra($)</th>
	                                    <th width="13%">Prec. venta(Final)</th>
	                                    <th width="6%">Obs.</th>
	                                    <th width="3%">Acci</th>
	                                </tr>
	                            </thead>
	                            <tbody>
	                                <tr ng-repeat="(keyProducto, valueProducto) in valueCliente[keyNameThird] track by $index">
	                                    <td>
		                                    <div class="input-group">
		                                        <span class="input-group-btn">
		                                            <button type="button" ng-click="refreshProducto($event, keyVehiculo, keyCliente, keyProducto)" class="btn btn-default">
		                                                <span class="glyphicon glyphicon-refresh"></span>
		                                            </button>
		                                        </span>
		                                        <ui-select on-select="selProducto(keyVehiculo, keyCliente, keyProducto, $item, $model)" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prod" ng-required="true" requerid="requerid" id="prod" name="prod">
		                                            <ui-select-match allow-clear="false" placeholder="Seleccione producto.">{{ $select.selected.label }}</ui-select-match>
		                                            <ui-select-choices repeat="item.value as item in productos | filter: {label: $select.search} track by $index">
		                                                {{ item.label }}
		                                            </ui-select-choices>
		                                        </ui-select>
												<div class="input-group-addon" style="padding:6px 0px;"></div>
		                                        <ui-select ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prod_marca" ng-required="true" requerid="requerid" id="prod_marca" name="prod_marca">
		                                            <ui-select-match allow-clear="false" placeholder="Seleccione marca.">{{ $select.selected.label }}</ui-select-match>
		                                            <ui-select-choices repeat="item.value as item in model[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].marca | filter: {label: $select.search} track by $index">
		                                                {{ item.label }}
		                                            </ui-select-choices>
		                                        </ui-select>
		                                    </div>
	                                    </td>
	                                    <td>
		                                    <div class="input-group">
		                                    	<input type="text" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].pres_uni" name="pres_unidad" id="pres_unidad" class="form-control" ng-required="true" required="required" placeholder="Unidad" autocomplete="off">
												<div class="input-group-addon" style="padding:6px">x</div>
		                                    	<input type="text" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].pres_num" name="pres_num" id="pres_num" class="form-control" ng-required="true" required="required" placeholder="Ingrese." autocomplete="off">
												<div class="input-group-addon" style="padding:6px 0px;"></div>
		                                    	<ui-select ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].pres_med" ng-required="true" requerid="requerid" id="pres_med" name="pres_med">
		                                            <ui-select-match allow-clear="false" placeholder="Seleccione.">{{ $select.selected.label }}</ui-select-match>
		                                            <ui-select-choices group-by="'mag'" repeat="item.value as item in prestaciones | filter: {label: $select.search} track by $index">
		                                                {{ item.label }}
		                                            </ui-select-choices>
		                                        </ui-select>
										    </div>
	                                    </td>
	                                    <td>
		                                    <div class="input-group">
	                                    		<input type="text" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].pres_cant" name="pres_cant" id="pres_cant" class="form-control"  ng-required="true" required="required" placeholder="Ingrese." autocomplete="off">
												<div class="input-group-addon" style="padding:6px 0px;"></div>
		                                        <ui-select ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].pres_mmed" ng-required="true" required="required" id="pres_mmed" name="pres_mmed">
		                                            <ui-select-match allow-clear="false" placeholder="Seleccione.">{{ $select.selected.label }}</ui-select-match>
		                                            <ui-select-choices group-by="'mag'" repeat="item.value as item in medidas | filter: {label: $select.search} track by $index">
		                                                {{ item.label }}
		                                            </ui-select-choices>
		                                        </ui-select>
		                                        <span class="input-group-btn">
		                                            <button type="button" ng-click="refreshMedida($event)" class="btn btn-default">
		                                                <span class="glyphicon glyphicon-refresh"></span>
		                                            </button>
		                                        </span>
		                                    </div>
	                                    </td>
	                                    <td>
	                                    	<input type="text" name="prec_compra" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prec_compra" class="form-control" placeholder="Ingrese." autocomplete="off" data-toggle="tooltip" tooltip-placement="bottom-left"  tooltip-trigger="focus" tooltip="{{entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prec_compra | currency: '$'}} .">
	                                    </td>
	                                    <td>
	                                    	<input type="text" name="prec_venta" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prec_venta" class="form-control" ng-required="true" required="required" placeholder="Ingrese." autocomplete="off"  data-toggle="tooltip" tooltip-placement="bottom-left" tooltip-trigger="focus" tooltip="{{entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].prec_venta | currency: 'Bs.F'}}.">
	                                    </td>
	                                    <td>
	                                    	<input type="text" name="obs" ng-model="entry.values[keyNameFirst][keyVehiculo][keyNameSecond][keyCliente][keyNameThird][keyProducto].obs" class="form-control" placeholder="Opcional." autocomplete="off">
	                                    </td>
	                                    <td>
	                                    	<button type="button" ng-click="removeProducto($event, keyVehiculo, keyCliente, keyProducto)" class="btn btn-default btn-xs pull-right">
							                    <span class="glyphicon glyphicon-trash"></span>
							                </button>
	                                    </td>
	                                </tr>
	                            </tbody>
	                        </table>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>

</div>
`
	};
}
ClienteController.$inject = ['$scope', '$rootScope', '$modal', '$stateParams', '$log', 'UtilityService', 'notification'];
ProductoMarcaCreateModalController.$inject = ['$rootScope', '$scope', '$modal', '$modalInstance', 'notification', 'progression', 'UtilityService', '$state', '$stateParams', 'RestWrapper', 'ctrlParent'];
RubroCreateModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'notification', 'progression', 'UtilityService', '$state', '$stateParams', 'RestWrapper', 'ctrlParent'];

sicapClienteDirective.$inject = [];