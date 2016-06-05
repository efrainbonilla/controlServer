define(function(require) {
	'use strict';

	function ParroquiaAdmin($provide, NgAdminConfigurationProvider, PaisAdminProvider, EstadoAdminProvider, MunicipioAdminProvider) {
		$provide.factory('ParroquiaAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;
			var util = UtilityService;
			var pais = PaisAdminProvider.$get();
			var estado = EstadoAdminProvider.$get();
			var municipio = MunicipioAdminProvider.$get();

			var parroquia = nga.entity('parroquias')
				.identifier(nga.field('parroq_codi'))
				.label('Parroquias');

			parroquia.listView()
				.infinitePagination(false)
				.fields([
					nga.field('parroq_codi').label('parroq_codi'),
					nga.field('parroq_nomb').label('parroq_nomb'),
					nga.field('muni.muni_nomb').label('muni_nomb'),
					nga.field('muni.edo.edo_nomb').label('edo_nomb'),
					nga.field('muni.edo.pais.pais_nomb').label('pais_nomb'),
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

			parroquia.creationView()
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
					.choices(util.choiceMunicipio()),

					nga.field('parroq_nomb').label('parroq_nomb'),
					nga.field('parroq_codi').label('parroq_codi'),
				]);

			parroquia.editionView()
				.fields([
					nga.field('pais', 'choice')
					.label('pais_nomb')
					.attributes({
						'on-select': 'selPais($item, $model)'
					})
					.choices(function(entry, scope) {

						entry.values['pais'] = entry.values['muni.edo.pais.pais_id'];

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
						paisId = entry.values['muni.edo.pais.pais_id'];
						entry.values['edo'] = entry.values['muni.edo.edo_codi'];

						util.choiceEstado()(entry, scope);

						$rootScope.$broadcast('choice:estados:get', {value: paisId}, paisId);

						return [];
					}),

					nga.field('muni', 'choice')
					.label('muni_nomb')
					.choices(function (entry, scope) {
						var edoCodi;
						edoCodi = entry.values['muni.edo.edo_codi'];
						entry.values['muni'] = entry.values['muni.muni_codi'];

						util.choiceMunicipio()(entry, scope);

						$rootScope.$broadcast('choice:municipios:get', {value: edoCodi}, edoCodi);

						return [];
					}),
					nga.field('parroq_nomb').label('parroq_nomb'),
					nga.field('parroq_codi').label('parroq_codi'),
				]);

			parroquia.showView()
				.fields([
					nga.field('muni.edo.pais.pais_id', 'reference')
					.label('pais_nomb')
					.targetEntity(pais)
					.targetField(nga.field('pais_nomb')),

					nga.field('muni.edo.edo_codi', 'reference')
					.label('edo_nomb')
					.targetEntity(estado)
					.targetField(nga.field('edo_nomb')),

					nga.field('muni.muni_codi', 'reference')
					.label('muni_nomb')
					.targetEntity(municipio)
					.targetField(nga.field('muni_nomb')),

					nga.field('parroq_nomb').label('parroq_nomb'),
					nga.field('parroq_codi').label('parroq_codi'),
				]);

			return parroquia;
		}]);
	}
	ParroquiaAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider', 'PaisAdminProvider', 'EstadoAdminProvider', 'MunicipioAdminProvider'];

	return ParroquiaAdmin;
});