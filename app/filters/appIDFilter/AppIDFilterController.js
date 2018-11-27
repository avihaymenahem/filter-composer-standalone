import * as _ from 'lodash';

function AppIDFilterController($scope, DimensionDAL, $element) {
    const vm = this;

    let interfaceType = 'web';

    vm.scope = $scope;

    vm.scrollToEnd = _.debounce(() => {
        if (vm.scrollContainer.scrollTop !== vm.scrollContainer.scrollHeight) {
            vm.scrollContainer.scrollTop = vm.scrollContainer.scrollHeight;
        }
    }, 500, {
        leading: false,
        trailing: true
    });

    const addRemoveSelectedFilter = (filterModel, isAdd) => {
        const searchBy = {
            id: filterModel.value
        };

        if (isAdd) {
            let foundFilter = _.filter(vm.scope.availableValues.values, searchBy)[0];
            vm.selected.push(foundFilter);
        } else {
            _.remove(vm.selected, searchBy);
        }
    };

    vm.onSelectValue = (item) => {
        const newFilterValue = {};
        const searchBy = {};
        newFilterValue.metadata = {
            validatorId: vm.scope.selectedItem.id,
            optional: item.metadata
        };

        newFilterValue.value = Number(item.id);
        newFilterValue.type = vm.scope.selectedItem.field;
        newFilterValue.patternType = vm.scope.selectedItem.patternType;

        if (vm.scope.selectedItem.aggregation) {
            if (vm.scope.selectedItem.aggregation.type) {
                newFilterValue.aggregation = vm.scope.selectedItem.aggregation.type;
            }
            if (vm.scope.selectedItem.aggregation.level) {
                newFilterValue.aggregationLevel = vm.scope.selectedItem.aggregation.level;
            }
        } else {
            // aggregation level is required, the default is pageView
            newFilterValue.aggregationLevel = item.aggregationLevel ? item.aggregationLevel : 'pageView';
        }

        if (!vm.scope.filterModel.values) {
            vm.scope.filterModel.values = [];
            vm.scope.filterModel.type = vm.scope.operator;
        } else {
            vm.scope.filterModel.values.push(newFilterValue);
            addRemoveSelectedFilter(newFilterValue, true);
        }

        setTimeout(vm.scrollToEnd, 0);

    };

    vm.onDeselectValue = (item) => {
        _.remove(vm.scope.filterModel.values, {
            value: Number(item.id)
        });

        addRemoveSelectedFilter(item, false);
    };

    const init = () => {
        // interfaceType = get($ngRedux.getState(), 'appData.activeView.interfaceType');
        let dimension = '';

        if (vm.scope.selectedItem) {
            dimension = vm.scope.selectedItem.field;
            if (dimension) {
                let wasEmitted = false;
                if (vm.scope.filterModel.values.length) {
                    vm.scope.$emit('filterloading');
                    wasEmitted = true;
                }
                vm.isSearching = true;
                DimensionDAL.getDimensionData(dimension, null, interfaceType)
                    .then((dimensionData) => {
                        vm.scope.availableValues.values =
                            dimensionData.data.map(app => ({
                                value: app.name,
                                id: app.id,
                                count: app.count
                            }));

                        // No need for server side search when dealing with
                        // low results count
                        vm.onSearchResults = angular.noop;
                        vm.useLocalFilter = true;

                        // find filter in available values
                        if (vm.scope.filterModel.values) {
                            vm.scope.filterModel.values.forEach((filterValue) => {
                                addRemoveSelectedFilter(filterValue, true);
                            });
                        }
                    }).finally(() => {
                        wasEmitted && vm.scope.$emit('filterready');
                        vm.isSearching = false;
                        vm.scrollContainer = _.first($element.find('div').children());
                        vm.scrollToEnd();
                    });
            }
        }
    };

    vm.scope.filterModel.values = vm.scope.filterModel.values || [];
    vm.selected = [];
    vm.scope.filterModel.type = vm.scope.operator;
    vm.scope.availableValues = {
        values: undefined
    };

    init();

}

export default AppIDFilterController;