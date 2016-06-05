/*global define*/
define(function () {
    'use strict';


    function FilterFormDirective ($provide, FieldViewConfiguration) {

        $provide.decorator('maFilterFormDirective', ['$delegate', function ($delegate) {

            var template = `
<div class="row">
    <form class="filters col-md-12 form-horizontal" ng-if="shouldFilter()">
        <div class="filter form-group input-{{ field.type() }} col-md-6" ng-class="{'pull-right' : $first}"  ng-repeat="field in filters track by field.name()">
            <div class="row">
                <div class="col-sm-1 col-xs-1 remove_filter">
                    <a ng-if="!field.pinned()" ng-click="removeFilter(field)"><span class="glyphicon glyphicon-remove"></span></a>
                </div>
                <label for="{{ field.name() }}" class="col-sm-4 col-xs-11 control-label">
                    {{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
                </label>
                <div class="col-sm-7" ng-switch="field.type()" ng-class="field.getCssClasses(entry)">
                    <ma-filter field="::field" value="values[field.name()]" values="values" datastore="datastore"></ma-filter>
                </div>
            </div>
        </div>
    </form>
</div>
    `;

            $delegate[0].template = template;

            return $delegate;
        }]);
    }

    FilterFormDirective.$inject = ['$provide', 'FieldViewConfigurationProvider'];

    return FilterFormDirective;
});