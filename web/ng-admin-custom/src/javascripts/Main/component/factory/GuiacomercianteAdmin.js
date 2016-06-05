
import guiacomercianteCreateView from '../../view/guiacomercianteCreateView.html';
import guiacomercianteShowView from '../../view/guiacomercianteShowView.html';

define(function() {
	'use strict';

	function GuiacomercianteAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('GuiacomercianteAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var guiacomerciante = nga.entity('guiacomerciantes')
				.identifier(nga.field('id'))
				.label('Guía de Traslado');


			var pdf = `<a class="btn btn-default btn-xs" ng-click="open($event, entry.values['id'])" ng-init="uriAction='guia'" ng-controller="HandleReportController" href="#" title="Guía de traslado.">
				<span class="fa fa-file-pdf-o"></span>
				<span class="hidden-xs"></span>
			</a>`;

			guiacomerciante.listView()
				.infinitePagination(false)
				.title('Lista guía de traslado')
				.fields([
					nga.field('id').label('ID'),
					nga.field('codi').label('Código'),
					nga.field('mercantil.razon_social').label('Razon Social'),
					nga.field('mercantil.prop', 'template')
						.label('Propietarios')
						.template('<ul><li style="margin-bottom: 5px;" ng-repeat="item in entry.values[\'mercantil.prop\'] track by $index"><span>{{ item.persona.nomb_apell }}</span></li></ul>'),

					nga.field('fechsali','date').label('Fecha salida')
					.format('dd-MM-yyyy'),
					nga.field('fechcreado','date').label('Fecha registro')
					.format('dd-MM-yyyy'),
					nga.field('fechmodi','date').label('Fecha modificado')
					.format('dd-MM-yyyy'),
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
				.listActions([pdf,'edit', 'delete', 'show']);

			guiacomerciante.creationView()
				.title('Nueva guía de traslado')
				.fields([
					nga.field('mercantil', 'choice')
					.label('Razon Social')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selCom($item, $model, $select)',
						'placeholder': 'Seleccione comerciante.'
					})
					.choices(function(entry, scope) {

						scope.selCom = selCom;

						util.choiceMercantilComercio({
							label: 'razon_social_rif',
							value: 'id',
							rif: 'fix_rif',
							estb: 'razon_social',
						})(entry, scope);

						$rootScope.$broadcast('choice:mercantilcomercios:get');

						return [];

						function selCom($item, $model, $select) {
							$rootScope.$broadcast('grid:render', [$item], $select);
						}
					}),
					nga.field('fechsali', 'date').label('Fecha de viaje')
					.format('dd-MM-yyyy')
					.attributes({
						'placeholder': 'Ingrese o seleccione fecha de viaje. (dd-mm-yyyy)'
					})
					.validation({
						required: true
					}),
				])
				.template(guiacomercianteCreateView);

			guiacomerciante.editionView()
				.title('Actualizar guía de traslado #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('mercantil', 'choice')
					.label('Razon Social')
					.validation({
						required: true
					})
					.attributes({
						'on-select': 'selCom($item, $model, $select)',
						'placeholder': 'Seleccione comerciante.'
					})
					.choices(function(entry, scope) {

						entry.values['mercantil'] = entry.values['mercantil.id'];
						/*scope.selCom = selCom;*/

						util.choiceMercantilComercio({
							label: 'razon_social_rif',
							value: 'id',
							rif: 'fix_rif',
							estb: 'razon_social',
						})(entry, scope);

						$rootScope.$broadcast('choice:mercantilcomercios:get');

						return [];

						/*function selCom($item, $model, $select) {
							$rootScope.$broadcast('grid:render', [$item], $select);
						}*/
					}),
					nga.field('fechsali', 'date').label('Fecha de viaje')
					.format('dd-MM-yyyy')
					.attributes({
						'placeholder': 'Ingrese o seleccione fecha de viaje. (dd-mm-yyyy)'
					})
					.validation({
						required: true
					}),
				]);

			guiacomerciante.showView()
				.title('Detalle guía de traslado #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('id').label('ID'),
					nga.field('fech').label('reg_fech'),
				])
				.template(guiacomercianteShowView);


			return guiacomerciante;
		}]);
	}
	GuiacomercianteAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return GuiacomercianteAdmin;
});