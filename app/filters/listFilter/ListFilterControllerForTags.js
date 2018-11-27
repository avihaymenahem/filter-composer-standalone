import * as _ from 'lodash';

function ListFilterController($scope, DimensionDAL, $element) {
    const vm = this;
    vm.scope = $scope;
    const REQ_INTERVAL = 200;
    const TOP_DIMENSIONS_VALUES = 200;
    const ADOBE_VISITOR_SEGMENTS = 'adobevisitorsegments';

    let interfaceType;
    let lastReqTime;
    let searchBufferTimeout;

    vm.scrollToEnd = _.debounce(() => {
        if (!vm.scrollContainer) {
            // if the select was open when this fired it would have appened itself 
            // to <body> leaving a placeholder input, that we won't scroll
            if (~_.first($element.find('div'))
                    .className
                    .indexOf('ui-select-placeholder')) {
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
    }, 500, {
        leading: false,
        trailing: true
    });

    vm.onSelectValue = function (item) {
        const newValue = {
            value: item.eventId || item.value,
            type: vm.scope.selectedItem.field,
            metadata: {
                validatorId: vm.scope.selectedItem.id,
            },
        };

        if (vm.scope.selectedItem.aggregation && vm.scope.selectedItem.aggregation.level !== 'pageView') {
            if (vm.scope.selectedItem.aggregation.type) newValue.aggregation = vm.scope.selectedItem.aggregation.type;
            if (vm.scope.selectedItem.aggregation.level) newValue.aggregationLevel = vm.scope.selectedItem.aggregation.level;
        }

        vm.scope.filterModel.values.push(newValue);
        vm.selected.push(_.find(vm.scope.availableValues.values,
            o => o.eventId === newValue.value || o.value === newValue.value));

        setTimeout(vm.scrollToEnd, 0);
    };

    vm.onDeselectValue = function (item) {
        _.remove(vm.selected, o => o.eventId === item.value || o.value === item.value);
        if (vm.scope.filterModel.values[0].type.toLowerCase() === ADOBE_VISITOR_SEGMENTS) {
            _.remove(vm.scope.filterModel.values, {
                value: vm.scope.availableValues.values.filter(val => val.value === item.value)[0].eventId
            });
        } else {
            _.remove(vm.scope.filterModel.values, {
                value: item.value
            });
        }
    };

    const doSearchData = (searchFilter) => {
        if (vm.scope.selectedItem && vm.scope.selectedItem.field && vm.scope.availableValues) {
            const dimension = vm.scope.selectedItem.field;
            let checkedItems = vm.selected;

            vm.scope.availableValues = {
                values: undefined
            };

            vm.isSearching = true;
            return DimensionDAL.getSearchData(dimension, searchFilter, interfaceType, true)
                .then((searchData) => {
                    if (searchData && searchData.data) {
                        vm.scope.availableValues.values = searchData.data;

                        if (checkedItems && checkedItems instanceof Array) {
                            // convert to string array
                            checkedItems = checkedItems.map(item => (item ? item.value : null));

                            if (vm.scope.availableValues.values && vm.scope.availableValues.values instanceof Array) {
                                vm.scope.availableValues.values.forEach((item) => {
                                    if (item && checkedItems.indexOf(item.value) > -1) {
                                        item.checked = true;
                                    }
                                });
                            }
                        }
                    }
                }).finally(() => {
                    vm.isSearching = false;
                });
        }

        return null;
    };

    const onSearchResultsValue = (searchFilter) => {
        const startTime = Date.now();
        const timeDelta = startTime - (lastReqTime || startTime);
        // if the current request time is less than REQ_INTERVAL, buffer it until the REQ_INTERVAL will end
        vm.scope.availableValues = {
            values: undefined
        };
        if (lastReqTime && (timeDelta < REQ_INTERVAL)) {
            clearTimeout(searchBufferTimeout);
            searchBufferTimeout = setTimeout(onSearchResultsValue(searchFilter), REQ_INTERVAL - timeDelta);
            lastReqTime = startTime;
            vm.isSearching = false;
            return null;
        }

        lastReqTime = startTime;
        return doSearchData(searchFilter);
    };

    const init = function () {
        let wasEmitted = false;

        if (vm.scope.filterModel.values.length) {
            vm.scope.$emit('filterloading');
            wasEmitted = true;
        }

        interfaceType = 'web'// _.get($ngRedux.getState(), 'appData.activeView.interfaceType');
        vm.isSearching = true;

        DimensionDAL.getDimensionData(vm.scope.selectedItem.field, null, interfaceType)
            .then((dimensionData) => {
                vm.scope.availableValues.values = dimensionData.data;

                // No need for server side search when dealing with
                // low results count
                vm.onSearchResults = dimensionData.data.length >= TOP_DIMENSIONS_VALUES ? onSearchResultsValue : angular.noop;
                vm.useLocalFilter = dimensionData.data.length < TOP_DIMENSIONS_VALUES;

                if (vm.scope.filterModel.values) {
                    // Added fix for dynamic paging
                    vm.selected = vm.scope.filterModel.values.map(({
                        value
                    }) => {
                        if (dimensionData.dimension === ADOBE_VISITOR_SEGMENTS) {
                            let item = dimensionData.data.filter(dimData => dimData.eventId === value)[0];
                            return {
                                value: item.value || value,
                                count: item.count || 0
                            };
                        } else {
                            return {
                                value: value,
                                count: 0
                            }
                        }
                    });
                } else {
                    vm.scope.filterModel.values = [];
                }
            }).catch((e) => {
                vm.scope.availableValues.values = [];
            }).finally(() => {
                vm.isSearching = false;
                wasEmitted && vm.scope.$emit('filterready');
                vm.scrollToEnd();
            });
    };

    vm.scope.filterModel.values = vm.scope.filterModel.values || [];
    vm.selected = [];
    vm.scope.availableValues = {
        values: []
    };
    vm.scope.filterModel.type = vm.scope.operator;

    init();

}

export default ListFilterController;