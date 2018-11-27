import ctrl from './AppIDFilterController';

let appIDFilter = () => {
	return {
		restrict: 'E',
		template: require('./AppIDFilterView.html'),
		scope: {
			selectedItem: '=',
			filterModel: '=',
			operator: '='
		},
		link: (scope, element) => {
			scope.$watch(function () {
				return scope.operator;
			}, function (newVal) {
				scope.filterModel.type = newVal;
			})
		},
		controller: ['$scope', 'DimensionDAL', '$element', ctrl],
		controllerAs: 'vm'
	};
};

export default appIDFilter;
