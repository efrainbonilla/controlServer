define(function() {
	'use strict';

	function RubroProductoAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('RubroProductoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var rubroproductos = nga.entity('rubroproductos')
				.identifier(nga.field('id'))
				.label('Rubros');

			rubroproductos.listView()
				.title('Listado de rubro de productos')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Nombre'),
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

			rubroproductos.creationView()
				.title('Crear nueva rubro de producto')
				.fields([
					nga.field('nomb').label('Nombre'),
				]);

			rubroproductos.editionView()
				.title('Actualizar rubro de producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('nomb').label('Nombre'),
				]);

			rubroproductos.showView()
				.title('Detalle de rubro de productos #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Nombre'),
				]);

			return rubroproductos;
		}]);
	}
	RubroProductoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return RubroProductoAdmin;
});