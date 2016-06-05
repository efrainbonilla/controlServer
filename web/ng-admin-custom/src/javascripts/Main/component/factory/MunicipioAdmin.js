define(function(require) {
	'use strict';

	function MunicipioAdmin($provide, NgAdminConfigurationProvider, PaisAdminProvider, EstadoAdminProvider) {
		$provide.factory('MunicipioAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;
			var util = UtilityService;
			var pais = PaisAdminProvider.$get();
			var estado = EstadoAdminProvider.$get();

			var municipio = nga.entity('municipios')
				.identifier(nga.field('muni_codi'))
				.label('Municipios');

			municipio.listView()
				.infinitePagination(false)
				.fields([
					nga.field('muni_codi').label('muni_codi'),
					nga.field('muni_nomb').label('muni_nomb'),
					nga.field('edo.edo_nomb').label('edo_nomb'),
					nga.field('edo.pais.pais_nomb').label('pais_nomb'),
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

			municipio.creationView()
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.attributes({
						'on-select': 'selPais($item, $model)'
					})
					.choices(function(entry, scope) {

						util.choicePais()(entry, scope);

						$rootScope.$broadcast('choice:pais:get');

						return [];
					}),

					nga.field('edo', 'choice')
					.label('edo_nomb')
					.choices(util.choiceEstado()),

					nga.field('muni_nomb').label('muni_nomb'),
					nga.field('muni_codi').label('muni_codi'),

				]);

			municipio.editionView()
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.attributes({
						'on-select': 'selPais($item, $model)'
					})
					.choices(function(entry, scope) {

						entry.values['pais'] = entry.values['edo.pais.pais_id'];

						util.choicePais()(entry, scope);

						$rootScope.$broadcast('choice:pais:get');

						return [];
					}),

					nga.field('edo', 'choice')
					.label('edo_nomb')
					.choices(function (entry, scope) {
						var paisId;
						paisId = entry.values['edo.pais.pais_id'];
						entry.values['edo'] = entry.values['edo.edo_codi'];

						util.choiceEstado()(entry, scope);

						$rootScope.$broadcast('choice:estados:get', {value: paisId}, paisId);

						return [];
					}),

					nga.field('muni_nomb').label('muni_nomb'),
					nga.field('muni_codi').label('muni_codi'),
				]);

			municipio.showView()
				.fields([
					nga.field('edo.pais.pais_id', 'reference')
					.label('pais_nomb')
					.targetEntity(pais)
					.targetField(nga.field('pais_nomb')),

					nga.field('edo.edo_codi', 'reference')
					.label('edo_nomb')
					.targetEntity(estado)
					.targetField(nga.field('edo_nomb')),

					nga.field('muni_nomb').label('muni_nomb'),
					nga.field('muni_codi').label('muni_codi'),
				]);

			return municipio;
		}]);
	}
	MunicipioAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider', 'PaisAdminProvider', 'EstadoAdminProvider'];

	return MunicipioAdmin;
});