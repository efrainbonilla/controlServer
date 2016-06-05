/*global define*/

define(function (require) {
    'use strict';

    function sicapDashboardBetweenDatagridDirective() {
        return {
            restrict: 'E',
            scope: {
                collection: '=',
            },
            controller: ['$scope', function ($scope) {

            }],
            template:
`<table class="table table-bordered">
    <tbody>
        <tr ng-if="collection.betweenData.length == 0 || !collection.betweenData">
            <td colspan="4">{{ 'search.no_results' | trans }}</td>
        </tr>
         <tr ng-if="collection.betweenData.length > 0">
            <th colspan="1">GRUPO</th>
            <th  width="40%">PRODUCTO</th>
            <th  width="30%">PRESTACIÓN</th>
            <th  width="30%">TOTAL</th>
        </tr>
        <tr ng-repeat="(key, values) in collection.betweenData | groupBy: 'grup1'">
            <td colspan="1">{{ key }}</td>
            <td colspan="3" style="padding:0">
                <table class="table table-bordered" style="margin-bottom: 0;">
                    <tbody>
                        <tr ng-repeat="item in values">
                            <td width="40%">{{ item.producto }}</td>
                            <td width="30%">{{ item.prestacion }}</td>
                            <td width="30%">{{ item.total }} {{ item.denominacion }}</td>
                        </tr>
                    <tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`
        };
    }

    sicapDashboardBetweenDatagridDirective.$inject = [];

    return sicapDashboardBetweenDatagridDirective;
});
