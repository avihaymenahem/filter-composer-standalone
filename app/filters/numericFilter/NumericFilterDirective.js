import * as _ from 'lodash';
import ctrl from './NumericFiliterController';

let numericFilter = () => {
    return {
        restrict: 'E',
        template: require('./NumericFilterView.html'),
        scope: {
            selectedItem: '=',
            filterModel: '=',
            configurations: '='
        },
        link: (scope, element) => {
            scope.operators = ["lessThan", "greaterThan", "lessThanEquals", "greaterThanEquals", "equals"]
            scope.operatorsMap = {
                "lessThan": "<", "greaterThan": ">", "lessThanEquals": "<=", "greaterThanEquals": ">=", "equals": "="
            };
            var init = function () {
                scope.patternType = undefined;
                if(!_.get(scope.filterModel,'metadata.validatorId')){
                    scope.filterModel.metadata = {validatorId:scope.selectedItem.id}
                }
                if (!scope.filterModel.type) {
                    scope.filterModel.type = scope.selectedItem.field
                }
                if (scope.filterModel.patternType) {
                    scope.patternType = scope.filterModel.patternType
                }
                let aggregation = _.get(scope.selectedItem, 'aggregation');
                if (aggregation) {
                    scope.filterModel.aggregation = aggregation.type;
                    scope.filterModel.aggregationLevel = aggregation.level;
                }
            }

            scope.$watch('selectedItem', init)

            init();
        },
        controller: ['$scope', ctrl]
    };
}

export default numericFilter;
