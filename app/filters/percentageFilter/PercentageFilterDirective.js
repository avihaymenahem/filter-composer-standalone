let percentageFilter = () => {
	return {
		restrict: 'E',
		template: require('./PercentageFilterView.html'),
		scope: {
			selectedItem: '=',
			filterModel: '='
		},
		link: (scope, element) => {
			scope.configurations = {
				units:'%',
				min:0,
				max:100
			}
		}
	}
}

export default percentageFilter;