/*global define*/
define(function (require) {
    'use strict';

    var listActionsTemplate = require('./ListActions.html');

    function ListActionsDirective ($provide, NgAdminConfigurationProvider) {

        $provide.decorator('maListActionsDirective', ['$delegate', function ($delegate) {

            $delegate[0].template = listActionsTemplate;

            return $delegate;
        }]);
    }

    ListActionsDirective.$inject = ['$provide', 'NgAdminConfigurationProvider'];

    return ListActionsDirective;
});