import ctrl from './FilterComposerController';
import * as _ from 'lodash';

let FilterComposer = () => {
	return {
		restrict: 'E',
		template: require('./FilterComposerView.html'),
		scope: {
			filtersModel: '=',
			filtersList: '=',
			configuration: '='
		},
		controllerAs: 'ctrl',
		link: (scope, element) => {
			if (scope.filtersModel.values) {
				scope.includedFilters = _.chain(scope.filtersModel)
					.get('values')
					.filter({
						type: 'AND'
					})
					.first()
					.get('values')
					.value();
				scope.excludedFilters = _.chain(scope.filtersModel)
					.get('values')
					.filter({
						type: 'NOT'
					})
					.first()
					.get('values')
					.filter({
						type: 'AND'
					})
					.first()
					.get('values')
					.value();
			}

			scope.labels = {
				'add': 'Add Include' /*_.get(scope.configuration, 'label.add') || 'MODALS.COMMON.INCLUDE_CONDITION' */ ,
				'remove': 'Add Exclude' /* _.get(scope.configuration, 'label.exclude') || 'MODALS.COMMON.EXCLUDE_CONDITION' */
			}
		},
		controller: ['$scope', ctrl]
	};
};

export default FilterComposer;