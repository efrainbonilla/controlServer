define(function(require) {
	'use strict';

	function MercantilAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('MercantilAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;
			var util = UtilityService;

			var mercantil = nga.entity('mercantils')
				.identifier(nga.field('id'))
				.label('Mercantil');

			var mercantilCreateView = require('../../view/mercantilCreateView.html');
			var mercantilEditView = require('../../view/mercantilEditView.html');
			var mercantilShowView = require('../../view/mercantilShowView.html');

			mercantil.listView()
				.infinitePagination(false)
				.title('Lista de Entidades')
				.fields([
					nga.field('fix_rif').label('RIF'),
					nga.field('razon_social').label('Razon Social'),
					nga.field('prop', 'template')
						.label('Propietario')
						.template('<ul><li style="margin-bottom: 5px;" ng-repeat="item in entry.values[\'prop\'] track by $index"><span>{{ item.persona.nomb_apell }}</span></li></ul>'),

					nga.field('repres', 'template')
						.label('Representantes')
						.template('<ul><li style="margin-bottom: 5px;" ng-repeat="item in entry.values[\'repres\'] track by $index"><span>{{ item.persona.nomb_apell }}</span></li></ul>'),

					nga.field('tipo', 'template')
						.label('Tipo de Entidad')
                		.template('<span ng-repeat="item in entry.values.tipo track by $index" class="label label-default">{{ item.tipo.desc }}</span>')

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

			mercantil.creationView()
				.title('Crear nueva Entidad')
				.fields([
					nga.field('rif_fix', 'choice')
					.label('Tipo de documento')
					.validation({
						required: true
					})
					.choices(util.choiceRifFix()()),

					nga.field('rif')
					.validation({
						required: true,
						minlength: 9,
						maxlength: 15
					}),

					nga.field('razon_social')
					.label('Razon Social')
					.validation({
						required: true,
						minlength: 5,
						maxlength: 100
					}),

					nga.field('direccion.edo', 'choice')
					.label('edo_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selEdo($item, $model)'
					})
					.choices(function(entry, scope) {

						util.choiceEstado()(entry, scope);

						$rootScope.$broadcast('choice:estados:get', {
							value: '22'
						}, '22');

						return [];
					}),

					nga.field('direccion.muni', 'choice')
					.label('muni_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selMuni($item, $model)'
					})
					.choices(util.choiceMunicipio()),

					nga.field('direccion.parroq', 'choice')
					.label('parroq_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selParroq($item, $model)'
					})
					.choices(util.choiceParroquia()),

					nga.field('direccion.zona', 'choice')
					.label('zona_nomb')
					.validation({
						required: true
					})
					.choices(util.choiceZona()),

					nga.field('direccion.av_calle')
					.label('av_calle')
					.validation({
						required: true,
						minlength: 2,
						maxlength: 50
					}),
					nga.field('direccion.pto_ref')
					.label('pto_ref')
					.validation({
						required: false,
						minlength: 2,
						maxlength: 100
					}),

					nga.field('prop', 'choices')
					.label('_')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Introduzca cédula de propietario.',
						'on-select': 'selProp($item, $model, $select)',
						'on-remove': 'removeProp($item, $model, $select)',
						'ng-init': 'initProp($select)'
					})
					.choices(function(entry, scope) {

						util.choiceProp()(entry, scope);

						$rootScope.$broadcast('choice:prop:get');

						return [];
					}),

					nga.field('repres', 'choices')
					.label('_')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Introduzca cédula de representante.',
						'on-select': 'selRepres($item, $model, $select)',
						'on-remove': 'removeRepres($item, $model, $select)',
						'ng-init': 'initRepres($select)'
					})
					.choices(function(entry, scope) {

						scope.$parent.$parent.representantes = [];

						util.choiceRepres()(entry, scope);

						$rootScope.$broadcast('choice:repres:get');

						return [];
					}),

					nga.field('tipo', 'choices')
					.label('Tipo')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione.'
					})
					.choices(function(entry, scope) {

						util.choiceTipoMercantil()(entry, scope);

						$rootScope.$broadcast('choice:tipomercantils:get');

						return [];
					}),
				])
				.template(mercantilCreateView);

			mercantil.editionView()
				.title('Actualizar entidad #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('rif_fix', 'choice')
					.label('Tipo de documento')
					.validation({
						required: true
					})
					.choices(util.choiceRifFix()()),
					nga.field('rif')
					.validation({
						required: true,
						minlength: 10,
						maxlength: 15
					}),

					nga.field('razon_social')
					.label('Razon Social')
					.validation({
						required: true,
						minlength: 5,
						maxlength: 100
					}),

					nga.field('direccion.edo', 'choice')
					.label('edo_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selEdo($item, $model)'
					})
					.choices(function(entry, scope) {

						var edoCodi, paisId;
						edoCodi = entry.values['direccion.edo'] = entry.values['direccion.edo.edo_codi'];
						paisId = entry.values['direccion.edo.pais.pais_id'];
						delete entry.values['direccion.mercantil'];
						delete entry.values['direccion.id'];

						util.choiceEstado()(entry, scope);

						$rootScope.$broadcast('choice:estados:get', {
							value: paisId
						}, paisId);

						return [];
					}),

					nga.field('direccion.muni', 'choice')
					.label('muni_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selMuni($item, $model)'
					})
					.choices(function(entry, scope) {
						var muniCodi, edoCodi;
						muniCodi = entry.values['direccion.muni'] = entry.values['direccion.muni.muni_codi'];
						edoCodi = entry.values['direccion.edo.edo_codi'];

						util.choiceMunicipio()(entry, scope);

						$rootScope.$broadcast('choice:municipios:get', {
							value: edoCodi
						}, edoCodi);

						return [];
					}),

					nga.field('direccion.parroq', 'choice')
					.label('parroq_nomb')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selParroq($item, $model)'
					})
					.choices(function(entry, scope) {
						var parroqCodi, muniCodi;

						parroqCodi = entry.values['direccion.parroq'] = entry.values['direccion.parroq.parroq_codi'];
						muniCodi = entry.values['direccion.muni.muni_codi'];

						util.choiceParroquia()(entry, scope);

						$rootScope.$broadcast('choice:parroquias:get', {
							value: muniCodi
						}, muniCodi);

						return [];
					}),

					nga.field('direccion.zona', 'choice')
					.label('zona_nomb')
					.validation({
						required: true
					})
					.choices(function(entry, scope) {
						var zonaId, parroqCodi;
						zonaId = entry.values['direccion.zona'] = entry.values['direccion.zona.zona_id'];
						parroqCodi = entry.values['direccion.parroq.parroq_codi'];

						util.choiceZona()(entry, scope);

						$rootScope.$broadcast('choice:zonas:get', {
							value: parroqCodi
						}, parroqCodi);

						return [];
					}),

					nga.field('direccion.av_calle')
					.label('av_calle')
					.validation({
						required: true,
						minlength: 2,
						maxlength: 50
					}),

					nga.field('direccion.pto_ref')
					.label('pto_ref')
					.validation({
						required: true,
						minlength: 4,
						maxlength: 100
					}),

					nga.field('prop', 'choices')
					.label('_')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Introduzca cédula de propietario.',
						'on-select': 'selProp($item, $model, $select)',
						'on-remove': 'removeProp($item, $model, $select)',
						'ng-init': 'initProp($select)'
					})
					.choices(function(entry, scope) {

						util.choiceProp()(entry, scope);

						$rootScope.$broadcast('choice:prop:get');

						return [];
					}),

					nga.field('repres', 'choices')
					.label('_')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Introduzca cédula de representante.',
						'on-select': 'selRepres($item, $model, $select)',
						'on-remove': 'removeRepres($item, $model, $select)',
						'ng-init': 'initRepres($select)'
					})
					.choices(function(entry, scope) {

						scope.$parent.$parent.representantes = [];

						util.choiceRepres()(entry, scope);

						$rootScope.$broadcast('choice:repres:get');

						return [];
					}),
					nga.field('tipo', 'choices')
					.label('Tipo')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione.'
					})
					.choices(function(entry, scope) {

						util.choiceTipoMercantil()(entry, scope);

						$rootScope.$broadcast('choice:tipomercantils:get');

						return [];
					}),
				])
				.template(mercantilEditView)
			;


			mercantil.showView()
				.title('Detalle entidad #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('rif').label('RIF'),
					nga.field('razon_social').label('Razon Social'),
				])
				.template(mercantilShowView)
			;

			return mercantil;
		}]);
	}
	MercantilAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return MercantilAdmin;
});