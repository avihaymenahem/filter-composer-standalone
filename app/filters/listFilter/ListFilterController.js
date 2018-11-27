import * as _ from  from 'lodash';

function ListFilterController($scope, DimensionDAL, $element) {
	let ctrl = this;
	ctrl.scope = $scope;
	let interfaceType;

	var onSelectValue = function (item) {
		let newValue = {
			value: item.eventId || item.value,
			type: ctrl.scope.selectedItem.field,
			metadata: {
				validatorId: ctrl.scope.selectedItem.id
			}
		};
		if (ctrl.scope.selectedItem.aggregation && ctrl.scope.selectedItem.aggregation.level != 'pageView') {
			if (ctrl.scope.selectedItem.aggregation.type) newValue.aggregation = ctrl.scope.selectedItem.aggregation.type;
			if (ctrl.scope.selectedItem.aggregation.level) newValue.aggregationLevel = ctrl.scope.selectedItem.aggregation.level;
		}
		ctrl.scope.filterModel.values.push(newValue);
	}

	var onDeselectValue = function (item) {
		_.remove(ctrl.scope.filterModel.values, {value: item.eventId || item.value});
	}


	ctrl.scope.multiselectConfig = {
		settings: {
			smartButtonMaxItems: 3,
			displayProp: 'value',
			idProp: 'value',
			enableSearch: true,
			showCheckAll: false,
			showUncheckAll: false,
			scrollable: true,
			required: true,
			searchField: 'value',
			template: '<div style="display: block" title="{{getPropertyForObject(option, settings.displayProp).concat(\' (\').concat(getPropertyForObject(option, \'count\')).concat(\')\')}}" class="text-ellipsis">{{getPropertyForObject(option, settings.displayProp).concat(\' (\').concat(getPropertyForObject(option, \'count\')).concat(\')\')}}</div>'
		}, events: {
			onItemSelect: onSelectValue,
			onItemDeselect: onDeselectValue,
		}
	};

	let doSearchData = (searchFilter) => {

		if (ctrl.scope.selectedItem && ctrl.scope.selectedItem.field && ctrl.scope.availableValues) {

			let dimension = ctrl.scope.selectedItem.field;
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

	var init = function () {
		let wasEmitted = false;
		if (ctrl.scope.filterModel.values.length ) {
			ctrl.scope.$emit('filterloading');
			wasEmitted = true;
		}
		interfaceType = $ngRedux.getState().appData.activeView.interfaceType;
		DimensionDAL.getDimensionData(ctrl.scope.selectedItem.field, null, interfaceType).then(function (dimensionData) {
			ctrl.scope.availableValues.values = dimensionData.data;
			if (ctrl.scope.filterModel.values) {
				ctrl.scope.filterModel.values.forEach(function (v) {
					// ctrl.scope.value.push(_.filter(ctrl.scope.availableValues.values, {value: v.value})[0]);
					ctrl.scope.value.push(_.find(ctrl.scope.availableValues.values, (o) => {
						return o.eventId == v.value || o.value == v.value
					}));
				});

				// No need for server side search when dealing with 
				// low results count
				const onSearchResults = dimensionData.data.length > 100 ? onSearchResultsValue : angular.noop;
				ctrl.scope.multiselectConfig.events = angular.merge({}, ctrl.scope.multiselectConfig.events, {onSearchResults});
			} else {
				ctrl.scope.filterModel.values = [];
			}

		}).catch(function (e) {
			ctrl.scope.availableValues.values = [];
		}).finally(() => {
			wasEmitted && ctrl.scope.$emit('filterready')
		});
	}

	ctrl.scope.filterModel.values = ctrl.scope.filterModel.values || [];
	ctrl.scope.value = [];
	ctrl.scope.availableValues = {values: undefined}
	ctrl.scope.filterModel.type = ctrl.scope.operator;

	init();
}

export default ListFilterController;