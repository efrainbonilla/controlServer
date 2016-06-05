/*global define*/
define(function (require) {
    'use strict';

    function FilterButtonDirective ($provide) {

        $provide.decorator('maFilterButtonDirective', ['$delegate', function ($delegate) {

            var template = `
<span class="btn-group" dropdown is-open="isopen" ng-if="hasFilters()">
    <button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle >
        <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;Agregar filtro <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
        <li ng-repeat="filter in notYetEnabledFilters()" ng-switch="button">
            <a ng-click="enableFilter()(filter)">{{ filter.label() }}</a>
        </li>
    </ul>
</span>`;

            $delegate[0].template = template;

            return $delegate;
        }]);
    }

    FilterButtonDirective.$inject = ['$provide'];

    return FilterButtonDirective;
});