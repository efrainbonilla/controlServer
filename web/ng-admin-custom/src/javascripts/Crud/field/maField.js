/*global define*/
define(function (require) {
    'use strict';

    function maFieldDirective ($provide, FieldViewConfiguration) {

        $provide.decorator('maFieldDirective', ['$delegate', '$compile', function ($delegate,  $compile) {
            var oldLink = $delegate[0].link;
            var newLink = function(scope, element){
                const field = scope.field();
                const type = field.type();
                scope.field = field;
                scope.type = type;
                scope.entity = scope.entity();
                scope.form = scope.form();
                scope.datastore = scope.datastore();
                scope.getCssClasses = function(entry) {
                    return 'ng-admin-field-' + field.name().replace('.', '_') + ' ng-admin-type-' + type + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
                };

                scope.getInput = function() {
                    return scope.form[field.name()];
                };

                /**
                 * Should validation status be displayed for a given field?
                 *
                 * - No for non-editable fields, or template fields which not have a corresponding input
                 * - No for non-altered input
                 * - Yes otherwise
                 */
                scope.fieldHasValidation = function() {
                    var input = this.getInput();
                    return input && input.$dirty;
                };

                scope.fieldIsValid = function() {
                    var input = this.getInput();
                    return input && input.$valid;
                };

                scope.getFieldValidationClass = function() {
                    if (this.fieldHasValidation()) {
                        return this.fieldIsValid() ? 'has-success' : 'has-error';
                    }
                };

                scope.fieldIsLabel = function (field) {
                    //console.log(field, field._label);
                    return (field._label)? field.label(): field.name();
                };

                var fieldTemplate;
                if (scope.field.editable()) {
                    fieldTemplate =
        `<div ng-class="getCssClasses(entry)">
            ${(!field.templateIncludesLabel() && field.getTemplateValue(scope.entry)) || FieldViewConfiguration.$get()[type].getWriteWidget()}
            <span ng-show="fieldHasValidation()" class="glyphicon form-control-feedback" ng-class="fieldIsValid() ? 'glyphicon-ok' : 'glyphicon-remove'"></span>
        </div>`;
                    } else {
                        fieldTemplate =
        `<div ng-class="field.getCssClasses(entry)||'col-sm-10'">
            <p class="form-control-static">
                <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>
            </p>
        </div>`;
                    }

                    const template =
        `<div id="row-{{ field.name() }}" class="form-field form-group has-feedback" ng-class="getFieldValidationClass()">
            <label for="{{ field.name() }}" class="col-sm-2 control-label">
                {{ fieldIsLabel(field) | trans }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
            </label>
            ${fieldTemplate}
        </div>`;

                    element.append(template);
                    $compile(element.contents())(scope);

                    //oldLink.apply(this, arguments);
                    return;
                };

            $delegate[0].compile = function() {
                return newLink;
            };

            return $delegate;
        }]);
    }

    maFieldDirective.$inject = ['$provide', 'FieldViewConfigurationProvider'];

    return maFieldDirective;
});
