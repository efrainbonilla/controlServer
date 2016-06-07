export default class BetweenController {
	constructor($rootScope, $scope) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		/*this.$scope.model = {};*/

		this.$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		this.$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd/MM/yyyy'];
		this.$scope.format = $scope.formats[4];

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 2);
		this.$scope.events =
			[{
				date: tomorrow,
				status: 'full'
			}, {
				date: afterTomorrow,
				status: 'partially'
			}];

		this.$scope.today = this.today.bind(this);
		this.$scope.clear = this.clear.bind(this);
		this.$scope.disabled = this.disabled.bind(this);
		this.$scope.toggleMin = this.toggleMin.bind(this);
		this.$scope.open = this.open.bind(this);
		this.$scope.getDayClass = this.getDayClass.bind(this);

		this.today();
		this.toggleMin('2016-01-01');

		this.$scope.$on('$destroy', this.destroy.bind(this));
	}

	today() {
		this.$scope.model.from = new Date();
		this.$scope.model.to = new Date();
	}

	clear() {
		this.$scope.model.from = null;
		this.$scope.model.to = null;
	}

	disabled(date, mode) {
		return false;
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	}

	toggleMin(minDate) {
		this.$scope.minDate = minDate;
		this.$scope.maxDate = new Date();
	}

	open($event) {
		$event.preventDefault();
		$event.stopPropagation();

		this.$scope.opened = true;
	}

	getDayClass(date, mode) {
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

			for (var i = 0; i < this.$scope.events.length; i++) {
				var currentDay = new Date(this.$scope.events[i].date).setHours(0, 0, 0, 0);

				if (dayToCheck === currentDay) {
					return this.$scope.events[i].status;
				}
			}
		}

		return '';
	}

	destroy() {
		this.$rootScope = undefined;
		this.$scope = undefined;
	}
}

BetweenController.$inject = ['$rootScope', '$scope'];