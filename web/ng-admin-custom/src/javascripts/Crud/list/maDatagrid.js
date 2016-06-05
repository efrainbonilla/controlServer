/*global define*/

define(function (require) {
    'use strict';

    var datagridTemplate = require('./datagridLayout.html');

    function maDatagridDirective($provide) {

        $provide.decorator('maDatagridDirective', ['$delegate', function ($delegate) {

            $delegate[0].template = datagridTemplate;

            return $delegate;
        }]);
    }

    maDatagridDirective.$inject = ['$provide'];

    return maDatagridDirective;
});
