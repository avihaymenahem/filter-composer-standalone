export default function CSVFilterController($scope, $element) {
    const vm = this;

    vm.tagTransform = (value) => { 
        if (value && /\d/.test(value) && !_.isNaN(+value)) {
            return { value }
        }
    };

    vm.onSelectValue = (item) => { 
        if (!item) {
            return false;
        }
       
        if (item.value && /\d/.test(item.value) && !_.isNaN(+item.value)) {        
            $scope.filterModel.values.push({
                type: $scope.selectedItem.field,
                value: item.value,
                aggregation: $scope.selectedItem.aggregation.type,
                patternType: $scope.selectedItem.patternType,
                metadata: {
                    validatorId: $scope.selectedItem.id,
                    optional: {}
                }
            }); 
        }
        vm.selected = [ ...$scope.filterModel.values ];
        setTimeout(vm.scrollToEnd, 0);            
    };

    vm.scrollToEnd = _.debounce(() => {
        if (!vm.scrollContainer) {
            // if the select was open when this fired it would have appened itself 
            // to <body> leaving a placeholder input, that we won't scroll
            if (~_.first($element.find('div')).className.indexOf('ui-select-placeholder')) {
                return;
            }
            vm.scrollContainer = _.first($element.find('div').children());                        
        }

        if (!vm.scrollContainer) {
            return;
        }

        // Test if element can scroll (and has a scrollbar)
        if (vm.scrollContainer.scrollHeight > vm.scrollContainer.clientHeight) {
            // Scroll to bottom if not there yet
            if (vm.scrollContainer.scrollTop < vm.scrollContainer.scrollHeight) {
                vm.scrollContainer.scrollTop = vm.scrollContainer.scrollHeight;
            }
        }
    }, 500, { leading: false, trailing: true });

    vm.onDeselectValue = ({ value }) => { 
        _.remove($scope.filterModel.values, { value });
        vm.selected = [ ...$scope.filterModel.values ];        
    }

    $scope.filterModel.type = $scope.operator;
    $scope.filterModel.values = $scope.filterModel.values || [];

    vm.selected = [ ...$scope.filterModel.values ];

    $scope.$on('tagsPostLink', () => {
        vm.scrollToEnd();
    })
}