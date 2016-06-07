import editFieldTemplate from '../../view/VehiculoTransporte/editField.html';
import showTemplate from '../../view/VehiculoTransporte/show.html';

define(function() {
	'use strict';

	function VehiculoTransporteAdmin($provide, NgAdminConfigurationProvider) {
		$provide.factory('VehiculoTransporteAdmin', ['$rootScope', 'RestWrapper', 'UtilityService', function($rootScope, RestWrapper, UtilityService) {
			var nga = NgAdminConfigurationProvider;

			var util = UtilityService;

			var vehiculotransporte = nga.entity('vehiculotransportes')
				.identifier(nga.field('id'))
				.label('Transporte');

			vehiculotransporte.listView()
				.title('Lista de Transporte')
				.infinitePagination(false)
				.fields([
					nga.field('id').label('ID'),
					nga.field('vehiculo.placa_marca_modelo_anio_color').label('Vehículo'),
					nga.field('conductor.nac_cedu_nomb_apell').label('Conductor'),
					nga.field('comerciante.codi').label('Codigo de guía'),
					nga.field('comerciante.mercantil.razon_social').label('Comerciante'),
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

var comercianteFieldTemplate = `<table class="table table-bordered">
    <tbody>
        <tr class="info">
            <th colspan="5" class="text-center">GUÍA DE TRASLADO</th>
        </tr>
        <tr class="info">
            <th colspan="3">FECHA DE VIAJE</th>
            <th colspan="2">CÓDIGO DE GUÍA</th>
        </tr>
        <tr>
            <td colspan="3"> {{entry.values['comerciante.fechsali'] | amDateFormat:'LL'}}</td>
            <td colspan="2"> {{ entry.values['comerciante.codi'] }}</td>
        </tr>

        <tr class="info">
            <th colspan="5">COMERCIANTE</th>
        </tr>
        <tr>
            <th>RIF</th>
            <th colspan="4">RAZON SOCIAL</th>
        </tr>
        <tr>
            <td> {{ entry.values['comerciante.mercantil.fix_rif'] }}</td>
            <td colspan="4">{{ entry.values['comerciante.mercantil.razon_social'] }}</td>
        </tr>
    </tbody>
</table>`;
			vehiculotransporte.editionView()
				.title('Actualizar vehículo #{{ ::entry.identifierValue }}')
				.fields([
					nga.field('com', 'template')
					.label('Comerciante')
					.template(comercianteFieldTemplate),

					nga.field('vehiculo', 'choice')
					.label('Vehículo')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione vehículo.'
					})
					.choices(function(entry, scope) {

						entry.values['comerciante'] = entry.values['comerciante.id'];

						util.choiceVehiculo()(entry, scope);

						$rootScope.$broadcast('choice:vehiculos:get');

						return [];
					}),

					nga.field('conductor', 'choice')
					.label('Conductor')
					.validation({
						required: true
					})
					.attributes({
						'placeholder': 'Seleccione conductor.'
					})
					.choices(function(entry, scope) {

						util.choiceConductor()(entry, scope);

						$rootScope.$broadcast('choice:conductors:get');

						return [];
					}),
					nga.field('transp', 'template')
					.label('Transporte')
					.template(editFieldTemplate)
				]);

			vehiculotransporte.showView()
				.title('Detalle vehículo #{{ ::entry.identifierValue }}')
				.fields([
					vehiculotransporte.listView().fields()
				])
				.template(showTemplate);

			return vehiculotransporte;
		}]);
	}
	VehiculoTransporteAdmin.$inject = ['$provide', 'NgAdminConfigurationProvider'];

	return VehiculoTransporteAdmin;
});