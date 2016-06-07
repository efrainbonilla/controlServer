define(function() {
	'use strict';

	function MarcaProductoAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('MarcaProductoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var marcaproductos = nga.entity('marcaproductos')
				.identifier(nga.field('id'))
				.label('Marcas');

			marcaproductos.listView()
				.title('Listado de marca de productos')
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

			marcaproductos.creationView()
				.title('Crear nueva marca de producto')
				.fields([
					nga.field('nomb').label('Nombre'),
				]);

			marcaproductos.editionView()
				.title('Actualizar marca de producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('nomb').label('Nombre'),
				]);

			marcaproductos.showView()
				.title('Detalle marcaproductos #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Nombre'),
				]);

			return marcaproductos;
		}]);
	}
	MarcaProductoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return MarcaProductoAdmin;
});