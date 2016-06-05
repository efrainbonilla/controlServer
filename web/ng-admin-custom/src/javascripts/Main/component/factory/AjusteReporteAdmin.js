define(function(require) {
	'use strict';

	function AjusteReporteAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('AjusteReporteAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var reporte = nga.entity('ajustereportes')
				.identifier(nga.field('id'))
				.label('Ajuste Reporte');

			reporte.listView()
				.title('Ajustes de Reportes')
				.infinitePagination(false)
				.fields([
					nga.field('module').label('Modulo'),
					nga.field('group').label('Grupo'),
					nga.field('api').label('Api'),
					nga.field('action').label('Action'),
					nga.field('key').label('Clave'),
					nga.field('value').label('Valor'),
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

			reporte.creationView()
				.title('Crear nuevo ajuste de reporte.')
				.fields([
					nga.field('module').label('Modulo'),
					nga.field('group').label('Grupo'),
					nga.field('api').label('Api'),
					nga.field('action').label('Acción(Metodo quien recibe en backend)'),
					nga.field('key').label('Clave (Nombre de archivo de reporte)'),
					nga.field('value').label('Valor(Descripción de reporte)'),
				]);

			reporte.editionView()
				.title('Actualizar ajuste de reporte #{{ ::entry.identifierValue }}')
				.fields([
					reporte.creationView().fields(),
				]);

			reporte.showView()
				.title('Detalle ajuste de reporte #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					reporte.creationView().fields(),
				]);

			return reporte;
		}]);
	}
	AjusteReporteAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return AjusteReporteAdmin;
});