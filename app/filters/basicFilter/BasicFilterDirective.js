import {filter, get} from 'lodash';
import ctrl from './BasicFilterController';

let BasicFilter = () => {
	return {
		restrict: 'E',
		template: require('./BasicFilterView.html'),
		scope: {
			filterModel: '=',
			filtersList: '=',
			config: '='
		},
		link: (scope) => {
			scope.logicalOperatorsLabels = {
				"OR": "is one of",
				"AND": "is all of"
			};

			let init = function () {
				//for existing multi select with logical operator
				let filterId;
				if (_.keys(scope.logicalOperatorsLabels).indexOf(scope.filterModel.type) >= 0 && scope.filterModel.values && scope.filterModel.values.length > 0) {
					scope.selectedOperator = scope.filterModel.type;
					//assuming that all from the same type
					filterId = {id: get(scope.filterModel.values[0], 'metadata.validatorId')};
				}
				else {
					filterId = {id: get(scope.filterModel, 'metadata.validatorId')};
				}
				scope.selectedItem = filter(scope.filtersList, filterId)[0] || (scope.filtersList.length == 1 ? scope.filtersList[0] : undefined);
			};

			init()
		},
		controller: ['$scope', '$timeout', ctrl]
	};
};

export default BasicFilter;