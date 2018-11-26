import * as _ from 'lodash';

let booleanFilter = () => {
	return {
		restrict: 'E',
		template: require('./booleanFilter.html'),
		scope: {
			selectedItem: '=',
			filterModel: '=',
			configurations: '='
		},
		link: (scope, element) => {
			scope.filterModel.type  = scope.selectedItem.field;
			scope.filterModel.value = scope.selectedItem.dataType === 'positiveBoolean' ? 1 : 0; // analytics require a numeric value
    		scope.filterModel.patternType = "equals";
			scope.filterModel.metadata = {
				"validatorId": scope.selectedItem.id
			}
			let aggregation = _.get(scope.selectedItem, 'aggregation');
			if (aggregation) {
				scope.filterModel.aggregation = aggregation.type;
				scope.filterModel.aggregationLevel = aggregation.level;
			}
		}
	};
}

export default booleanFilter;
