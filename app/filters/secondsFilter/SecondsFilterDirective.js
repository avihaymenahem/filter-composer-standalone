let percentageFilter = () => {
	return {
		restrict: 'E',
		template: require('./SecondsFilterView.html'),
		scope: {
			selectedItem: '=',
			filterModel: '='
		},
		link: (scope, element) => {
			scope.configurations = {
				units:'seconds',
				additionalAttr:['time-number']
			}
		}
	}
}

export default percentageFilter;