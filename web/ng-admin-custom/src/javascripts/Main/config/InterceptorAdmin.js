/*global define*/
define(function () {
	'use strict';

	function InterceptorAdmin (RestangularProvider) {
		RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params) {
			console.log('RequestInterceptor: ', element, operation, what, url, headers);
			if (operation == "getList") {
				if (params._page) {
					params._start = (params._page - 1) * params._perPage;
	                params._end = params._page * params._perPage;

	                params.offset = params._start;
	                params.limit = params._end;

	                delete params._start;
					delete params._end;

				}
				delete params._page;
				delete params._perPage;

				if (params._sortField) {
					/*params._sort = params._sortField;*/
					/*params.sorting = new Array();


					var order_by = {};
					order_by[params._sortField] = params._sortDir;
					order_by['case_name'] = 'ASC';
					var order = [];
					order.push('[case_id]=ASC');
					order.push('[case_name]=DESC');

					params.sorting = order_by;*/

					delete params._sortDir;
					delete params._sortField;
				}

				if (params._filters) {
					for (var filter  in params._filters) {
						params[filter] = params._filters[filter];
					}
					delete params._filters;
				}
			}
			console.log("request params", params);
			return {
				params: params
			};
		});

	    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

	        if (operation === 'getList' && data && data._embedded) {

	        	console.log(data, operation, what, response);
	        	return data._embedded.items;
	        }


	        //extra reference_many

			if (operation === 'get' && what === 'mercantils' && angular.isArray(data.repres)) {

				response.data._repres = response.data.repres;
				response.data._prop = response.data.prop;
				response.data._tipo = response.data.tipo;

				var repres = [];
				angular.forEach(response.data.repres, function(item) {
					repres.push(item.persona.id);
				});

				var prop = [];
				angular.forEach(response.data.prop, function(item) {
					prop.push(item.persona.id);
				});

				var tipo = [];
				angular.forEach(response.data.tipo, function(item) {
					tipo.push(item.tipo.id);
				});

				response.data.repres = repres;
				response.data.prop = prop;
				response.data.tipo = tipo;
			}

	        return data;
	    });

	    RestangularProvider.setResponseExtractor(function (data) {
			var resp = data;
	        if (angular.isArray(data)) {
	            resp.originalElement = [];
	            angular.forEach(resp, function (value, key) {
	                resp.originalElement[key] = angular.copy(value);
	            });
	        } else if (angular.isObject(data)) {
	            resp.originalElement = angular.copy(data);
	        }

	        return resp;
	    })
	}

	InterceptorAdmin.$inject = ['RestangularProvider'];

	return InterceptorAdmin;
});