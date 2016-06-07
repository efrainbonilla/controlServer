define(function() {
	'use strict';

	function MagnitudAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('MagnitudAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var magnitud = nga.entity('magnituds')
				.identifier(nga.field('id'))
				.label('Magnitud');

			magnitud.listView()
				.title('Listado de magnitudes')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Magnitud'),
					nga.field('simb').label('Simbolo'),
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

			magnitud.creationView()
				.title('Crear nueva magnitud')
				.fields([
					nga.field('nomb').label('Magnitud'),
					nga.field('simb').label('Simbolo'),
				]);

			magnitud.editionView()
				.title('Actualizar magnitud #{{ ::entry.identifierValue }}')
				.fields([
					magnitud.creationView().fields()
				]);

			magnitud.showView()
				.title('Detalle magnitud #{{ ::entry.identifierValue }}')
				.fields([
					magnitud.listView().fields()
				]);

			return magnitud;
		}]);
	}
	MagnitudAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return MagnitudAdmin;
});