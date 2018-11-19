function BasicFilterController($scope, $timeout) {

	let DEFAULT_LOGIC_OPERATOR = 'OR';

	$scope.onFilterSelect = function (selectedItem) {
		if (selectedItem.logicalOperators.length > 0) {
			$scope.selectedOperator = selectedItem.logicalOperators.indexOf(DEFAULT_LOGIC_OPERATOR) > -1 ? DEFAULT_LOGIC_OPERATOR : selectedItem.logicalOperators[0];
		}
		else {
			$scope.selectedOperator = undefined;
		}
		//console.log(`BasicFilterCtrl onFilterSelect`)
        const originalDataType = selectedItem.dataType;
		// Clear all of the filterModel keys so it won't conflict with the new selection
		// Object.keys($scope.filterModel).forEach((k)=>{
		// 	delete $scope.filterModel[k];
		// });

		_.unset($scope.filterModel, 'type');
		_.unset($scope.filterModel, 'value');
		_.unset($scope.filterModel, 'values');
		_.unset($scope.filterModel, 'patternType');
		_.unset($scope.filterModel, 'aggregation');
		_.unset($scope.filterModel, 'aggregationLevel');
		_.unset($scope.filterModel, 'metadata');


		// ng-switch does not recompile directives if we switch from
		// one filter to another filter of the same dataType (since ng-switch's logic is basically comparing strings)
		// so we do this ugly hack to force him to re-evaluate
		//if ($scope.selectedItem && $scope.selectedItem.dataType === selectedItem.dataType) {


			selectedItem.dataType="";
            $timeout(() => {
				selectedItem.dataType=originalDataType;
				$scope.$applyAsync();
			})
		//}
	};

	$scope.onOperatorSelect = function (selected) {
		$scope.selectedOperator = selected;
	};

	$scope.filterSelect = {
		settings: {
			displayProp: 'displayName',
			btnWidth: '170px',
			questionMarks: true,
			required: true
		},
		events: {
			onItemSelect: $scope.onFilterSelect
		}
	};

	$scope.operatorSelectConf = {
		settings: {
			required: true,
			btnWidth: '105px',
			template: '{{externalEvents.getProperty(option)}}'
		},
		events: {
			onItemSelect: $scope.onOperatorSelect,
			getProperty: function (option) {
				return $scope.logicalOperatorsLabels[option]
			}
		}
	}
}

export default BasicFilterController;