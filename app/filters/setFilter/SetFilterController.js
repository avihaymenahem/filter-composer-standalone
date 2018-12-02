import {filter, remove, get} from 'lodash';

function SetFilterController($scope, DimensionDAL, $element) {
    let ctrl = this;
    ctrl.scope = $scope;
    const REQ_INTERVAL = 200;
    let lastReqTime = undefined;
    let searchBufferTimeout;
	let interfaceType;
	const searchableDimensions = ['dynamicAction', 'pageAttribute', 'visitDynamicAction', 'visitPageAttribute'];

	const CREATE_METHODS = {
		STATIC: "static",
		DYNAMIC: "dynamic"
	};

	const DIMENSIONS = {
		PAGE_ATTR: "pageAttribute",
		ACTION: "action"
	};

	let doSearchData = (searchFilter) => {

		if (ctrl.scope.selectedItem && ctrl.scope.selectedItem.dataType && ctrl.scope.availableValues) {

			let dimension = ctrl.scope.selectedItem.dataType;
			let checkedItems = ctrl.scope.value;

			ctrl.scope.availableValues = {values: undefined};

			DimensionDAL.getSearchData(dimension, searchFilter, interfaceType).then(function (searchData) {
				if (searchData && searchData.data) {

					ctrl.scope.availableValues.values = searchData.data;

					if (checkedItems && checkedItems instanceof Array) {
						checkedItems = checkedItems.map(function (item) {//convert to string array
							if (item) {
								return item.value;
							}
						});

						if (ctrl.scope.availableValues.values && ctrl.scope.availableValues.values instanceof Array) {
							ctrl.scope.availableValues.values.forEach(function (item) {
								if (item && checkedItems.indexOf(item.value) > -1) {
									item.checked = true;
								}
							});
						}
					}
				}
			});
		}
	};

	let onSearchResultsValue = (searchFilter) => {

		let startTime = Date.now();
		let timeDelta = startTime - (lastReqTime || startTime);

		if (lastReqTime && (timeDelta < REQ_INTERVAL)) { // if the current request time is less than REQ_INTERVAL, buffer it until the REQ_INTERVAL will end
			clearTimeout(searchBufferTimeout);
			searchBufferTimeout = setTimeout(doSearchData(searchFilter), REQ_INTERVAL - timeDelta);
			ctrl.scope.availableValues = {values: undefined};
		} else {
			doSearchData(searchFilter);
		}
		lastReqTime = startTime;
	};


	let onSelectValue = function (item) {
		let newFilterValue = {};
		newFilterValue.metadata = {validatorId: ctrl.scope.selectedItem.id, optional: item.metadata};

		if (item.metadata.createMethod === CREATE_METHODS.STATIC) {
			newFilterValue.value = Number(item.eventId);
			newFilterValue.type = 'event'; //if it's static the type is always 'event' for all dimensions

			if (item.eventType) newFilterValue.eventType = item.eventType;

		} else if (item.metadata.createMethod === CREATE_METHODS.DYNAMIC) {
			if (item.metadata.dimension === DIMENSIONS.ACTION) {
				newFilterValue.type = 'dynamicAction';
			} else if (item.metadata.dimension === DIMENSIONS.PAGE_ATTR) {
				newFilterValue.type = 'pageAttribute';
			}
			newFilterValue.value = item.value;
		}

		if (ctrl.scope.selectedItem.aggregation) {
			if (ctrl.scope.selectedItem.aggregation.type) newFilterValue.aggregation = ctrl.scope.selectedItem.aggregation.type;
			if (ctrl.scope.selectedItem.aggregation.level) newFilterValue.aggregationLevel = ctrl.scope.selectedItem.aggregation.level;
		}
		else {
			newFilterValue.aggregationLevel = item.aggregationLevel ? item.aggregationLevel : 'pageView'; //aggregation level is required, the default is pageView
		}

		if (!ctrl.scope.filterModel.values) {
			ctrl.scope.filterModel.values = [];
			ctrl.scope.filterModel.type = ctrl.scope.operator;
		}
		ctrl.scope.filterModel.values.push(newFilterValue);
	};

	let onDeselectValue = function (item) {
		item.eventId ? remove(ctrl.scope.filterModel.values, {value: Number(item.eventId)}) : remove(ctrl.scope.filterModel.values, {value: item.value});
	};

	ctrl.scope.multiselectConfig = {
		settings: {
			smartButtonMaxItems: 3,
			displayProp: 'value',
			idProp: 'eventId',
			externalIdProp: '',
			enableSearch: true,
			showCheckAll: false,
			showUncheckAll: false,
			scrollable: true,
			required: true,
			searchField: 'value',
			template: '<span style="display: block" title="{{getPropertyForObject(option, settings.displayProp).concat(\' (\').concat(getPropertyForObject(option, \'count\')).concat(\')\')}}" class="text-ellipsis">{{getPropertyForObject(option, settings.displayProp).concat(\' (\').concat(getPropertyForObject(option, \'count\')).concat(\')\')}}<span>'
		}, events: {
			onItemSelect: onSelectValue,
			onItemDeselect: onDeselectValue,
			onSearchResults: searchableDimensions.includes(ctrl.scope.selectedItem.dataType) ? onSearchResultsValue : angular.noop

		}
	};

	let getDimensionType = (dataType) => {
		if (dataType === 'pageAttribute' || dataType === 'visitPageAttribute') return DIMENSIONS.PAGE_ATTR
		else if (dataType === 'dynamicAction' || dataType === 'visitDynamicAction') return DIMENSIONS.ACTION
		return null;
	}

	let init = function () {
		interfaceType = web;//$ngRedux.getState().appData.activeView.interfaceType;
		let dimension = "";

		if (ctrl.scope.selectedItem) {
			// should be deprecated
			dimension = ctrl.scope.selectedItem.dataType === 'event' ? 'events' : ctrl.scope.selectedItem.dataType; //dataTypes are the dimension to request, in the case of 'event' the server expects a request for 'events'
			if (dimension) {

				let wasEmitted = false;
				if (ctrl.scope.filterModel.values.length) {
					ctrl.scope.$emit('filterloading');
					wasEmitted = true;
				}
				DimensionDAL.getDimensionData(dimension, null, interfaceType).then(function (dimensionData) {
					ctrl.scope.availableValues.values = dimensionData.data;

					// No need for server side search when dealing with
					// low results count
					let onSearchResults;
					if (dimensionData.data.length < 100) {
						onSearchResults = angular.noop;
					} else {
						onSearchResults = searchableDimensions.includes(ctrl.scope.selectedItem.field) ? onSearchResultsValue : angular.noop;
					}
					ctrl.scope.multiselectConfig.events = angular.merge({}, ctrl.scope.multiselectConfig.events, {onSearchResults});

					//find filter in available values
					if (ctrl.scope.filterModel.values) {
						ctrl.scope.filterModel.values.forEach(function (v) {

							if (get(v.metadata, 'optional.createMethod') === CREATE_METHODS.STATIC) {
								ctrl.scope.value.push(filter(ctrl.scope.availableValues.values, {eventId: v.value})[0])
							} else {
								// in case that the dynamic item wasn't included in the response add it to the list with count 0 so it could be listed on the component
								let dynamicFilter = filter(ctrl.scope.availableValues.values, {value: v.value})[0] || {
									value: v.value,
									count: 0,
									metadata: {createMethod: CREATE_METHODS.DYNAMIC, dimension: getDimensionType(ctrl.scope.selectedItem.dataType)}
								};
								ctrl.scope.value.push(dynamicFilter);
							}
						});
					}

				}).catch(()=>{
                    ctrl.scope.availableValues.values = [];
				}).finally(() => {
					wasEmitted && ctrl.scope.$emit('filterready')
				});
			}

		}
	};

	ctrl.scope.filterModel.values = ctrl.scope.filterModel.values || [];
	ctrl.scope.value = [];
	ctrl.scope.filterModel.type = ctrl.scope.operator;
	ctrl.scope.availableValues = {values: undefined};

	init();
}

export default SetFilterController;