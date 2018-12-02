import { filter, remove, get } from 'lodash';

function SetFilterController($scope, DimensionDAL, $element) {
    const vm = this;
    const REQ_INTERVAL = 200;
    const TOP_DIMENSIONS_VALUES = 200;
    
    const searchableDimensions = [
        'dynamicAction', 
        'pageAttribute', 
        'visitDynamicAction', 
        'visitPageAttribute'
    ];
    const CREATE_METHODS = {
		STATIC: "static",
		DYNAMIC: "dynamic"
	};
	const DIMENSIONS = {
		PAGE_ATTR: "pageAttribute",
		ACTION: "action"
	};

    let lastReqTime;
    let searchBufferTimeout;
    let interfaceType;

    vm.scope = $scope;

    const getDimensionType = (dataType) => {
        let dimType = null;
        
        if (dataType === 'pageAttribute' || dataType === 'visitPageAttribute') {
            dimType = DIMENSIONS.PAGE_ATTR;
        } else if (dataType === 'dynamicAction' || dataType === 'visitDynamicAction') {
            dimType = DIMENSIONS.ACTION;
        }
		return dimType;
	}

    const addRemoveSelectedFilter = (filterModel, isAdd) => {
        const searchBy = get(filterModel.metadata, 'optional.createMethod') === CREATE_METHODS.STATIC ?
            { eventId: filterModel.value } :
            { value: filterModel.value };

        if (isAdd) {
            let foundFilter = filter(vm.scope.availableValues.values, searchBy)[0];
            
            if (!foundFilter && _.has(searchBy, 'value')) {
                // in case that the dynamic item wasn't included in the response add it to the list with count 0 so it could be listed on the component
                foundFilter = {
                    value: filterModel.value,
                    count: 0,
                    metadata: {
                        createMethod: CREATE_METHODS.DYNAMIC, 
                        dimension: getDimensionType(vm.scope.selectedItem.dataType)
                    }
                }
            }

            vm.selected.push(foundFilter);
        } else {
            remove(vm.selected, searchBy);
        }
    };

    const doSearchData = (searchFilter) => {
        if (vm.scope.selectedItem && vm.scope.selectedItem.dataType && vm.scope.availableValues) {
            const dimension = vm.scope.selectedItem.dataType;
            let checkedItems = vm.selected;

            vm.scope.availableValues = { values: undefined };
            vm.isSearching = true;
            return DimensionDAL.getSearchData(dimension, searchFilter || '', interfaceType, true)
                .then((searchData) => {
                    if (searchData && searchData.data) {
                        vm.scope.availableValues.values = searchData.data;

                        if (checkedItems && checkedItems instanceof Array) {
                            // convert to string array
                            checkedItems = checkedItems.map(item => (item && item.value) || null);

                            if (vm.scope.availableValues.values && vm.scope.availableValues.values instanceof Array) {
                                vm.scope.availableValues.values.forEach((item) => {
                                    if (item && checkedItems.indexOf(item.value) > -1) {
                                        item.checked = true;
                                    }
                                });
                            }
                        }
                    }
                }).finally(()=> { vm.isSearching = false; });
        }

        return null;
    };

    const onSearchResultsValue = (searchFilter) => {
        const startTime = Date.now();
        const timeDelta = startTime - (lastReqTime || startTime);

        // if the current request time is less than REQ_INTERVAL, buffer it until the REQ_INTERVAL will end
        vm.scope.availableValues = { values: undefined };
        if (lastReqTime && (timeDelta < REQ_INTERVAL)) {
            clearTimeout(searchBufferTimeout);
            searchBufferTimeout = setTimeout(() => onSearchResultsValue(searchFilter), REQ_INTERVAL - timeDelta);
            lastReqTime = startTime;
            vm.isSearching = false;
            return null;
        }
        lastReqTime = startTime;
        return doSearchData(searchFilter);
    };

    vm.onSelectValue = (item) => {
        const newFilterValue = {};
        const searchBy = {};
        newFilterValue.metadata = { validatorId: vm.scope.selectedItem.id, optional: item.metadata };

        if (item.metadata.createMethod === CREATE_METHODS.STATIC) {
            // if it's static the type is always 'event' for all dimensions
            newFilterValue.value = Number(item.eventId);
            newFilterValue.type = 'event';

            if (item.eventType) {
                newFilterValue.eventType = item.eventType;
            }

            searchBy.eventId = item.value;
        } else if (item.metadata.createMethod === CREATE_METHODS.DYNAMIC) {
            if (item.metadata.dimension === 'action') {
                newFilterValue.type = 'dynamicAction';
            } else if (item.metadata.dimension === 'pageAttribute') {
                newFilterValue.type = 'pageAttribute';
            }
            newFilterValue.value = item.value;
            searchBy.value = item.value;
        }

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
        if (item.eventId) {
            remove(vm.scope.filterModel.values, { value: Number(item.eventId) });
        } else {
            remove(vm.scope.filterModel.values, { value: item.value });
        }

        addRemoveSelectedFilter(item, false);
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

    const init = () => {
        interfaceType = 'web';//get($ngRedux.getState(), 'appData.activeView.interfaceType');
        let dimension = '';

        if (vm.scope.selectedItem) {
            // dataTypes are the dimension to request, in the case of 'event' the server expects a request for 'events'
            dimension = vm.scope.selectedItem.dataType === 'event' ?
                'events' :
                vm.scope.selectedItem.dataType;
            if (dimension) {
                let wasEmitted = false;
                if (vm.scope.filterModel.values.length) {
		            vm.scope.$emit('filterloading');
		            wasEmitted = true;
                }
                vm.isSearching = true; 
                DimensionDAL.getDimensionData(dimension, null, interfaceType)
                    .then((dimensionData) => {
                        vm.scope.availableValues.values = dimensionData.data;

                        // No need for server side search when dealing with
                        // low results count
                        if (dimensionData.data.length < TOP_DIMENSIONS_VALUES) {
                            vm.onSearchResults = angular.noop;
                        } else {
                            vm.onSearchResults = searchableDimensions.includes(vm.scope.selectedItem.field) ?
                            onSearchResultsValue :
                            angular.noop;
                        }
                        
                        vm.useLocalFilter = dimensionData.data.length < TOP_DIMENSIONS_VALUES;

                        // find filter in available values
                        if (vm.scope.filterModel.values) {
                            vm.scope.filterModel.values.forEach((filterValue) => {
                                addRemoveSelectedFilter(filterValue, true);
                            });
                        }
                    }).finally(() => {
                        wasEmitted && vm.scope.$emit('filterready');
                        vm.isSearching = false;
                        vm.scrollToEnd();
                    });
            }
        }
    };

    vm.scope.filterModel.values = vm.scope.filterModel.values || [];
    vm.selected = [];
    vm.scope.filterModel.type = vm.scope.operator;
    vm.scope.availableValues = { values: undefined };

    init();

}

export default SetFilterController;
