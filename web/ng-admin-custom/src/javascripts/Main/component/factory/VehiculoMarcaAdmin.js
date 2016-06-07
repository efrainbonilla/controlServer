define(function() {
	'use strict';

	function VehiculoMarcaAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('VehiculoMarcaAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var vehiculomarca = nga.entity('vehiculomarcas')
				.identifier(nga.field('id'))
				.label('Marcas de vehículo');

			vehiculomarca.listView()
				.title('Listado de marcas de vehículo')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Marca'),
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

			vehiculomarca.creationView()
				.title('Crear nueva marca de vehículo')
				.fields([
					nga.field('nomb').label('Marca'),
				]);

			vehiculomarca.editionView()
				.title('Actualizar marca de vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculomarca.creationView().fields()
				]);

			vehiculomarca.showView()
				.title('Detalle marca de vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculomarca.listView().fields()
				]);

			return vehiculomarca;
		}]);
	}
	VehiculoMarcaAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return VehiculoMarcaAdmin;
});