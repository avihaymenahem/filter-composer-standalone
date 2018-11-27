import { UrlPatternTypes } from '../../DAL/configuration/FilterConfigurationDAL/FilterConfiguration.consts';
import { createUrlFilter } from '../../DAL/configuration/FilterConfigurationDAL/FilterConfiguraion.utils';
import * as _ from 'lodash';

// let enums = require("app-enums");
let labels = {
    web: {
        add: `Add URL`,
        item_placeholder: `Please enter URL`
    },
    native: {
        add: `Add Screen`,
        item_placeholder: `Please enter screen`
    }
}

export default ($scope, $timeout, DimensionDAL) => {

    let interfaceType;
    $scope.urlTypes = _.map(UrlPatternTypes, 'value');

    $scope.urlTypeSelectConf = {
        settings: {
            required: true,
            btnWidth: '105px',
            template: '{{ externalEvents.getProperty(option) }}'
        },
        events: {
            getProperty: option => _.find(UrlPatternTypes, {
                value: option
            }).label
        }
    };

    $scope.$watch(
        "filterModel",
        newVal => {
            if (!newVal.values) {
                newVal.values = [createFilter($scope.selectedItem.field)];
                newVal.type = $scope.operator;
            }
            $scope.urls = newVal.values.map(
                v => _.find(v.values, {
                    type: "resource"
                })
            )
        },
        true
    );

    $scope.$watch("operator", newVal => $scope.filterModel.type = newVal);

    $scope.removeUrl = (idx) => {
        $scope.filterModel.values.splice(idx, 1);
        if ($scope.filterModel.values.length == 0) {
            $scope.configuration.onEmpty($scope.configuration.idx);
        }
    };

    $scope.addUrl = () => {
        $scope.filterModel.values.push(createFilter($scope.selectedItem.field));
    };

    $scope.getUrlSelectCallback = (idx) => {
        return ($item, $model, $label, $event) => {
            if ($item && $item.name) {
                $scope.urls[idx].value = $item.name;
            }
        }
    };

    $scope.onUrlTyped = (url, event) => {
        url.value = event.name || '';
    };

    $scope.openUrlSuggestionsDialog = (url) => {
        $scope.showSuggestions = true;
        $scope.suggestionsFilterText = {
            value: url.value
        };
        DimensionDAL.getDimensionData('location', null, interfaceType)
            .then((result) => {
                $scope.suggestions = result.data.map((s) => {
                    return Object.assign({}, s, {
                        name: s.value
                    });
                });
                    
                $scope.selectedUrl = url;
            });
    };

    $scope.closeSuggestionModal = (selected) => {
        if (_.get(selected, "value")) {
            $scope.selectedUrl.value = selected.value;
        }
        $scope.suggestions = null;
        $scope.showSuggestions = false;
    };

    $scope.getLocationValues = (url) => {
        return (value) => {
            let patternType = _.get(url, 'patternType');
            return DimensionDAL.getDimensionData(
                'location',
                createFilter($scope.selectedItem.field, value, patternType),
                interfaceType
            ).then(result => {
                $scope.urlSuggestions = {
                    values: result.data.map((q) => ({
                        name: q.value,
                        id: q.value
                    })),
                    filter: value
                };
                return $scope.urlSuggestions.values;
            })
        }
    };

    $scope.isPageSet = () => document.getElementsByTagName("edit-step-modal").length;

    $scope.isPluralURLs = () => $scope.urls.length > 1;

    let createFilter = (field, value, patterType) => {
        let filter = createUrlFilter(field, value, patterType);
        filter.metadata = {
            validatorId: $scope.selectedItem.id
        };
        return filter;
    }

    // initiallizing the filterModel with the needed metadata, this is due to the fact that the vanilla structure is created at the controller level
    let init = () => {
        if ($scope.filterModel.values && $scope.filterModel.values.length == 1 && !$scope.filterModel.values[0].metadata) {
            $scope.filterModel.values[0].metadata = {
                validatorId: $scope.selectedItem.id
            };
        }
        
        /** no apps in sandbox heatmap
         * interfaceType = $ngRedux.getState().appData.activeView.interfaceType;
         * $scope.isWeb = interfaceType === enums.InterfaceType.WEB;
         */
        
        $scope.isWeb = true;
        $scope.labels = labels['web'];
    };

    init();

}