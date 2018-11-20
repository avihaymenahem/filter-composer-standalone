import { findIndex } from 'lodash';
import Utils from '../common/DropdownUtils';

let dropdownMultiSelect = ($filter, $document, $compile, $parse) => {
    return {
        restrict: 'AE',
        scope: {
            selectedModel: '=',
            options: '=',
            extraSettings: '=',
            events: '=',
            searchFilter: '=?',
            translationTexts: '=',
            groupBy: '@',
            disabled: "="
        },
        template: function (element, attrs) {
            var checkboxes = attrs.checkboxes ? true : false;
            var groups = attrs.groupBy ? true : false;

            const groupsTp = groups ? `
                <li ng-repeat-start="option in orderedItems | filter:getFilter(input.searchFilter)" 
                    ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" 
                    role="presentation" 
                    class="dropdown-header">
                    {{ getGroupLabel(getPropertyForObject(option, settings.groupBy)) }}
                </li>
                <li ng-class="{'active': isChecked(option) && settings.styleActive}" ng-repeat-end role="presentation">
            ` : `<li ng-class="{'active': isChecked(option) && settings.styleActive}" role="presentation" ng-repeat="option in options | filter:getFilter(input.searchFilter)">`;
            
            const checkboxesTp = checkboxes ? `
                    <a ng-keydown="option.disabled || keyDownLink($event)" 
                    role="menuitem" 
                    class="option" 
                    tabindex="-1" 
                    ng-click="option.disabled || setSelectedItem(false, true, option)" 
                    ng-disabled="option.disabled">
                        <div class="checkbox">
                            <input class="checkboxInput iconFont" 
                                ng-class="isChecked(option) ? 'checkbox-on' : 'checkbox-off'" 
                                type="checkbox" 
                                ng-click="checkboxClick($event, option)" ng-checked="isChecked(option)"> 
                            <span class="checkboxLabel" style="display: inline-block" ct-dropdown-static-include="{{settings.template}}"></span>
                        </div>
                    </a>
                </li>
            ` : `   
                    <a ng-keydown="option.disabled || keyDownLink($event)" 
                    role="menuitem" 
                    class="option" tabindex="-1" ng-click="option.disabled || setSelectedItem(false, true, option)" 
                    ng-disabled="option.disabled">
                        <span data-ng-class="{'glyphicon glyphicon-ok': isChecked(option)}"> </span>
                        <span style="display: inline-block" ct-dropdown-static-include="{{settings.template}}"></span>
                    </a>
                </li>
            `;

            const tp = `
                <div class="multiselect-parent btn-group ct-dropdown m-r-m" ng-class="{'open': open}">
                    <input ng-if="settings.required" type="hidden" hidden ng-required="settings.required" ng-model="selectedModel[0]" value="{{selectedModel[0]}}"></input>
                    <button aria-haspopup="true" ng-disabled="disabled" type="button" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">
                        <span class="ct-dropdown-btn-text text-ellipsis">{{getButtonText()}}</span>&nbsp;<span class="icon-font down-arrow"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-form"  ng-style="{display: open ? 'block' : 'none', 'width': '567px'}">
                        <div ng-if="settings.enableSearch">
                            <div class="dropdown-header">
                                <input type="text" 
                                       class="search-field" 
                                       ng-keydown="keyDownSearchDefault($event); keyDownSearch($event, input.searchFilter);" 
                                       ng-style="{width: '100%'}" 
                                       ng-keyup="onSearchResults(input.searchFilter, options);"
                                       ng-model="input.searchFilter" 
                                       placeholder="{{texts.searchPlaceholder}}">
                            </div>
                        </div>
                        <ct-loader loading="!options"></ct-loader>
                        <div ng-if="options.length === 0">
                            <div style="position:relative; left:0; margin: 10px; width:100%; text-align:left; line-height: 2; font-size:13px;" ng-style="{'max-height' : settings.scrollable ? settings.scrollableHeight : 'auto', height: settings.scrollableHeight ? settings.scrollableHeight : 'auto'}">No results found</div>
                        </div>
                        <ul class="items" ng-if="open" ng-style="{'max-height' : settings.scrollable ? settings.scrollableHeight : 'auto', overflow: 'auto' }">
                            <li ng-if="settings.showCheckAll && settings.selectionLimit !== 1">
                                <a ng-keydown="keyDownLink($event)" data-ng-click="selectAll()" tabindex="-1" id="selectAll">
                                    <span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}
                                </a>
                            </li>
                            <li ng-if="settings.showUncheckAll">
                                <a ng-keydown="keyDownLink($event)" data-ng-click="deselectAll();" tabindex="-1" id="deselectAll">
                                    <span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}
                                </a>
                            </li>
                            <li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>
                            <li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>
                            <li ng-repeat="currentGroup in settings.selectByGroups track by $index" ng-click="selectCurrentGroup(currentGroup)">
                                <a ng-class="{'dropdown-selected-group': selectedGroup === currentGroup}" tabindex="-1">
                                    {{::texts.selectGroup}} {{::getGroupLabel(currentGroup)}}
                                </a>
                            </li>
                            <li ng-if="settings.selectByGroups && settings.showEnableSearchButton" class="divider"></li>
                            <li ng-if="settings.showEnableSearchButton && settings.enableSearch">
                                <a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">
                                    {{texts.disableSearch}}
                                </a>
                            </li>
                            <li ng-if="settings.showEnableSearchButton && !settings.enableSearch">
                                <a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">
                                    {{texts.enableSearch}}
                                </a>
                            </li>
                            <li ng-if="(settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll || settings.showEnableSearchButton" class="divider"></li>
                            ${groupsTp}
                            ${checkboxesTp}
                            <li class="divider" ng-show="settings.selectionLimit > 1"></li>
                            <li role="presentation" ng-show="settings.selectionLimit > 1">
                                <a role="menuitem">
                                    {{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            `;

            element.html(tp);
        },
        link: function ($scope, $element, $attrs) {
            let $dropdownTrigger = $element.children()[0];

            $scope.toggleDropdown = function () {
                $scope.open = !$scope.open;
                Utils.dropDownFixPosition($element.find('button')[0], $element[0].getElementsByClassName('dropdown-menu')[0]);
                if ($scope.settings.keyboardControls) {
                    if ($scope.open) {
                        if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
                            setTimeout(function () {
                                angular.element($element)[0].querySelector('.searchField').focus();
                            }, 0);
                        } else {
                            setTimeout(function () {
                                angular.element($element)[0].querySelector('.option').focus();
                            }, 0);
                        }
                    }
                }
            };

            $scope.checkboxClick = function ($event, option) {
                $scope.setSelectedItem(false, true, option);
                $event.stopImmediatePropagation();
            };

            $scope.externalEvents = {
                onItemSelect: angular.noop,
                onItemDeselect: angular.noop,
                onSelectAll: angular.noop,
                onDeselectAll: angular.noop,
                onInitDone: angular.noop,
                onMaxSelectionReached: angular.noop,
                onSelectionChanged: angular.noop,
                onSearchResults: angular.noop
            };

            $scope.settings = {
                dynamicTitle: true,
                scrollable: false,
                scrollableHeight: '217px',
                closeOnBlur: true,
                displayProp: 'label',
                idProp: 'id', //not actually used
                externalIdProp: 'id', //not actually used
                enableSearch: false,
                selectionLimit: 0,
                showCheckAll: true,
                showUncheckAll: true,
                showEnableSearchButton: false,
                closeOnSelect: false,
                buttonClasses: 'ct-dropdown-btn',
                closeOnDeselect: false,
                groupBy: $attrs.groupBy || undefined,
                groupByTextProvider: null,
                smartButtonMaxItems: 0,
                smartButtonTextConverter: angular.noop,
                styleActive: false,
                keyboardControls: false,
                template: '{{getPropertyForObject(option, settings.displayProp)}}',
                searchField: '$',
                required: false
            };

            $scope.texts = {
                checkAll: 'Check All',
                uncheckAll: 'Uncheck All',
                selectionCount: 'checked',
                selectionOf: '/',
                searchPlaceholder: 'Search...',
                buttonDefaultText: 'Select',
                dynamicButtonTextSuffix: 'checked',
                disableSearch: 'Disable search',
                enableSearch: 'Enable search',
                selectGroup: 'Select all:'
            };

            $scope.input = {
                searchFilter: $scope.searchFilter || ''
            };

            if (angular.isDefined($scope.settings.groupBy)) {
                $scope.$watch('options', function (newValue) {
                    if (angular.isDefined(newValue)) {
                        $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                    }
                });
            }

            $scope.selectCurrentGroup = function (currentGroup) {
                $scope.selectedModel = [];
                if ($scope.orderedItems) {
                    $scope.orderedItems.forEach(function (item) {
                        if (item[$scope.groupBy] === currentGroup) {
                            $scope.setSelectedItem(false, false, item);
                        }
                    });
                }
                $scope.externalEvents.onSelectionChanged();
            };

            angular.extend($scope.settings, $scope.extraSettings || []);
            angular.extend($scope.texts, $scope.translationTexts);


            // We update the events in set and list filters to fire onSearchResults
            // only when there are many results (100)
            $scope.$watch('events', function (newValue) {
                angular.extend($scope.externalEvents, $scope.events || []);
            });
                

            $scope.singleSelection = $scope.settings.selectionLimit === 1;

            if ($scope.singleSelection && $scope.selectedModel.length > 1) {
                $scope.selectedModel = $scope.selectedModel[0];
            }

            if ($scope.settings.closeOnBlur) {
                $document.on('click', function (e) {
                    if ($scope.open) {
                        let target = e.target.parentElement;
                        let parentFound = false;

                        while (angular.isDefined(target) && target !== null && !parentFound) {
                            if (!!target.className.split && contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                if (target === $dropdownTrigger) {
                                    parentFound = true;
                                }
                            }
                            target = target.parentElement;
                        }

                        if (!parentFound) {
                            $scope.$apply(function () {
                                $scope.open = false;
                            });
                        }
                    }
                });
            }

            $scope.getGroupLabel = function (groupValue) {
                if ($scope.settings.groupByTextProvider !== null) {
                    return $scope.settings.groupByTextProvider(groupValue);
                }

                return groupValue;
            };

            $scope.getButtonText = function () {
                if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && Object.keys($scope.selectedModel).length > 0))) {
                    if ($scope.settings.smartButtonMaxItems > 0) {
                        let itemsText = [];

                        if ($scope.selectedModel instanceof Array) {
                            $scope.selectedModel.forEach(function (item) {
                                if (item) {
                                    itemsText.push(item.value);
                                }
                            });
                        }
                        // text-ellipsis native 
                        // if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                        //     itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                        //     itemsText.push('...');
                        // }

                        return itemsText.join(', ');
                    } else {
                        let totalSelected = $scope.selectedModel ? $scope.selectedModel.length : 0;

                        if (totalSelected === 0) {
                            return $scope.texts.buttonDefaultText;
                        } else {
                            return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                        }
                    }
                } else {
                    return $scope.texts.buttonDefaultText;
                }
            };

            $scope.getPropertyForObject = function (object, property) {
                if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                    return object[property];
                }

                return '';
            };

            $scope.selectAll = function () {
                let searchResult;
                $scope.deselectAll(true);
                $scope.externalEvents.onSelectAll();

                searchResult = $filter('filter')($scope.options, $scope.getFilter($scope.input.searchFilter));
                angular.forEach(searchResult, function (value) {
                    $scope.setSelectedItem(true, false, value);
                });
                $scope.externalEvents.onSelectionChanged();
                $scope.selectedGroup = null;
            };

            $scope.deselectAll = function (dontSendEvent) {
                dontSendEvent = dontSendEvent || false;

                if (!dontSendEvent) {
                    $scope.externalEvents.onDeselectAll();
                }

                $scope.selectedModel = [];

                if (!dontSendEvent) {
                    $scope.externalEvents.onSelectionChanged();
                }
                $scope.selectedGroup = null;
            };

            $scope.setSelectedItem = function (dontRemove, fireSelectionChange, option) {
                let finalObj = option;
                let exists = undefined;
                let optionChecked = false;

                if (option.checked) {
                    optionChecked = true;
                    finalObj.checked = false;
                    exists = true;
                }

                if ($scope.singleSelection) {
                    if ($scope.selectedModel[0]) $scope.externalEvents.onItemDeselect($scope.selectedModel[0]);
                    $scope.selectedModel = [];
                    $scope.selectedModel.push(finalObj);
                    $scope.externalEvents.onItemSelect(finalObj);
                    if ($scope.settings.closeOnSelect || $scope.settings.closeOnDeselect) $scope.open = false;
                } else {

                    dontRemove = dontRemove || false;
                    if (!optionChecked) {
                        exists = $scope.isChecked(finalObj);
                    }

                    if (!dontRemove && exists) {
                        const newModel = _.reject($scope.selectedModel, (item) => {
                            if (item.eventId) {
                                return item.eventId === option.eventId;
                            } 
                            if (item.value) {
                                return item.value === option.value;
                            }
                        });

                        $scope.selectedModel = newModel;
                        $scope.externalEvents.onItemDeselect(finalObj);
                        if ($scope.settings.closeOnDeselect) $scope.open = false;
                    } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                        $scope.selectedModel.push(finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                        if ($scope.settings.closeOnSelect) $scope.open = false;
                        if ($scope.settings.selectionLimit > 0 && $scope.selectedModel.length === $scope.settings.selectionLimit) {
                            $scope.externalEvents.onMaxSelectionReached();
                        }
                    }
                }
                if (fireSelectionChange) {
                    $scope.externalEvents.onSelectionChanged();
                }
                $scope.selectedGroup = null;
            };

            $scope.isChecked = function (option) {
                if (option && option.checked) {
                    return true;
                }
                return findIndex($scope.selectedModel, option) !== -1;
            };

            $scope.externalEvents.onInitDone();

            $scope.keyDownLink = function (event) {
                let sourceScope = angular.element(event.target).scope();
                let nextOption;
                let parent = event.target.parentNode;
                if (!$scope.settings.keyboardControls) {
                    return;
                }
                if (event.keyCode === 13 || event.keyCode === 32) { // enter
                    event.preventDefault();
                    if (!!sourceScope.option) {
                        $scope.setSelectedItem(false, true, sourceScope.option);
                    } else if (event.target.id === 'deselectAll') {
                        $scope.deselectAll();
                    } else if (event.target.id === 'selectAll') {
                        $scope.selectAll();
                    }
                } else if (event.keyCode === 38) { // up arrow
                    event.preventDefault();
                    if (!!parent.previousElementSibling) {
                        nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
                    }
                    while (!nextOption && !!parent) {
                        parent = parent.previousElementSibling;
                        if (!!parent) {
                            nextOption = parent.querySelector('a') || parent.querySelector('input');
                        }
                    }
                    if (!!nextOption) {
                        nextOption.focus();
                    }
                } else if (event.keyCode === 40) { // down arrow
                    event.preventDefault();
                    if (!!parent.nextElementSibling) {
                        nextOption = parent.nextElementSibling.querySelector('a') || parent.nextElementSibling.querySelector('input');
                    }
                    while (!nextOption && !!parent) {
                        parent = parent.nextElementSibling;
                        if (!!parent) {
                            nextOption = parent.querySelector('a') || parent.querySelector('input');
                        }
                    }
                    if (!!nextOption) {
                        nextOption.focus();
                    }
                } else if (event.keyCode === 27) {
                    event.preventDefault();

                    $scope.toggleDropdown();
                }
            };

            $scope.keyDownSearchDefault = function (event) {
                let parent = event.target.parentNode.parentNode;
                let nextOption;
                if (!$scope.settings.keyboardControls) {
                    return;
                }
                if (event.keyCode === 9 || event.keyCode === 40) { //tab
                    event.preventDefault();
                    setTimeout(function () {
                        angular.element($element)[0].querySelector('.option').focus();
                    }, 0);
                } else if (event.keyCode === 38) {
                    event.preventDefault();
                    if (!!parent.previousElementSibling) {
                        nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
                    }
                    while (!nextOption && !!parent) {
                        parent = parent.previousElementSibling;
                        if (!!parent) {
                            nextOption = parent.querySelector('a') || parent.querySelector('input');
                        }
                    }
                    if (!!nextOption) {
                        nextOption.focus();
                    }
                } else if (event.keyCode === 27) {
                    event.preventDefault();

                    $scope.toggleDropdown();
                }
            };

            $scope.keyDownSearch = function (event, searchFilter) {
                let searchResult;
                if (!$scope.settings.keyboardControls) {
                    return;
                }
                if (event.keyCode === 13) {
                    if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
                        searchResult = $filter('filter')($scope.options, $scope.getFilter(searchFilter));
                        if (searchResult.length === 1) {
                            $scope.setSelectedItem(false, true, searchResult);
                        }
                    } else if ($scope.settings.enableSearch) {
                        $scope.selectAll();
                    }
                }
            };

            $scope.getFilter = function (searchFilter) {
                if (!$scope.externalEvents.onSearchResults) { //if pageAttribute we search by server
                    return;
                }

                let filter = {};
                filter[$scope.settings.searchField] = searchFilter;
                return filter;

            };

            $scope.toggleSearch = function ($event) {
                if ($event) {
                    $event.stopPropagation();
                }
                $scope.settings.enableSearch = !$scope.settings.enableSearch;
                if (!$scope.settings.enableSearch) {
                    $scope.input.searchFilter = '';
                }
            };

            $scope.keyDownToggleSearch = function () {
                if (!$scope.settings.keyboardControls) {
                    return;
                }
                if (event.keyCode === 13) {
                    $scope.toggleSearch();
                    if ($scope.settings.enableSearch) {
                        setTimeout(
                            function () {
                                angular.element($element)[0].querySelector('.searchField').focus();
                            }, 0
                        );
                    } else {
                        angular.element($element)[0].querySelector('.option').focus();
                    }
                }
            };

            $scope.onSearchResults = function (searchFilter, orderItems) {
                if ($scope.externalEvents.onSearchResults instanceof Function && $scope.externalEvents.onSearchResults.name !== "noop") {
                    $scope.externalEvents.onSearchResults(searchFilter);
                }
            };
        }
    };
};

function contains(collection, target) {
    let containsTarget = false;
    collection.some(function (object) {
        if (object === target) {
            containsTarget = true;
            return true;
        }
    });
    return containsTarget;
}

export default dropdownMultiSelect;