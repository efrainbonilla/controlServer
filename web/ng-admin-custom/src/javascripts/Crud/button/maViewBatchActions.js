/*global define*/
define(function (require) {
    'use strict';

    function maViewBatchActionsDirective ($provide) {

        $provide.decorator('maViewBatchActionsDirective', ['$delegate', function ($delegate) {

            var template = `
<span ng-if="selection" ng-class="{hidden:!selection || selection.length==0}"> <span class="btn-group" dropdown is-open="isopen"><button type="button" ng-if="selection.length" class="btn btn-default dropdown-toggle" dropdown-toggle >
            {{ selection.length }} Seleccionado <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li ng-repeat="button in buttons" ng-switch="button">
                <a ng-switch-when="delete">
                    <ma-batch-delete-button selection="selection" label="{{ 'action.delete' | trans }}" entity="entity"/>
                </a>
                <a ng-switch-default>
                    <span compile="button"></span>
                </a>
            </li>
        </ul>
    </span>
</span>`;

            $delegate[0].template = template;

            return $delegate;
        }]);
    }

    maViewBatchActionsDirective.$inject = ['$provide'];

    return maViewBatchActionsDirective;
});