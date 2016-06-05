/*require('imports?this=>window!./../../../bundles/bazingajstranslation/js/translator.min.js');*/

require('./../../../js/translator.js');
require('./../../../js/translations/config.js');
var req = require.context("./../../../js/translations", true, /.*\/(es|en)\.js$/);

var transKeys = req.keys();
for (var i = 0; i < transKeys.length; i++) {
	__webpack_require__(req.resolve(transKeys[i]));
}

require('./../../node_modules/angular-i18n/angular-locale_es-es.js');

require('./Main/MainModule');
require('./Crud/CrudModule');

angular.module('myApp', [
		'http-auth-interceptor', 'routeIndex', 'mainMod', 'crudMod', 'ng-admin', 'boxuk.translation', 'angular-jwt', 'angular-storage', 'angularMoment', 'angular.filter', 'ui.bootstrap'
	])
	;