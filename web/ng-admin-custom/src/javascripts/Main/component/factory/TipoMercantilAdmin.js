define(function() {
	'use strict';

	function TipoMercantilAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('TipoMercantilAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var tipomercantil = nga.entity('tipomercantils')
				.identifier(nga.field('id'))
				.label('Tipo');

			tipomercantil.listView()
				.infinitePagination(false)
				.title('Lista Tipos de Entidades')
				.fields([
					nga.field('id').label('id'),
					nga.field('desc').label('desc'),
					nga.field('codi').label('codi'),
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

			tipomercantil.creationView()
				.title('Crear nuevo tipo de entidad')
				.fields([
					nga.field('desc').label('desc'),
					nga.field('codi').label('codi'),
				]);

			tipomercantil.editionView()
				.title('Actualizar tipo de entidad #{{ ::entry.identifierValue }}')
				.fields([
					tipomercantil.creationView().fields(),
				]);

			tipomercantil.showView()
				.title('Detalle tipo de entidad #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('id'),
					tipomercantil.creationView().fields(),
				]);

			return tipomercantil;
		}]);
	}
	TipoMercantilAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return TipoMercantilAdmin;
});