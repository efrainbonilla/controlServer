/*global define*/
define(function (require) {
    'use strict';

    var paginationView = require('./maDatagridPagination.html');

    function DatagridPaginationDirective ($provide, NgAdminConfigurationProvider) {

        $provide.decorator('maDatagridPaginationDirective', ['$delegate', function ($delegate) {

            $delegate[0].template = paginationView;

            return $delegate;
        }]);
    }

    DatagridPaginationDirective.$inject = ['$provide', 'NgAdminConfigurationProvider'];

    return DatagridPaginationDirective;
});