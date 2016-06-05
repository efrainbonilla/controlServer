define(function(require) {
	'use strict';

	function ZonaAdmin($provide, NgAdminConfigurationProvider, PaisAdminProvider, EstadoAdminProvider, MunicipioAdminProvider, ParroquiaAdminProvider) {
		$provide.factory('ZonaAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;
			var util = UtilityService;
			var pais = PaisAdminProvider.$get();
			var estado = EstadoAdminProvider.$get();
			var municipio = MunicipioAdminProvider.$get();
			var parroquia = ParroquiaAdminProvider.$get();

			var zona = nga.entity('zonas')
				.identifier(nga.field('zona_id'))
				.label('Zonas');

			zona.listView()
				.infinitePagination(false)
				.fields([
					nga.field('zona_id').label('zona_id'),
					nga.field('zona_nomb').label('zona_nomb'),
					nga.field('parroq.parroq_nomb').label('parroq_nomb'),
					nga.field('parroq.muni.muni_nomb').label('muni_nomb'),
					nga.field('parroq.muni.edo.edo_nomb').label('edo_nomb'),
					nga.field('parroq.muni.edo.pais.pais_nomb').label('pais_nomb'),
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

			zona.creationView()
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
					.attributes({
						'on-select': 'selEdo($item, $model)'
					})
					.choices(util.choiceEstado()),

					nga.field('muni', 'choice')
					.label('muni_nomb')
					.attributes({
						'on-select': 'selMuni($item, $model)'
					})
					.choices(util.choiceMunicipio()),

					nga.field('parroq', 'choice')
					.label('parroq_nomb')
					.choices(util.choiceParroquia()),

					nga.field('zona_nomb').label('zona_nomb'),
				]);

			zona.editionView()
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.attributes({
						'on-select': 'selPais($item, $model)'
					})
					.choices(function(entry, scope) {

						entry.values['pais'] = entry.values['parroq.muni.edo.pais.pais_id'];

						util.choicePais()(entry, scope);

						$rootScope.$broadcast('choice:pais:get');

						return [];
					}),

					nga.field('edo', 'choice')
					.label('edo_nomb')
					.attributes({
						'on-select': 'selEdo($item, $model)'
					})
					.choices(function (entry, scope) {
						var paisId;
						paisId = entry.values['parroq.muni.edo.pais.pais_id'];
						entry.values['edo'] = entry.values['parroq.muni.edo.edo_codi'];

						util.choiceEstado()(entry, scope);

						$rootScope.$broadcast('choice:estados:get', {value: paisId}, paisId);

						return [];
					}),

					nga.field('muni', 'choice')
					.label('muni_nomb')
					.attributes({
						'on-select': 'selMuni($item, $model)'
					})
					.choices(function (entry, scope) {
						var edoCodi;
						edoCodi = entry.values['parroq.muni.edo.edo_codi'];
						entry.values['muni'] = entry.values['parroq.muni.muni_codi'];

						util.choiceMunicipio()(entry, scope);

						$rootScope.$broadcast('choice:municipios:get', {value: edoCodi}, edoCodi);

						return [];
					}),

					nga.field('parroq', 'choice')
					.label('parroq_nomb')
					.choices(function (entry, scope) {
						var muniCodi;
						muniCodi = entry.values['parroq.muni.muni_codi'];
						entry.values['parroq'] = entry.values['parroq.parroq_codi'];

						util.choiceParroquia()(entry, scope);

						$rootScope.$broadcast('choice:parroquias:get', {value: muniCodi}, muniCodi);

						return [];
					}),

					nga.field('zona_nomb').label('zona_nomb'),
				]);

			zona.showView()
				.fields([
					nga.field('parroq.muni.edo.pais.pais_id', 'reference')
					.label('pais_nomb')
					.targetEntity(pais)
					.targetField(nga.field('pais_nomb')),

					nga.field('parroq.muni.edo.edo_codi', 'reference')
					.label('edo_nomb')
					.targetEntity(estado)
					.targetField(nga.field('edo_nomb')),

					nga.field('parroq.muni.muni_codi', 'reference')
					.label('muni_nomb')
					.targetEntity(municipio)
					.targetField(nga.field('muni_nomb')),

					nga.field('parroq.parroq_codi', 'reference')
					.label('parroq_nomb')
					.targetEntity(parroquia)
					.targetField(nga.field('parroq_nomb')),

					nga.field('zona_nomb').label('zona_nomb'),
				]);

			return zona;

		}]);
	}
	ZonaAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider', 'PaisAdminProvider', 'EstadoAdminProvider', 'MunicipioAdminProvider', 'ParroquiaAdminProvider'];

	return ZonaAdmin;
});