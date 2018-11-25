
function NumericFilterController($scope){
	let ctrl = this;
	ctrl.scope = $scope;
	ctrl.scope.onSelectPatternType = (pattern) => {
		ctrl.scope.filterModel.patternType = pattern
	}

	ctrl.scope.operatorSelectConf = {
		settings: {
			required: true,
			btnWidth: '105px',
			template: '{{externalEvents.getProperty(option)}}'
		},
		events: {
			onItemSelect: ctrl.scope.onSelectPatternType,
			getProperty: function (option) {
				return ctrl.scope.operatorsMap[option]
			}
		}
	}
}

export default NumericFilterController;