import entidadTemplate from '../../view/layoutModalDetailEntidad.html';

class DetailEntidadModalController {
    constructor($scope, $modalInstance, UtilityService, items, entries) {
        this.$scope = $scope;
        this.$scope.items = items;
        this.$modalInstance = $modalInstance;
        this.util = UtilityService;
        this.entries = entries;
        this.$scope.entry = entries[0];

        this.request();

        this.$scope.close = this.close.bind(this);

        this.$scope.$on('$destroy', this.destroy.bind(this));
    }

    request() {
        this.util.apiComercioDetail({}, this.$scope.entry)
            .then((response) => {
                this.$scope.items = response.data.originalElement;
            });
    }

    close() {
        this.$modalInstance.close();
    }

    destroy() {
        this.$scope = undefined;
        this.$modalInstance = undefined;
        this.util = undefined;
        this.items = undefined;
        this.entries = undefined;
    }
}

class GridController {
    constructor($scope, $rootScope, $modal, $document) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$modal = $modal;
        this.$document = $document[0];

        this.$scope.form = $scope.form();
        this.$select = null;
        this.$scope.entries = [];
        this.$scope.fields = [{
            name: 'rif'
        }, {
            name: 'estb'
        }/*, {
            name: 'prop'
        }*/];

        this.$scope.form.$scope.isSaving = false;

        this.$scope.show = this.openModal.bind(this);

        this.$scope.form.submitCreation = this.submitCreation.bind(this);

        this.$rootScope.$on('grid:render', this.grid.bind(this));
        this.$scope.$on('$destroy', this.destroy.bind(this));
    }

    grid($event, $item, $select) {
        $event.preventDefault();

        this.$select = $select;
        this.$scope.entries = $item;

        var fform = angular.element(this.$document.querySelector('#fform'));
        fform.removeAttr('disabled');
    }

    openModal($event) {
        $event.preventDefault();

        this.$scope.items = [{
            loading: true
        }];

        this.$modal.open({
            animation: true,
            template: entidadTemplate,
            controller: DetailEntidadModalController,
            size: 'lg',
            resolve: {
                items: () => {
                    return this.$scope.items;
                },
                entries: () => {
                    return this.$scope.entries;
                }
            }
        });
    }

    submitCreation($event) {
        $event.preventDefault();

        let form = this.$scope.form;
        if (!form.validateEntry()) {
            return;
        }

        let entity = form.entity,
            view = form.view,
            route = !entity.editionView().enabled ? 'show' : 'edit',
            restEntry = form.$scope.entry.transformToRest(view.fields());

        form.progression.start();
        form.$scope.isSaving = true;

        form.WriteQueries
            .createOne(view, restEntry)
            .then(rawEntry => {
                form.progression.done();
                form.notification.log('Element successfully created.', {
                    addnCls: 'humane-flatty-success'
                });
                form.$state.go(form.$state.get(route), {
                    entity: entity.name(),
                    id: view.mapEntry(rawEntry).identifierValue
                });
                form.$scope.isSaving = false;

            }, this.handleError.bind(this));
    }

    handleError(response) {
        let form = this.$scope.form;
        form.$scope.isSaving = false;

        form.handleError(response);
    }

    destroy() {
        this.$scope = undefined;
        this.$rootScope = undefined;
        this.$modal = undefined;
        this.$document = undefined;
    }
}

/**
 * Show grid page guiacomcli
 *
 * Usage:
 * <sicap-guiacomcli-grid form="form" entry="entry" entity="entity"></sicap-guiacomcli-grid>
 */

export default function sicapGuiacomcliGridDirective() {
    return {
        restrict: 'E',
        scope: {
            form: '&',
            entry: '=',
            entity: '&',
        },
        controllerAs: 'grid',
        controller: GridController,
        template: `<table class="grid table table-condensed table-hover table-striped">
    <thead>
        <tr>
            <th ng-repeat="field in fields track by $index" ng-class="'ng-admin-column'">
                <a>
                    {{ field.name | trans }}
                </a>
            </th>
            <th class="ng-admin-column-actions">
                Acciones
            </th>
        </tr>
    </thead>

    <tbody>
        <tr ng-repeat="entry in entries">
            <td ng-repeat="field in fields track by $index">
                <span>{{ entry[field.name] }}</span>
            </td>
            <td class="ng-admin-column-actions">
                <!--<button type="button" ng-click="show($event)" class="btn btn-default btn-xs">
                    <span class="glyphicon glyphicon-eye-open"></span>
                </button>-->
                <!--<button type="button" ng-click="checked($event)" class="btn btn-default btn-xs">
                    <span class="glyphicon glyphicon-unchecked"></span>
                </button>-->
            </td>
        </tr>
    </tbody>
</table>`
    };
}

DetailEntidadModalController.$inject = ['$scope', '$modalInstance', 'UtilityService', 'items', 'entries'];
GridController.$inject = ['$scope', '$rootScope', '$modal', '$document'];

sicapGuiacomcliGridDirective.$inject = [];