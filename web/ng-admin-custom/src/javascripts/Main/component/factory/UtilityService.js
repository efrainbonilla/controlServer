define(function() {
	'use strict';

	function UtilityService($rootScope, RestWrapper, moment) {
		return {
			toQueryString: function(obj, prefix) {
				var qs = function(obj, prefix) {
					var str = [];
					for (var p in obj) {
						var k = prefix ? prefix + "[" + p + "]" : p,
							v = obj[p];
						str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
					}
					return str.join("&");
				};

				return qs(obj, prefix);
			},
			trim: function(value) {
				if (!angular.isString(value)) {
					return value;
				}

				if (!String.prototype.trim) {
					return value.replace(/^\s*/, '').replace(/\s*$/, '');
				}

				return String.prototype.trim.apply(value);
			},
			isEmpty: function(value) {
				return angular.isUndefined(value) || value === '' || value === null || value !== value;
			},

			dataPrepare: function(data, dataIndex) {
				var _data = data || [];
				var _dataIndex = dataIndex || [{
					value: ''
				}, {
					label: ''
				}];
				var _resp = [];
				if (angular.isArray(_data) || angular.isObject(_data)) {
					angular.forEach(_data, function(value, key) {
						if (angular.isArray(_dataIndex)) {
							_resp[key] = {};
							angular.forEach(_dataIndex, function(_value) {
								if (angular.isObject(_value)) {
									angular.forEach(_value, function(v, k) {
										if (_data[key][v]) {
											_resp[key][k] = _data[key][v];
										} else {
											var join = v.split('.');
											if (join.length > 1) {
												var __data = null;
												angular.forEach(join, function(val, clv) {
													if (__data) {
														if (angular.isObject(__data) && __data[val]) {
															__data = __data[val];
														}
													} else {
														__data = _data[key][val];
													}
												});
												if (__data) {
													_resp[key][k] = __data;
												}
											}
										}
									});
								}
							});
						}
					});
				}
				return _resp;
			},
			dataPrepareOperators: function(data, dataIndex) {
				var _data = data || [];
				var _dataIndex = dataIndex || [{
					value: ''
				}, {
					label: ''
				}];
				var _resp = [];
				var count = 0;
				if (angular.isArray(_data) || angular.isObject(_data)) {
					angular.forEach(_data, function(value, key) {
						angular.forEach(value, function(oval, okey) {
							count++;
							if (angular.isArray(_dataIndex)) {
								_resp[count] = {};
								angular.forEach(_dataIndex, function(_value) {
									if (angular.isObject(_value)) {
										angular.forEach(_value, function(v, k) {
											_resp[count][k] = okey;
										});
									}
								});
							}
						})
					});
				}
				return _resp;
			},

			filterOperators: function() {
				var util = this;
				return function(entry, scope) {
					var operators = [];

					var dOperators = $rootScope.$on('filters:operators:get', getOperators);

					$rootScope.$broadcast('filters:operators:get');

					scope.$on('$destroy', destroyEvent);

					return operators;

					function getOperators(e) {
						RestWrapper.getList({}, 'filters', '/api/filters/operators')
							.then(function(response) {
								operators = util.dataPrepareOperators(response.data.originalElement);
								scope.$broadcast('choices:update', {
									choices: operators
								});
							});
					}

					function destroyEvent() {
						dOperators();
					}
				}
			},

			filterLimit: function() {
				return function(entry, scope) {
					return [{
						label: '10',
						value: '10'
					}, {
						label: '25',
						value: '25'
					}, {
						label: '50',
						value: '50'
					}, {
						label: '100',
						value: '100'
					}, {
						label: '200',
						value: '200'
					}];
				};
			},

			choiceRifFix: function () {
				return function(entry, scope) {
					return [{
						label: 'V',
						value: 'V'
					}, {
						label: 'J',
						value: 'J'
					}, {
						label: 'G',
						value: 'G'
					}];
				};
			},

			choiceNac: function() {
				return function(entry, scope) {
					return [{
						label: 'V',
						value: 'V'
					}, {
						label: 'E',
						value: 'E'
					}, {
						label: 'P',
						value: 'P'
					}];
				};
			},

			choiceDel: function() {
				return function(entry, scope) {
					return [{
						label: 'Dia',
						value: 'day'
					}, {
						label: 'Dia Anterior',
						value: 'dayBefore'
					}, {
						label: 'Semana',
						value: 'week'
					}, {
						label: 'Semana Anterior',
						value: 'weekBefore'
					}, {
						label: 'Mes',
						value: 'month'
					}, {
						label: 'Mes Anterior',
						value: 'monthBefore'
					}];
				};
			},

			choiceMonth: function() {
				return function(entry, scope) {
					var nowEn = moment().locale('en'),
						nowEs = moment().locale('es'),
						esLocaleData = nowEs.localeData(),
						enLocaleData = nowEn.localeData();

					var months = [];
					angular.forEach(esLocaleData._months, function(value, key) {
						months.push({
							label: esLocaleData._months[key],
							value: enLocaleData._months[key]
						});
					});

					return months;
				};
			},

			choiceYear: function() {
				return function(rStart, sEnd) {
					var now = moment(),
						range = [],
						rangeStart = rStart || 2015,
						rangeEnd = sEnd || now.get('years');

					for (var i = rangeStart; i <= rangeEnd; i++) {
						range.push(i);
					}

					if (range.length === 0 || rangeEnd < rangeStart) {
						range.push(rangeStart);
					}

					var years = [];
					angular.forEach(range, function(value, key) {
						years.push({
							label: value,
							value: value
						});
					});

					return years;
				};
			},

			choicePais: function() {
				var util = this;
				return function(entry, scope) {
					var pais = [];

					var dPais = $rootScope.$on('choice:pais:get', getPais);

					scope.selPais = selPais;

					scope.$on('$destroy', destroyEvent);

					return pais;

					function getPais(e, $item, $model) {
						util.apiPais($item, $model).then(function(response) {
							pais = util.dataPrepare(response.data.originalElement, [{
								label: 'pais_nomb'
							}, {
								value: 'pais_id'
							}]);
							scope.$broadcast('choices:update', {
								choices: pais
							});
						});
					}

					function selPais($item, $model) {
						$rootScope.$broadcast('choice:estados:get', $item, $model);
						/*
						$rootScope.$broadcast('choice:estados:reset');
						$rootScope.$broadcast('choice:municipios:reset');
						$rootScope.$broadcast('choice:parroquias:reset');
						$rootScope.$broadcast('choice:zonas:reset');*/
					}

					function destroyEvent() {
						dPais();
					}
				};
			},
			choiceEstado: function() {
				var util = this;
				return function(entry, scope) {

					var estados = [];

					var dEstados = $rootScope.$on('choice:estados:get', getEstados);
					var dresetEstados = $rootScope.$on('choice:estados:reset', resetEstados);

					scope.selEdo = selEdo;

					scope.$on('$destroy', destroyEvent);

					return estados;

					function getEstados(e, $item, $model) {
						util.apiEstado($item, $model).then(function(response) {
							estados = util.dataPrepare(response.data.originalElement, [{
								label: 'edo_nomb'
							}, {
								value: 'edo_codi'
							}]);

							scope.$broadcast('choices:update', {
								choices: estados
							});
						});
					}

					function resetEstados() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function selEdo($item, $model) {
						$rootScope.$broadcast('choice:municipios:get', $item, $model);

						/*$rootScope.$broadcast('choice:municipios:reset');
						$rootScope.$broadcast('choice:parroquias:reset');
						$rootScope.$broadcast('choice:zonas:reset');*/
					}

					function destroyEvent() {
						dEstados();
						dresetEstados();
					}
				};
			},
			choiceMunicipio: function() {
				var util = this;
				return function(entry, scope) {
					var municipios = [];

					var dgetMunicipios = $rootScope.$on('choice:municipios:get', getMunicipios);

					var dresetMunicipios = $rootScope.$on('choice:municipios:reset', resetMunicipios);

					scope.selMuni = selMuni;

					scope.$on('$destroy', destroyEvent);

					return municipios;

					function getMunicipios(e, $item, $model) {
						util.apiMunicipio($item, $model).then(function(response) {
							municipios = util.dataPrepare(response.data.originalElement, [{
								label: 'muni_nomb'
							}, {
								value: 'muni_codi'
							}]);
							scope.$broadcast('choices:update', {
								choices: municipios
							});
						});
					}

					function resetMunicipios() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function selMuni($item, $model) {
						$rootScope.$broadcast('choice:parroquias:get', $item, $model);
						/*$rootScope.$broadcast('choice:parroquias:reset');
						$rootScope.$broadcast('choice:zonas:reset');*/
					}

					function destroyEvent() {
						dgetMunicipios();
						dresetMunicipios();
					}
				};
			},
			choiceParroquia: function() {
				var util = this;
				return function(entry, scope) {
					var parroquias = [];

					var dgetParroquias = $rootScope.$on('choice:parroquias:get', getParroquias);

					var dresetParroquias = $rootScope.$on('choice:parroquias:reset', resetParroquias);

					scope.selParroq = selParroq;

					scope.$on('$destroy', destroyEvent);

					return parroquias;

					function getParroquias(e, $item, $model) {
						util.apiParroquia($item, $model).then(function(response) {
							parroquias = util.dataPrepare(response.data.originalElement, [{
								label: 'parroq_nomb'
							}, {
								value: 'parroq_codi'
							}]);
							scope.$broadcast('choices:update', {
								choices: parroquias
							});
						});
					}

					function resetParroquias() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function selParroq($item, $model) {
						$rootScope.$broadcast('choice:zonas:get', $item, $model);
					}

					function destroyEvent() {
						dgetParroquias();
						dresetParroquias();
					}
				};
			},
			choiceZona: function() {
				var util = this;
				return function(entry, scope) {

					var zonas = [];

					var dgetZonas = $rootScope.$on('choice:zonas:get', getZonas);

					var dresetZonas = $rootScope.$on('choice:zonas:reset', resetZonas);

					scope.$on('$destroy', destroyEvent);

					return zonas;

					function getZonas(e, $item, $model) {
						util.apiZona($item, $model).then(function(response) {
							zonas = util.dataPrepare(response.data.originalElement, [{
								label: 'zona_nomb'
							}, {
								value: 'zona_id'
							}]);
							scope.$broadcast('choices:update', {
								choices: zonas
							});
						});
					}

					function resetZonas() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dgetZonas();
						dresetZonas();
					}
				};
			},

			choiceMercantilComercio: function(obj) {
				var util = this;
				var dataIndex = angular.isObject(obj) ? obj : null;
				return function(entry, scope) {

					var mercantilcomercios = [];

					var dMercantilComercios = $rootScope.$on('choice:mercantilcomercios:get', getMercantilComercios);
					var dresetMercantilComercios = $rootScope.$on('choice:mercantilcomercios:reset', resetMercantilComercios);

					scope.$on('$destroy', destroyEvent);

					return mercantilcomercios;

					function getMercantilComercios(e, $item, $model) {
						util.apiMercantilComercio($item, $model).then(function(response) {
							mercantilcomercios = util.dataPrepare(response.data.originalElement, [dataIndex || {
								label: 'razon_social_rif'
							}, {
								value: 'id'
							}]);

							scope.$broadcast('choices:update', {
								choices: mercantilcomercios
							});
						});
					}

					function resetMercantilComercios() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dMercantilComercios();
						dresetMercantilComercios();
					}
				};
			},

			choiceProp: function() {
				var util = this;
				return function(entry, scope) {

					var propietarios = [];

					var $select;
					var dProp = $rootScope.$on('choice:prop:get', getProp);
					var dresetProp = $rootScope.$on('choice:prop:reset', resetProp);

					scope.initProp = initProp;
					scope.selProp = selProp;
					scope.removeProp = removeProp;

					scope.$on('$destroy', destroyEvent);

					return propietarios;

					function initProp($sel) {
						$select = $sel;
					}

					function getProp(e, $item, $model) {
						if ($select) {
							$select.disabled = true;
						}
						var prop = (entry.values['prop'])? entry.values['prop'] : [];
						entry.values['prop'] = [];
						if ($item && $item.cedu) {
							prop.push($item.id);
						}

						util.apiPersona($item, $model).then((response) => {
							propietarios = util.dataPrepare(response.data.originalElement, util.choicePersonaProperty());

							var items = [];

							for (var index in prop) {
								for (var item in propietarios) {
									if (prop[index] === propietarios[item].value) {
										items.push(propietarios[item]);
										break;
									}
								}
							}

							scope.$broadcast('choices:update', {
								choices: propietarios
							});

							entry.values['prop'] = prop;
							if ($select) {
								$select.disabled = false;
							}
							selected(items);
						});
					}

					function selProp($item, $model, $select) {
						selected($select.selected);
					}

					function removeProp($item, $model, $select) {
						selected($select.selected);
					}

					function selected(items) {
						scope.$parent.$parent.propietarios = items;
					}

					function resetProp() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dProp();
						dresetProp();
					}
				};
			},

			choiceRepres: function() {
				var util = this;
				return function(entry, scope) {

					var representantes = [];

					var $select;
					var dRepres = $rootScope.$on('choice:repres:get', getRepres);
					var dresetRepres = $rootScope.$on('choice:repres:reset', resetRepres);

					scope.initRepres = initRepres;
					scope.selRepres = selRepres;
					scope.removeRepres = removeRepres;

					scope.$on('$destroy', destroyEvent);

					return representantes;

					function initRepres($sel) {
						$select = $sel;
					}

					function getRepres(e, $item, $model) {
						if ($select) {
							$select.disabled = true;
						}
						var repres = (entry.values['repres'])? entry.values['repres'] : [];
						entry.values['repres'] = [];
						if ($item && $item.cedu) {
							repres.push($item.id);
						}

						util.apiPersona($item, $model).then((response) => {
							representantes = util.dataPrepare(response.data.originalElement, util.choicePersonaProperty());

							var items = [];

							for (var index in repres) {
								for (var item in representantes) {
									if (repres[index] === representantes[item].value) {
										items.push(representantes[item]);
										break;
									}
								}
							}

							scope.$broadcast('choices:update', {
								choices: representantes
							});

							entry.values['repres'] = repres;
							if ($select) {
								$select.disabled = false;
							}
							selected(items);
						});
					}

					function selRepres($item, $model, $select) {
						selected($select.selected);
					}

					function removeRepres($item, $model, $select) {
						selected($select.selected);
					}

					function selected(items) {
						scope.$parent.$parent.representantes = items;
					}

					function resetRepres() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dRepres();
						dresetRepres();
					}
				};
			},

			choicePersona: function() {
				var util = this;
				return function(entry, scope) {

					var personas = [];

					var dPersonas = $rootScope.$on('choice:personas:get', getPersonas);
					var dresetPersonas = $rootScope.$on('choice:personas:reset', resetPersonas);

					scope.$on('$destroy', destroyEvent);

					return personas;

					function getPersonas(e, $item, $model) {
						util.apiPersona($item, $model).then((response) => {
							personas = util.dataPrepare(response.data.originalElement, util.choicePersonaProperty());

							scope.$broadcast('choices:update', {
								choices: personas
							});
						});
					}

					function resetPersonas() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dPersonas();
						dresetPersonas();
					}
				};
			},

			choiceMarcaProductos: function() {
				var util = this;
				return function(entry, scope) {

					var marcaproductos = [];
					var marca = entry.values['marca'];
					entry.values['marca'] = [];

					var dMarcaProductos = $rootScope.$on('choice:marcaproductos:get', getMarcaProductos);
					var dresetMarcaProductos = $rootScope.$on('choice:marcaproductos:reset', resetMarcaProductos);

					scope.$on('$destroy', destroyEvent);

					return marcaproductos;

					function getMarcaProductos(e, $item, $model) {
						util.apiMarcaProducto($item, $model).then((response) => {
							marcaproductos = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: marcaproductos
							});

							entry.values['marca'] = marca;
						});
					}

					function resetMarcaProductos() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dMarcaProductos();
						dresetMarcaProductos();
					}
				};
			},

			choiceRubroProductos: function() {
				var util = this;
				return function(entry, scope) {

					var rubroproductos = [];
					var rubro = entry.values['rubro'];
					entry.values['rubro'] = [];

					var dRubroProductos = $rootScope.$on('choice:rubroproductos:get', getRubroProductos);
					var dresetRubroProductos = $rootScope.$on('choice:rubroproductos:reset', resetRubroProductos);

					scope.$on('$destroy', destroyEvent);

					return rubroproductos;

					function getRubroProductos(e, $item, $model) {
						util.apiRubroProducto($item, $model).then((response) => {
							rubroproductos = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: rubroproductos
							});

							entry.values['rubro'] = rubro;
						});
					}

					function resetRubroProductos() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dRubroProductos();
						dresetRubroProductos();
					}
				};
			},

			choiceConductor: function() {
				var util = this;
				return function(entry, scope) {

					var conductors = [];
					var conductor = entry.values['conductor.id'];
					entry.values['conductor'] = '';

					var dConductors = $rootScope.$on('choice:conductors:get', getConductors);
					var dresetConductors = $rootScope.$on('choice:conductors:reset', resetConductors);

					scope.$on('$destroy', destroyEvent);

					return conductors;

					function getConductors(e, $item, $model) {
						util.apiPersona($item, $model).then((response) => {
							conductors = util.dataPrepare(response.data.originalElement, [{
									label: 'nac_cedu_nomb_apell'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: conductors
							});

							entry.values['conductor'] = conductor;
						});
					}

					function resetConductors() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dConductors();
						dresetConductors();
					}
				};
			},

			choiceVehiculo: function() {
				var util = this;
				return function(entry, scope) {

					var vehiculos = [];
					var vehiculo = entry.values['vehiculo.id'];
					entry.values['vehiculo'] = '';

					var dVehiculos = $rootScope.$on('choice:vehiculos:get', getVehiculos);
					var dresetVehiculos = $rootScope.$on('choice:vehiculos:reset', resetVehiculos);

					scope.$on('$destroy', destroyEvent);

					return vehiculos;

					function getVehiculos(e, $item, $model) {
						util.apiVehiculo($item, $model).then((response) => {
							vehiculos = util.dataPrepare(response.data.originalElement, [{
									label: 'placa_marca_modelo_anio_color'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: vehiculos
							});

							entry.values['vehiculo'] = vehiculo;
						});
					}

					function resetVehiculos() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dVehiculos();
						dresetVehiculos();
					}
				};
			},

			choiceMarcaVehiculo: function() {
				var util = this;
				return function(entry, scope) {

					var marcavehiculos = [];
					var marca = entry.values['marca.id'];
					entry.values['marca'] = '';

					var dMarcaVehiculos = $rootScope.$on('choice:marcavehiculos:get', getMarcaVehiculos);
					var dresetMarcaVehiculos = $rootScope.$on('choice:marcavehiculos:reset', resetMarcaVehiculos);

					scope.$on('$destroy', destroyEvent);

					return marcavehiculos;

					function getMarcaVehiculos(e, $item, $model) {
						util.apiVehiculoMarca($item, $model).then((response) => {
							marcavehiculos = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: marcavehiculos
							});

							entry.values['marca'] = marca;
						});
					}

					function resetMarcaVehiculos() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dMarcaVehiculos();
						dresetMarcaVehiculos();
					}
				};
			},

			choiceModeloVehiculo: function() {
				var util = this;
				return function(entry, scope) {

					var modelovehiculos = [];
					var modelo = entry.values['modelo.id'];
					entry.values['modelo'] = '';

					var dModeloVehiculos = $rootScope.$on('choice:modelovehiculos:get', getModeloVehiculos);
					var dresetModeloVehiculos = $rootScope.$on('choice:modelovehiculos:reset', resetModeloVehiculos);

					scope.$on('$destroy', destroyEvent);

					return modelovehiculos;

					function getModeloVehiculos(e, $item, $model) {
						util.apiVehiculoModelo($item, $model).then((response) => {
							modelovehiculos = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: modelovehiculos
							});

							entry.values['modelo'] = modelo;
						});
					}

					function resetModeloVehiculos() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dModeloVehiculos();
						dresetModeloVehiculos();
					}
				};
			},

			choiceMagnitud: function() {
				var util = this;
				return function(entry, scope) {

					var magnituds = [];
					var magnitud = entry.values['magnitud.id'];
					entry.values['magnitud'] = '';

					var dMagnituds = $rootScope.$on('choice:magnituds:get', getMagnituds);
					var dresetMagnituds = $rootScope.$on('choice:magnituds:reset', resetMagnituds);

					scope.$on('$destroy', destroyEvent);

					return magnituds;

					function getMagnituds(e, $item, $model) {
						util.apiMagnitud($item, $model).then((response) => {
							magnituds = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: magnituds
							});

							entry.values['magnitud'] = magnitud;
						});
					}

					function resetMagnituds() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dMagnituds();
						dresetMagnituds();
					}
				};
			},

			choiceMedida: function() {
				var util = this;
				return function(entry, scope) {

					var medidas = [];
					var medida = entry.values['medida.id'];
					entry.values['medida'] = '';

					var dMedidas = $rootScope.$on('choice:medidas:get', getMedidas);
					var dresetMedidas = $rootScope.$on('choice:medidas:reset', resetMedidas);

					scope.$on('$destroy', destroyEvent);

					return medidas;

					function getMedidas(e, $item, $model) {
						util.apiVehiculoModelo($item, $model).then((response) => {
							medidas = util.dataPrepare(response.data.originalElement, [{
									label: 'nomb'
								}, {
									value: 'id'
								}]);

							scope.$broadcast('choices:update', {
								choices: medidas
							});

							entry.values['medida'] = medida;
						});
					}

					function resetMedidas() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dMedidas();
						dresetMedidas();
					}
				};
			},

			choiceTipoMercantil: function() {
				var util = this;
				return function(entry, scope) {

					var tipomercantils = [];

					var dTipomercantils = $rootScope.$on('choice:tipomercantils:get', getTipomercantils);
					var dresetTipomercantils = $rootScope.$on('choice:tipomercantils:reset', resetTipomercantils);

					scope.$on('$destroy', destroyEvent);

					return tipomercantils;

					function getTipomercantils(e, $item, $model) {
						util.apiTipoMercantil($item, $model).then((response) => {
							tipomercantils = util.dataPrepare(response.data.originalElement, [{
									label: 'desc'
								}, {
									value: 'id'
								}, {
									codi: 'codi'
								}]);

							scope.$broadcast('choices:update', {
								choices: tipomercantils
							});
						});
					}

					function resetTipomercantils() {
						scope.$broadcast('choices:update', {
							choices: []
						});
					}

					function destroyEvent() {
						dTipomercantils();
						dresetTipomercantils();
					}
				};
			},

			choicePersonaProperty: function() {
				return [{
					label: 'nac_cedu'
				}, {
					value: 'id'
				}, {
					'nac_cedu': 'nac_cedu'
				}, {
					'nomb_apell': 'nomb_apell'
				}, {
					'cedu_nomb_apell': 'cedu_nomb_apell'
				}, {
					nomb: 'nomb'
				}, {
					apell: 'apell'
				}, {
					telf: 'telf'
				}];
			},


			apiAjusteReporte: function ($item, $model, $limit, $filters) {
				var filter = this.toQueryString(angular.isObject($filters)? $filters : {}, 'filters');
				return RestWrapper.getList({}, 'ajustereportes', '/api/ajustereportes?limit=' + ($limit || '2000') + '&' + filter);
			},

			apiPais: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'pais', '/api/pais?limit=' + ($limit || '1000'));
			},
			apiEstado: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'estados', '/api/estados?filters[pais]=' + $model + '&limit=' + ($limit || '2000'));
			},
			apiMunicipio: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'municipios', '/api/municipios?filters[edo]=' + $model + '&limit=' + ($limit || '3000'));
			},
			apiParroquia: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'parroquias', '/api/parroquias?filters[muni]=' + $model + '&limit=' + ($limit || '4000'));
			},
			apiZona: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'zonas', '/api/zonas?filters[parroq]=' + $model + '&limit=' + ($limit || '5000'));
			},

			apiPersona: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'personas', '/api/personas?limit=' + ($limit || '5000'));
			},
			apiTipoMercantil: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'tipomercantils', '/api/tipomercantils?limit=' + ($limit || '5000'));
			},

			apiMercantilComercio: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'mercantilcomercios', '/api/mercantils/tipo?codi=com');
			},
			apiMercantilCliente: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'mercantilclientes', '/api/mercantils/tipo?codi=cli');
			},

			apiProducto: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'productos', '/api/productos?limit=' + ($limit || '500000'));
			},

			apiProductoMarca: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'productomarcas', '/api/productomarcas?filters[producto]=' + $model + '&limit=' + ($limit || '5000'));
			},

			apiRubroProducto: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'rubroproductos', '/api/rubroproductos?limit=' + ($limit || '500000'));
			},

			apiMarcaProducto: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'marcaproductos', '/api/marcaproductos?limit=' + ($limit || '500000'));
			},

			apiMedida: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'medidas', '/api/medidas?limit=' + ($limit || '5000'));
			},
			apiMagnitud: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'magnituds', '/api/magnituds?limit=' + ($limit || '5000'));
			},

			apiVehiculo: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'vehiculos', '/api/vehiculos?limit=' + ($limit || '5000'));
			},

			apiVehiculoMarca: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'vehiculomarcas', '/api/vehiculomarcas?limit=' + ($limit || '5000'));
			},
			apiVehiculoModelo: function($item, $model, $limit) {
				return RestWrapper.getList({}, 'vehiculomodelos', '/api/vehiculomodelos?filters[marca]=' + $model + '&limit=' + ($limit || '5000'));
			},

			apiComerciante: function ($item, $model, $limit) {
				return RestWrapper.getList({}, 'guiacomerciantesempresas', '/api/guiacomerciantes/comerciantes?limit=' + ($limit || '5000'));
			}
		};
	}

	UtilityService.$inject = ['$rootScope', 'RestWrapper', 'moment'];

	return UtilityService;
});