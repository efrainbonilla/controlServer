/*global define*/

define(function(require) {
	'use strict';

	function DatagridLimitDirective() {
		return {
			restrict: 'E',
			scope: {
				page: '@',
				totalItems: '@'
			},
			link: function($scope) {

			},
			template:
`<div class="text-left">
    <span>Mostrar </span>
    <label>
        <select name="limit" class="form-control input-sm">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    </label>
</div>`
		};
	}

	return DatagridLimitDirective;
});