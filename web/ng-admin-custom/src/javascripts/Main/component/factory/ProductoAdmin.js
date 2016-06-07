define(function() {
	'use strict';

	function ProductoAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('ProductoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var producto = nga.entity('productos')
				.identifier(nga.field('id'))
				.label('Productos');

			producto.listView()
				.title('Lista de productos')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Nombre'),

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
					nga.field('nomb').label('Nombre'),

					nga.field('marca', 'choices')
					.label('Marca')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione marca(s).'
					})
					.choices(function(entry, scope) {

						util.choiceMarcaProductos()(entry, scope);

						$rootScope.$broadcast('choice:marcaproductos:get');

						return [];
					}),

					nga.field('rubro', 'choices')
					.label('Rubro')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione rubro(s).'
					})
					.choices(function(entry, scope) {

						util.choiceRubroProductos()(entry, scope);

						$rootScope.$broadcast('choice:rubroproductos:get');

						return [];
					}),
				]);

			producto.editionView()
				.title('Actualizar producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('nomb').label('Nombre'),

					nga.field('marca', 'choices')
					.label('Marca')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione marca(s).'
					})
					.choices(function(entry, scope) {
						console.log(entry.values);
						util.choiceMarcaProductos()(entry, scope);

						$rootScope.$broadcast('choice:marcaproductos:get');

						return [];
					}),

					nga.field('rubro', 'choices')
					.label('Rubro')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione rubro(s).'
					})
					.choices(function(entry, scope) {

						util.choiceRubroProductos()(entry, scope);

						$rootScope.$broadcast('choice:rubroproductos:get');

						return [];
					}),
				]);

			producto.showView()
				.title('Detalle producto #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Nombre'),
				]);

			return producto;
		}]);
	}
	ProductoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return ProductoAdmin;
});