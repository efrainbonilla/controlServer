define(function(require) {
	'use strict';

	function ProductoAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('ProductoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var producto = nga.entity('xproductos')
				.identifier(nga.field('id'))
				.label('Productos');

			producto.listView()
				.title('Lista de productos')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('prod_id'),
					nga.field('nomb').label('prod_nomb'),

					nga.field('rubro', 'template')
						.label('Rubros')
                		.template('<span ng-repeat="item in entry.values.rubro track by $index" class="label label-default">{{ item.rubro.nomb }}</span>'),

                	nga.field('marca', 'template')
						.label('Marca')
                		.template('<span ng-repeat="item in entry.values.marca track by $index" class="label label-default">{{ item.marca.nomb }}</span>')
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

			producto.creationView()
				.title('Crear nuevo producto')
				.fields([
					nga.field('nomb').label('prod_nomb'),
				]);

			producto.editionView()
				.title('Actualizar producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('nomb').label('prod_nomb'),
				]);

			producto.showView()
				.title('Detalle producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('prod_id'),
					nga.field('nomb').label('prod_nomb'),
				]);

			return producto;
		}]);
	}
	ProductoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return ProductoAdmin;
});