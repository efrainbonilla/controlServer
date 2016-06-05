/*global define*/
define(function (require) {
    'use strict';

    function ShowItemDirective ($provide, NgAdminConfigurationProvider) {

        $provide.decorator('maShowItemDirective', ['$delegate', function ($delegate) {

            $delegate[0].template =
`<div class="col-lg-12 form-group">

    <label ng-if="field._label" class="col-sm-2 control-label">{{ field.label() | trans }}</label>
    <label ng-if="!field._label" class="col-sm-2 control-label">{{ field.name() | trans }}</label>

    <div class="show-value" ng-class="::'ng-admin-field-' + field.name() + ' ' + 'ng-admin-type-' + field.type() + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7')">
        <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>
    </div>
</div>`;
            return $delegate;
        }]);
    }

    ShowItemDirective.$inject = ['$provide', 'NgAdminConfigurationProvider'];

    return ShowItemDirective;
});