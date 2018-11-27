import ctrl from './locationFilter.controller';

let locationFilter = () => {
	return {
		restrict: 'E',
		template: require('./locationFilter.html'),
		scope: {
			selectedItem: '=',
			filterModel: '=',
			configuration: '=',
			operator: '='
		},
		controller: ['$scope', '$timeout', 'DimensionDAL', ctrl]
	};
}

export default locationFilter;
