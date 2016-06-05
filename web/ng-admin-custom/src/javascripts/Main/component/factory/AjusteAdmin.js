define(function() {
	'use strict';

	function AjusteAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('AjusteAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var ajuste = nga.entity('ajustes')
				.identifier(nga.field('id'))
				.label('Ajustes');

			ajuste.listView()
				.infinitePagination(false)
				.title('Lista de Ajustes')
				.fields([
					nga.field('id').label('id'),
					nga.field('key').label('key'),
					nga.field('value').label('value'),
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

			ajuste.creationView()
				.title('Crear nuevo Ajuste')
				.fields([
					nga.field('key').label('key'),
					nga.field('value').label('value'),
				]);

			ajuste.editionView()
				.title('Actualizar Ajuste #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('key').label('key'),
					nga.field('value').label('value'),
				]);

			ajuste.showView()
				.title('Detalle Ajuste #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('id'),
					nga.field('key').label('key'),
					nga.field('value').label('value'),
				]);

			return ajuste;
		}]);
	}
	AjusteAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return AjusteAdmin;
});