define(function() {
	'use strict';

	function VehiculoAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('VehiculoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var vehiculo = nga.entity('vehiculos')
				.identifier(nga.field('id'))
				.label('Vehículos');

			vehiculo.listView()
				.title('Lista de vehículos')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('marca.nomb').label('Marca'),
					nga.field('modelo.nomb').label('Modelo'),
					nga.field('color').label('Color'),
					nga.field('placa').label('Placa'),
				])
				.filters([
					nga.field('q', 'template')
					.label('')
					.pinned(true)
					.template('<div class="input-group"><input type="text" ng-model="value" ng-model-options="{debounce: 1500}" placeholder="Buscar" class="form-control"></input><span ng-click="$parent.filterCtrl.filter()" class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),

					nga.field('filters_operator', 'choice')
					.label('Operador SQL')
					.choices(util.filterOperators()),

					nga.field('limit', 'choice')
					.label('Mostrar limite')
					.choices(util.filterLimit()),
				])
				.listActions(['edit', 'delete', 'show']);

			vehiculo.creationView()
				.title('Crear nuevo vehículo')
				.fields([
					nga.field('marca', 'choice')
					.label('Marca')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione marca.',
						'on-select': 'selMarca($item, $model)'
					})
					.choices(function(entry, scope) {

						util.choiceMarcaVehiculo()(entry, scope);

						$rootScope.$broadcast('choice:marcavehiculos:get');

						scope.selMarca = function($item, $model) {
							entry.values['modelo'] = '';
							$rootScope.$broadcast('choice:modelovehiculos:reset');
							$rootScope.$broadcast('choice:modelovehiculos:get', $item, $model);
						};

						return [];
					}),

					nga.field('modelo', 'choice')
					.label('Modelo')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione modelo.'
					})
					.choices(function(entry, scope) {

						util.choiceModeloVehiculo()(entry, scope);

						$rootScope.$broadcast('choice:modelovehiculos:get', {}, entry.values['marca.id']);

						return [];
					}),
					nga.field('color').label('Color'),
					nga.field('placa').label('Placa'),
				]);

			vehiculo.editionView()
				.title('Actualizar vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculo.creationView().fields()
				]);

			vehiculo.showView()
				.title('Detalle vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculo.listView().fields()
				]);

			return vehiculo;
		}]);
	}
	VehiculoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return VehiculoAdmin;
});