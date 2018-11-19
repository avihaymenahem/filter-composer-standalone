import * as _ from 'lodash';

function FilterComposerController($scope) {
    let ctrl = this;
    ctrl.scope = $scope;

    ctrl.scope.loadingFilters = 0;

    ctrl.scope.$on('filterloading', () => {
        ctrl.scope.loadingFilters++;
    });

    ctrl.scope.$on('filterready', () => {
        ctrl.scope.loadingFilters--;
    });

    ctrl.scope.onAddIncludeFilter = function () {
        if (!ctrl.scope.includedFilters) {
            if (!ctrl.scope.filtersModel.values) _.assign(ctrl.scope.filtersModel, {
                type: "AND",
                values: []
            });
            ctrl.scope.filtersModel.values.push({
                type: "AND",
                values: []
            });
            ctrl.scope.includedFilters = _.chain(ctrl.scope.filtersModel).get('values').filter({
                type: 'AND'
            }).first().get('values').value();
        }
        ctrl.scope.includedFilters.push({});
    };

    ctrl.scope.onAddExcludeFilter = function () {
        if (!ctrl.scope.excludedFilters) {
            if (!ctrl.scope.filtersModel.values) _.assign(ctrl.scope.filtersModel, {
                type: "AND",
                values: []
            });
            ctrl.scope.filtersModel.values.push({
                type: "NOT",
                values: [{
                    type: "AND",
                    values: []
                }]
            });
            ctrl.scope.excludedFilters = _.chain(ctrl.scope.filtersModel).get('values').filter({
                type: 'NOT'
            }).first().get('values').filter({
                type: 'AND'
            }).first().get('values').value();
        }
        ctrl.scope.excludedFilters.push({});
    };

    ctrl.scope.showRemoveFilter = () => {
        return (get(ctrl, "scope.excludedFilters.length") || 0) + (get(ctrl, "scope.includedFilters.length") || 0) > 1;
    };

    ctrl.scope.isLocationFilter = (filterModel) => {
        if (!filterModel.type) return;

        const logicalOperatorsLabels = {
            "OR": "is one of",
            "AND": "is all of"
        };

        let filterId;
        let selectedItem;
        if (_.keys(logicalOperatorsLabels).indexOf(filterModel.type) >= 0 && filterModel.values && filterModel.values.length > 0) {
            //assuming that all from the same type
            filterId = {
                id: get(filterModel.values[0], 'metadata.validatorId')
            };
        } else {
            filterId = {
                id: get(filterModel, 'metadata.validatorId')
            };
        }
        selectedItem = ctrl.scope.filtersList ? filter(ctrl.scope.filtersList, filterId)[0] || (ctrl.scope.filtersList.length == 1 ? ctrl.scope.filtersList[0] : undefined) : undefined;

        return selectedItem && selectedItem.dataType === 'location';
    }

    ctrl.scope.includedConfiguration = Object.assign({},
        $scope.configuration, {
            onEmpty: () => {
                // check if equals one, since location filter counts as one
                if (ctrl.scope.includedFilters.length == 1) {
                    delete ctrl.scope.includedFilters;
                    _.remove(ctrl.scope.filtersModel.values, {
                        type: "AND"
                    });
                }
            },
            showClose: () => ctrl.scope.showRemoveFilter()
        }
    );

    ctrl.scope.excludedConfiguration = Object.assign({},
        $scope.configuration, {
            onEmpty: () => {
                // check if equals one, since location filter counts as one
                if (ctrl.scope.excludedFilters.length == 1) {
                    delete ctrl.scope.excludedFilters;
                    _.remove(ctrl.scope.filtersModel.values, {
                        type: "NOT"
                    });
                }
            },
            showClose: () => ctrl.scope.showRemoveFilter()
        }
    );

    ctrl.scope.onRemoveIncluded = (idx) => {
        ctrl.scope.includedFilters.splice(idx, 1);
        if (ctrl.scope.includedFilters.length == 0) {
            delete ctrl.scope.includedFilters;
            _.remove(ctrl.scope.filtersModel.values, {
                type: "AND"
            });
        }
    };

    ctrl.scope.onRemoveExcluded = (idx) => {
        ctrl.scope.excludedFilters.splice(idx, 1);
        if (ctrl.scope.excludedFilters.length == 0) {
            delete ctrl.scope.excludedFilters;
            _.remove(ctrl.scope.filtersModel.values, {
                type: "NOT"
            });
        }
    };

    // ---- close-filter-icon styled ----
    // ctrl.scope.locationStyleObj = {
    //     "position": "relative",
    //     "top": "-12px"
    // };

    ctrl.scope.isSegments = () => {
        if (ctrl.scope.$parent && ctrl.scope.$parent.segmentType) {
            return ctrl.scope.$parent.segmentType === "segment";
        } else if (ctrl.scope.$parent && ctrl.scope.$parent.influencingSegmentType) {
            return ctrl.scope.$parent.influencingSegmentType === "customSegment";
        }

        return false;
    };

    ctrl.scope.isPluralURLs = (index, filterType) => {
        if (index >= 0) {
            let counter = 0;

            if (filterType === "included" && ctrl.scope.includedFilters && ctrl.scope.includedFilters.constructor === Array && ctrl.scope.includedFilters[index].values && ctrl.scope.includedFilters[index].values.constructor === Array) {
                let includedFiltersValuesArr = ctrl.scope.includedFilters[index].values;

                includedFiltersValuesArr.forEach(function (item) {
                    if (item && _.filter(ctrl.scope.filtersList, {
                            id: item.metadata.validatorId
                        })[0].dataType === "location") {
                        counter++;
                    }
                });
            } else if (filterType === "excluded" && ctrl.scope.excludedFilters && ctrl.scope.excludedFilters.constructor === Array && ctrl.scope.excludedFilters[index].values && ctrl.scope.excludedFilters[index].values.constructor === Array) {
                let excludedFiltersValuesArr = ctrl.scope.excludedFilters[index].values;

                excludedFiltersValuesArr.forEach(function (item) {
                    if (item && _.filter(ctrl.scope.filtersList, {
                            id: item.metadata.validatorId
                        })[0].dataType === "location") {
                        counter++;
                    }
                });
            }

            if (counter > 1) {
                return true;
            }
        }

        return false;
    };
}

export default FilterComposerController;