/*global define*/
define(function() {
	'use strict';

	var baseApiUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/api/';

	var customHeaderTemplate = require('../view/layoutNavbar.html');
	var customLayoutTemplate = require('../view/layout.html');

	var customListViewTemplate = require('../../Crud/list/listLayout.html');
	var customDeleteViewTemplate = require('../../Crud/delete/delete.html');
	var customBatchDeleteTemplate = require('../../Crud/delete/batchDelete.html');
	var customEditViewTemplate = require('../../Crud/form/edit.html');
	var customShowViewTemplate = require('../../Crud/show/show.html');
	var customCreateViewTemplate = require('../../Crud/form/create.html');

	var customDashboardTemplate = require('../view/dashboard.html');

	function ConfigAdmin(
		NgAdminConfigurationProvider,
		appConfig,

		UserAdminProvider,
		AjusteAdminProvider,
		AjusteReporteAdminProvider,

		PaisAdminProvider,
		EstadoAdminProvider,
		MunicipioAdminProvider,
		ParroquiaAdminProvider,
		ZonaAdminProvider,

		MagnitudAdminProvider,
		MedidaAdminProvider,

		PersonaAdminProvider,
		MercantilAdminProvider,
		TipoMercantilAdminProvider,
		GuiacomercianteAdminProvider,
		VehiculoTransporteAdminProvider,

		ProductoAdminProvider,
		MarcaProductoAdminProvider,
		RubroProductoAdminProvider,

		VehiculoMarcaAdminProvider,
		VehiculoModeloAdminProvider,
		VehiculoAdminProvider) {

		var nga = NgAdminConfigurationProvider;

		var admin = NgAdminConfigurationProvider
			.application(appConfig.webapp_title)
			.baseApiUrl(baseApiUrl);

		admin
			.addEntity(UserAdminProvider.$get())
			.addEntity(AjusteAdminProvider.$get())
			.addEntity(AjusteReporteAdminProvider.$get())

			.addEntity(PaisAdminProvider.$get())
			.addEntity(EstadoAdminProvider.$get())
			.addEntity(MunicipioAdminProvider.$get())
			.addEntity(ParroquiaAdminProvider.$get())
			.addEntity(ZonaAdminProvider.$get())

			.addEntity(MagnitudAdminProvider.$get())
			.addEntity(MedidaAdminProvider.$get())

			.addEntity(PersonaAdminProvider.$get())
			.addEntity(MercantilAdminProvider.$get())
			.addEntity(TipoMercantilAdminProvider.$get())
			.addEntity(GuiacomercianteAdminProvider.$get())
			.addEntity(VehiculoTransporteAdminProvider.$get())

			.addEntity(ProductoAdminProvider.$get())
			.addEntity(MarcaProductoAdminProvider.$get())
			.addEntity(RubroProductoAdminProvider.$get())

			.addEntity(VehiculoMarcaAdminProvider.$get())
			.addEntity(VehiculoModeloAdminProvider.$get())
			.addEntity(VehiculoAdminProvider.$get())
		;

		admin.menu(nga.menu()
			.addChild(nga.menu().title('Escritorio').icon('<span class="fa fa-dashboard"> </span>').link('/dashboard'))
			.addChild(nga.menu().title('Usuario').icon('<span class="fa fa-user"> </span>')
				.addChild(nga.menu().title('Perfil').icon('<span class="fa fa-user"> </span>').link('/profile/show'))
				.addChild(nga.menu().title('Cuenta').icon('<span class="fa fa-user"> </span>').link('/profile/edit'))
				.addChild(nga.menu().title('Contraseña').icon('<span class="fa fa-lock"> </span>').link('/profile/change-password'))
			)
			.addChild(nga.menu().title('Configuración').icon('<span class="fa fa-gears"> </span>')
				.addChild(nga.menu(AjusteAdminProvider.$get()).icon('<span class="fa fa-gears"> </span>'))
				.addChild(nga.menu(AjusteReporteAdminProvider.$get()))
				.addChild(nga.menu(UserAdminProvider.$get()).icon('<span class="fa fa-users"> </span>'))

				.addChild(nga.menu(PaisAdminProvider.$get()))
				.addChild(nga.menu(EstadoAdminProvider.$get()))
				.addChild(nga.menu(MunicipioAdminProvider.$get()))
				.addChild(nga.menu(ParroquiaAdminProvider.$get()))
				.addChild(nga.menu(ZonaAdminProvider.$get()))

				.addChild(nga.menu(MagnitudAdminProvider.$get()))
				.addChild(nga.menu(MedidaAdminProvider.$get()))
			)
			.addChild(nga.menu().title('Control Importación').icon('<span class="fa fa-key"> </span>')
				.addChild(nga.menu(PersonaAdminProvider.$get()))
				.addChild(nga.menu(TipoMercantilAdminProvider.$get()).title('Tipo Entidades'))
				.addChild(nga.menu(MercantilAdminProvider.$get()).title('Entidades'))
				.addChild(nga.menu(GuiacomercianteAdminProvider.$get()).title('Guía de traslado'))
				.addChild(nga.menu(VehiculoTransporteAdminProvider.$get()).title('Transporte'))
				.addChild(nga.menu().title('Reportes').icon('<span class="fa fa-user"> </span>').link('/controlimportacion/reportes'))
			)
			.addChild(nga.menu().title('Control Importación Producto').icon('<span class="fa fa-key"> </span>')
				.addChild(nga.menu(ProductoAdminProvider.$get()).title('Productos'))
				.addChild(nga.menu(MarcaProductoAdminProvider.$get()).title('Marcas de Productos'))
				.addChild(nga.menu(RubroProductoAdminProvider.$get()).title('Rubros de Productos'))
			)
			.addChild(nga.menu().title('Control Importación Transporte').icon('<span class="fa fa-key"> </span>')
				.addChild(nga.menu(VehiculoAdminProvider.$get()).title('Vehículos'))
				.addChild(nga.menu(VehiculoMarcaAdminProvider.$get()).title('Marca de Vehículo'))
				.addChild(nga.menu(VehiculoModeloAdminProvider.$get()).title('Modelo de Marca de Vehículo'))
			)
		);

		var customTemplate = {
			'DeleteView': customDeleteViewTemplate,
			'EditView': customEditViewTemplate,
			'ListView': customListViewTemplate,
			'ShowView': customShowViewTemplate,
			'CreateView': customCreateViewTemplate,
			'BatchDeleteView': customBatchDeleteTemplate
		};

		admin.customTemplate(function(viewName) {
			if (customTemplate[viewName]) {
				return customTemplate[viewName];
			}
		});

		admin.header(customHeaderTemplate);

		/*admin.dashboard(nga.dashboard()
	    	.addCollection(nga.collection(UserAdminProvider.$get()).title('Usuarios'))
	    );*/

		admin.dashboard(nga.dashboard()
			.addCollection(nga.collection(ProductoAdminProvider.$get())
				.fields([
					nga.field('id').label('ID'),
					nga.field('nomb').label('Producto'),
					nga.field('marca', 'template')
					.label('Marca')
					.template('<span ng-repeat="item in entry.values.marca track by $index" class="label label-default">{{ item.marca.nomb }}</span>')
				])
			)
			.addCollection(nga.collection(PersonaAdminProvider.$get())
				.fields([
					nga.field('nac_cedu').label('Documento de identidad'),
					nga.field('nomb_apell').label('Nombre y Apellido'),
					nga.field('telf').label('Teléfono')

				])
			)
			.template(customDashboardTemplate)
		);

		NgAdminConfigurationProvider.configure(admin);
	}

	ConfigAdmin.$inject = [
		'NgAdminConfigurationProvider',
		'appConfig',
		'UserAdminProvider',
		'AjusteAdminProvider',
		'AjusteReporteAdminProvider',

		'PaisAdminProvider',
		'EstadoAdminProvider',
		'MunicipioAdminProvider',
		'ParroquiaAdminProvider',
		'ZonaAdminProvider',

		'MagnitudAdminProvider',
		'MedidaAdminProvider',

		'PersonaAdminProvider',
		'MercantilAdminProvider',
		'TipoMercantilAdminProvider',
		'GuiacomercianteAdminProvider',
		'VehiculoTransporteAdminProvider',

		'ProductoAdminProvider',
		'MarcaProductoAdminProvider',
		'RubroProductoAdminProvider',

		'VehiculoMarcaAdminProvider',
		'VehiculoModeloAdminProvider',
		'VehiculoAdminProvider',
	];

	return ConfigAdmin;
});