define(function() {
	'use strict';

	function VehiculoModeloAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('VehiculoModeloAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var vehiculomodelo = nga.entity('vehiculomodelos')
				.identifier(nga.field('id'))
				.label('Modelos de Marcas de Vehículos');

			vehiculomodelo.listView()
				.title('Listado de modelos de marcas de vehículo')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Modelo'),
					nga.field('anio').label('Año'),
					nga.field('marca.nomb').label('Marca'),
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

			vehiculomodelo.creationView()
				.title('Crear nuevo modelo de marca de vehículo')
				.fields([
					nga.field('marca', 'choice')
					.label('Marca')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione marca.'
					})
					.choices(function(entry, scope) {

						util.choiceMarcaVehiculo()(entry, scope);

						$rootScope.$broadcast('choice:marcavehiculos:get');

						return [];
					}),
					nga.field('nomb').label('Modelo'),
					nga.field('anio').label('Año'),
				]);

			vehiculomodelo.editionView()
				.title('Actualizar modelo de marca de vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculomodelo.creationView().fields()
				]);

			vehiculomodelo.showView()
				.title('Detalle modelo de marca de vehículo #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Modelo'),
					nga.field('anio').label('Año'),
					nga.field('marca.nomb').label('Marca'),
				]);

			return vehiculomodelo;
		}]);
	}
	VehiculoModeloAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return VehiculoModeloAdmin;
});