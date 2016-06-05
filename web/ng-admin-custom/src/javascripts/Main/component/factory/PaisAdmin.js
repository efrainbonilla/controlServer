define(function(require) {
	'use strict';

	function PaisAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('PaisAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var pais = nga.entity('pais')
				.identifier(nga.field('pais_id'))
				.label('Pais');

			pais.listView()
				.infinitePagination(false)
				.fields([
					nga.field('pais_id').label('pais_id'),
					nga.field('pais_nomb').label('pais_nomb'),
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

			pais.creationView()
				.title('Crear nuevo pais')
				.fields([
					nga.field('pais_nomb').label('pais_nomb'),
				]);

			pais.editionView()
				.title('Actualizar pais #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('pais_nomb').label('pais_nomb'),
				]);

			pais.showView()
				.title('Detalle pais #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('pais_id').label('pais_id'),
					nga.field('pais_nomb').label('pais_nomb'),
				]);

			return pais;
		}]);
	}
	PaisAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return PaisAdmin;
});