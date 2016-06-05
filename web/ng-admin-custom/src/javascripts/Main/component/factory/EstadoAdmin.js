define(function(require) {
	'use strict';

	function EstadoAdmin($provide, NgAdminConfigurationProvider, PaisAdminProvider) {
		$provide.factory('EstadoAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;
			var util = UtilityService;
			var pais = PaisAdminProvider.$get();

			var estado = nga.entity('estados')
				.identifier(nga.field('edo_codi'))
				.label('Estados');

			estado.listView()
				.infinitePagination(false)
				.fields([
					nga.field('edo_codi').label('edo_codi'),
					nga.field('edo_nomb').label('edo_nomb'),
					nga.field('pais.pais_nomb').label('pais_nomb'),
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

			estado.creationView()
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.choices(function(entry, scope) {

						util.choicePais()(entry, scope);

						$rootScope.$broadcast('choice:pais:get');

						return [];
					}),

					nga.field('edo_nomb').label('edo_nomb'),
					nga.field('edo_codi').label('edo_codi'),
				]);

			estado.editionView()
				.title('Actualizar ajuste de reporte #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.choices(function(entry, scope) {

						entry.values['pais'] = entry.values['pais.pais_id'];

						util.choicePais()(entry, scope);

						$rootScope.$broadcast('choice:pais:get');

						return [];
					}),

					nga.field('edo_nomb').label('edo_nomb'),
					nga.field('edo_codi').label('edo_codi'),
				]);

			estado.showView()
				.fields([
					nga.field('pais.pais_id', 'reference')
					.label('pais_nomb')
					.targetEntity(pais)
					.targetField(nga.field('pais_nomb')),

					nga.field('edo_nomb').label('edo_nomb'),
					nga.field('edo_codi').label('edo_codi'),
				]);

			return estado;
		}]);
	}
	EstadoAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider', 'PaisAdminProvider'];

	return EstadoAdmin;
});