var CrudModule = angular.module('crudMod', ['ng-admin']);

CrudModule.config(require('./list/maListActions'));
CrudModule.config(require('./list/maDatagridPagination'));
CrudModule.config(require('./list/maDatagrid'));
CrudModule.config(require('./field/maChoiceField'));
CrudModule.config(require('./field/maChoicesField'));

CrudModule.directive('maFieldCustom', require('./field/maFieldCustom'));

CrudModule.config(require('./field/maField'));
CrudModule.config(require('./filter/maFilterForm'));
CrudModule.config(require('./filter/maFilterButton'));
CrudModule.config(require('./button/maViewBatchActions'));

CrudModule.config(require('./show/maShowItem'));

module.exports = CrudModule;