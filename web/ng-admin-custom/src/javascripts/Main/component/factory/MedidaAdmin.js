define(function() {
	'use strict';

	function MedidaAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('MedidaAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var medida = nga.entity('medidas')
				.identifier(nga.field('id'))
				.label('Medidas');

			medida.listView()
				.title('Lista de medidas')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Medida'),
					nga.field('simb').label('Simbolo'),
					nga.field('magnitud.nomb').label('Magnitud'),
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

			medida.creationView()
				.title('Crear nueva magnitud')
				.fields([
					nga.field('magnitud', 'choice')
					.label('Magnitud')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione magnitud.'
					})
					.choices(function(entry, scope) {

						util.choiceMagnitud()(entry, scope);

						$rootScope.$broadcast('choice:magnituds:get');

						return [];
					}),
					nga.field('nomb').label('Medida'),
					nga.field('simb').label('Simbolo'),
				]);

			medida.editionView()
				.title('Actualizar medida #{{ ::entry.identifierValue }}')
				.fields([
					medida.creationView().fields()
				]);

			medida.showView()
				.title('Detalle medida #{{ ::entry.identifierValue }}')
				.fields([
					medida.listView().fields()
				]);

			return medida;
		}]);
	}
	MedidaAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return MedidaAdmin;
});