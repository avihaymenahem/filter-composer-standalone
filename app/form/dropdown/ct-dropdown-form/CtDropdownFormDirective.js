import Utils from  '../common/DropdownUtils';

let dropdownForm = () => {
	return {
		restrict: 'E',
		scope: {
			options: '=',
			selectedModel: '=',
			extraSettings: '=',
			events: '='
		},
		template: require('./CtDropdownFormView.html'),
		link: ($scope, $element) => {

			$scope.settings = {
				scrollable: true,
				scrollableHeight: '250px',
				btnWidth:null,
				keyboardNav:true,
				closeOnBlur: true,
				displayProp: 'label',
				idProp: 'id',
				externalIdProp: 'id',
				buttonClasses: 'ct-dropdown-btn',
				template: '{{getPropertyForObject(option, settings.displayProp)}}',
				selectedTemplate: '{{getPropertyForObject(selectedModel, settings.displayProp,123)}}',
				required: false,
				disabled:false
			};



			$scope.toggleDropdown = function () {
				Utils.dropDownFixPosition($element.find('button')[0], $element[0].getElementsByClassName('dropdown-menu')[0])
			}

			$scope.onItemSelect = function (item) {
				$scope.selectedModel = item;
				$scope.externalEvents.onItemSelect(item);
			};

			$scope.getPropertyForObject = function (object, property) {
				if (angular.isDefined(object) && object.hasOwnProperty(property)) {
					return object[property];
				}
				return '';
			};

			$scope.test = function (object,property){
				$scope.getPropertyForObject(object,property)
			}

			$scope.externalEvents = {
				onItemSelect: angular.noop,
				getProperty : $scope.getPropertyForObject
			};

			angular.extend($scope.externalEvents, $scope.events || []);
			angular.extend($scope.settings, $scope.extraSettings || []);
		}
	}
};
export default dropdownForm;