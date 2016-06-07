export default class ReportesControlImportacionController {
	constructor($scope, progression, notification, UtilityService, $document, $sce, RestWrapper, $filter) {
		this.$scope = $scope;
		this.progression = progression;
		this.notification = notification;
		this.util = UtilityService;
		this.$document = $document[0];
		this.$sce = $sce;
		this.rest = RestWrapper;
		this.$filter = $filter;

		this.$scope.option = {
			loading: false,
			loadingIFrame: false
		};

		this.$scope.selectDocumento = null;
		this.$scope.iframeReport = null;
		this.$scope.model = {};
		this.$scope.param = {module: 'controlimportacion'};
		this.$scope.reportes = {simple: [], between: []};

		let formats = [{
			label: 'PDF',
			value: 'pdf',
			group: 'view',
			groupName: 'Mostrar'
		}, {
			label: 'HTML',
			value: 'html',
			group: 'view',
			groupName: 'Mostrar'
		}, {
			label: 'EXEL',
			value: 'xlsx',
			group: 'download',
			groupName: 'Descargar'
		}, {
			label: 'DOCUMENTO POWER POINT',
			value: 'pptx',
			group: 'download',
			groupName: 'Descargar'

		}, {
			label: 'DOCUMENTO WORD',
			value: 'docx',
			group: 'download',
			groupName: 'Descargar'
		}, {
			label: 'CSV',
			value: 'csv',
			group: 'download',
			groupName: 'Descargar'
		}];

		this.$scope.formats = {
			simple: formats,
			between: formats
		};

		this.initOption();
		this.initIframe();

		this.$scope.comerciantes = [];
		this.$scope.productos = [];
		this.$scope.rubroproductos = [];

		this.$scope.delChoices = this.util.choiceDel()();
		this.$scope.monthsChoices = this.util.choiceMonth()();
		this.$scope.yearsChoices = this.util.choiceYear()();

		this.$scope.alls = [{
			label: 'Todo',
			value: 'all'
		}];

		this.$scope.model.dateFormat = $scope.delChoices[0];
		this.$scope.model.dateFormatMonth = $scope.monthsChoices[0];
		this.$scope.model.dateFormatYear = $scope.yearsChoices[$scope.yearsChoices.length-1];

		this.$scope.selOpcion = this.selOption.bind(this);
		this.$scope.selFormat = this.selFormat.bind(this);

		this.$scope.submitQuery = this.submitQuery.bind(this);
		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	initOption() {
		this.$scope.opciones = [{
			label: 'FORMULARIO DE REPORTES DINAMICOS CONFIGURABLES DESDE BASE DE DATOS',
			value: 'a'
		}, {
			label: 'FORMULARIO DE REPORTES BASADOS EN RANGOS DE FECHA Y FILTROS POR EMPRESA',
			value: 'b'
		}];
		this.$scope.option.a = false;
		this.$scope.option.b = false;
	}

	selOption($item, $model) {

		this.$scope.model.report = '';
		this.$scope.submitBtnName = 'Generar';
		this.$scope.model.format = '';

		switch (this.$scope.model.option) {
			case 'a':
				if (!this.$scope.option.a) {
					this.getOpcionDocumento({'module': 'controlimportacion', 'group': 'simple'});

					this.$scope.option.a = true;
				}
				break;

			case 'b':
				if (!this.$scope.option.b) {
					this.getOpcionDocumento({'module': 'controlimportacion', 'group': 'between'});
					this.getProductos();
					this.getRubros();
					this.getComerciantes();

					this.$scope.option.b = true;
				}
				let del = angular.element(this.$document.querySelector('#del'));
				let month = angular.element(this.$document.querySelector('#month'));
				let between = angular.element(this.$document.querySelector('#between'));

				this.$scope.$watch('model.optionDate', function(checked) {
					if (checked === 'del') {
						del.removeAttr('disabled');
						month.attr('disabled', 'true');
						between.attr('disabled', 'true');
					} else if (checked === 'between') {
						between.removeAttr('disabled');
						del.attr('disabled', 'true');
						month.attr('disabled', 'true');
					} else if (checked === 'month') {
						month.removeAttr('disabled');
						del.attr('disabled', 'true');
						between.attr('disabled', 'true');
					}
				});

				let all = angular.element(this.$document.querySelector('#all'));
				let prod = angular.element(this.$document.querySelector('#prod'));
				let rubro = angular.element(this.$document.querySelector('#rubro'));

				this.$scope.$watch('model.optionGral', function(checked) {
					if (checked === 'all') {
						all.removeAttr('disabled');
						prod.attr('disabled', 'true');
						rubro.attr('disabled', 'true');
					} else if (checked === 'prod') {
						prod.removeAttr('disabled');
						all.attr('disabled', 'true');
						rubro.attr('disabled', 'true');
					} else if (checked === 'rubro') {
						rubro.removeAttr('disabled');
						all.attr('disabled', 'true');
						prod.attr('disabled', 'true');

					}
				});

				this.$scope.model.optionGral = 'all';
				this.$scope.model.optionDate = 'del';
				break;
			default:
				break;
		}

		this.displayView();
	}

	getOpcionDocumento($filters) {
		this.util
			.apiAjusteReporte({}, null, null, $filters)
				.then((response) => {
					this.$scope.reportes[$filters.group] = this.util.dataPrepare(response.data.originalElement, [{
							label: 'value'
						}, {
							value: 'key'
						}, {
							action: 'action'
						}, {
							module: 'module'
						}, {
							key: 'key'
						}, {
							api: 'api'
						}]);
				});
	}

	getProductos() {
		this.util
			.apiProducto()
				.then((response) => {
					this.$scope.productos = this.util.dataPrepare(response.data.originalElement, [{
						label: 'nomb'
					}, {
						value: 'id'
					}]);
				});
	}

	getRubros() {
		this.util
			.apiRubroProducto()
				.then((response) => {
					this.$scope.rubroproductos = this.util.dataPrepare(response.data.originalElement, [{
						label: 'nomb'
					}, {
						value: 'id'
					}]);
				});
	}

	getComerciantes() {
		this.util
			.apiComerciante()
				.then((response) => {
					this.$scope.comerciantes = this.util.dataPrepare(response.data.originalElement, [{
						label: 'rif_razon_social'
					}, {
						value: 'id'
					}]);
				});
	}

	selFormat($item) {
		this.$scope.submitBtnName = $item.groupName;
	}

	submitQuery($event, model) {
		$event.preventDefault();
		$event.stopPropagation();

		if (!this.$scope.selectDocumento || !this.$scope.selectFormat) {
			return;
		}

		if(!this.$scope.selectDocumento.selected || !this.$scope.selectFormat.selected) {
			return;
		}

		var queryString = '',
			dataDate = {},
			dataGral = {};

		switch (model.optionDate) {
			case 'between':
				dataDate = {
					optionDate: 'between',
					dataDate: {
						dateFrom: this.$filter('date')(model.from),
						dateTo: this.$filter('date')(model.to)
					}
				};
				break;
			case 'del':
				dataDate = {
					optionDate: 'del',
					dataDate: {
						dateFormat: model.dateFormat.value
					}
				};
				break;
			case 'month':
				dataDate = {
					optionDate: 'del',
					dataDate: {
						dateFormat: model.dateFormatMonth.value,
						year: model.dateFormatYear.value
					}
				};
				break;
			default:
				break;
		}

		switch (model.optionGral) {
			case 'all':
				dataGral = {
					optionGral: 'all',
					dataGral: {
						all: 'all'
					}
				};
				break;
			case 'prod':
				if (angular.isUndefined(model.prod)) {
					this.notification.log('Filtro por producto invalido.', {
						addnCls: 'humane-flatty-error'
					});
					return;
				}
				dataGral = {
					optionGral: 'prod',
					dataGral: {
						prod: model.prod
					}
				};
				break;
			case 'rubro':
				if (angular.isUndefined(model.rubro)) {
					this.notification.log('Filtro por rubro invalido.', {
						addnCls: 'humane-flatty-error'
					});
					return;
				}


				dataGral = {
					optionGral: 'rubro',
					dataGral: {
						rubro: model.rubro
					}
				};
				break;
			default:
				break;
		}

		let item = this.$scope.selectDocumento.selected;
		let format = this.$scope.selectFormat.selected;

		var  param = {
			action: item.action,
			report: item.key,
			param: {},
			format: format.value || 'pdf',
			view: format.group
		};

		if (model.ids) {
			param.ids = model.ids;
		}

		var data = angular.extend(dataDate, dataGral);
			data = angular.extend(data, param);

		queryString = this.util.toQueryString(data);

		var apiName = (item.api)? item.api : null;
		this.request(data, queryString, apiName);
	}

	request(data, queryString, apiName) {
		this.progression.start();

		var api = (apiName)? '/api/reportes/'+ apiName : '/api/reportes';

		this.$scope.option = {
			loading: true,
			loadingIFrame: false
		};

		this.displayView();
		if (data.view === 'view') {
			this.rest
				.getOne('reportes', api + '?' + queryString)
				.then((data) => {
					var url = data.originalElement.url + '&v=' + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
					this.$scope.reportURL = this.$sce.trustAsResourceUrl(url);
					this.$scope.option = {
						loading: false,
						loadingIFrame: true
					};
					this.progression.done();
				}, () => {
					this.progression.done();
				});
		} else if (data.view === 'download') {
			this.rest
				.getOne('reportes', api + '?' + queryString)
				.then((data) => {
					var url = data.originalElement.url + '&v=' + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
					this.$scope.reportURL = this.$sce.trustAsResourceUrl(url);
					this.$scope.option = {
						loading: false,
						loadingIFrame: false
					};
					this.progression.done();
				}, () => {
					this.progression.done();
				});
		}



	}

	initIframe() {
		this.reportView = angular.element(this.$document.querySelector('#show-view-reports'));
		if(this.reportView.length) {
			this.reportView.bind('load', () =>{
				this.reportView.css({ 'height': '1000px', 'display': 'block'});
				this.reportView.next().css('display', 'none');
			});
			this.reportView.css('display', 'none');
			this.reportView.next().css('display', 'block');
		}
	}

	displayView(view) {
		if (view) {
			this.reportView.css('display', 'block');
		} else {
			this.reportView.css('display', 'none');
		}
	}

	destroy() {
		this.$scope = undefined;
		this.progression = undefined;
		this.notification = undefined;
		this.UtilityService = undefined;
		this.$document = undefined;
	}
}

ReportesControlImportacionController.$inject = ['$scope', 'progression', 'notification', 'UtilityService', '$document', '$sce', 'RestWrapper', '$filter'];