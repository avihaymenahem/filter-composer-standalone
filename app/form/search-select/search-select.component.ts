import {IComponentController, IComponentOptions, INgModelController} from 'angular';
import {isEqual} from 'lodash';

export class SearchSelectComponent implements IComponentController {
    searchComponentCtrl = this;
    placeholder: string;
    disabled: boolean;
    options: SearchModel[];
    filteredOptions: SearchModel[];
    noDataPlaceholder: string;
    noFilteredDataPlaceholder: string;
    dropdownClosed = true;
    sort: boolean;
    selectedOption: SearchModel;
    additionalLabelsCallback: (item: SearchModel) => { value: string, class: string }[];
    model: SearchModel;
    displayProp: string;
    events: any;
    private closePrevented: boolean;
    private modelValue: string;
    private ngModel: INgModelController;
    private isActive: boolean = false;

    $onInit() {
        this.filteredOptions = [];
        this.displayProp = this.displayProp || 'value';
        this.modelValue = this.model && this.model[this.displayProp];
        this.selectedOption = this.model;
    }

    selectOption(option: SearchModel) {
        this.selectedOption = option;
        this.modelValue = option[this.displayProp];
        this.ngModel.$setViewValue(option);
        if (this.events) {
            this.events.onItemSelect(option);
        }
        this.dropdownClosed = true;
        this.isActive = true;

    }

    toggleSelect() {
        this.filteredOptions = this.getSortedItems(this.options);
        this.dropdownClosed = !this.dropdownClosed;
    }

    isSelected(option: SearchModel) {
        return isEqual(this.selectedOption, option);
    }

    onFocus() {
        this.dropdownClosed = false;
        if (this.value) {
            this.filteredOptions = this.getSortedItems(this.filter(this[this.displayProp], this.options || []));
        } else {
            this.filteredOptions = this.getSortedItems(this.options);
        }
        this.ngModel.$setTouched();
    }

    onReset() {
        this.modelValue = '';
        this.ngModel.$setViewValue(null);
        this.dropdownClosed = true;
        this.selectedOption = null;
        this.filteredOptions = this.getSortedItems(this.options);
        this.ngModel.$setTouched();
        this.ngModel.$setDirty();
    }

    preventClose() {
        this.closePrevented = true;
    }

    onOutside() {
        if (this.closePrevented) {
            this.closePrevented = false;
            return;
        }
        this.isActive = false;
        this.dropdownClosed = true;
        if (this.modelValue && this.modelValue.length) {
            this.modelValue = this.selectedOption ? this.selectedOption[this.displayProp] : '';
        } else {
            this.modelValue = '';
            this.selectedOption = null;
            this.ngModel.$setViewValue(null);
        }
    }

    onBlur() {
    }

    get additionalLabels() {
        if (this.additionalLabelsCallback) {
            return this.additionalLabelsCallback(this.selectedOption).map(v => v.value).join(' ');
        } else {
            return []
        }

    }

    get value() {
        return this.dropdownClosed && this.selectedOption ? `${this.modelValue} ${this.additionalLabels}` : this.modelValue;
    }

    set value(val: string) {
        this.modelValue = val;
        let filteredOptions = this.filter(val, this.options || []);
        this.filteredOptions = this.getSortedItems(filteredOptions);
        this.ngModel.$setDirty();
    }

    private filter(val: string, options: SearchModel[] = []) {
        return val ? options
            .filter(option => option[this.displayProp].toLowerCase().indexOf(val.toLowerCase()) > -1) : options;
    }

    private getSortedItems(options: SearchModel[]) {
        let newOpts = options || [];
        return this.sort === false ? newOpts : newOpts.sort((a, b) => (a[this.displayProp] || '').localeCompare(b[this.displayProp]));
    }
}

export const SearchSelectComponentOptions = {
    name: 'ctSearchSelect',
    template: require('./search-select.component.html'),
    controller: SearchSelectComponent,
    controllerAs: 'searchComponentCtrl',
    bindings: {
        model: '<ngModel',
        name: '<',
        maxlength: '<',
        placeholder: '@',
        disabled: '<',
        options: '<',
        events: '<',
        noDataPlaceholder: '@',
        noFilteredDataPlaceholder: '@',
        selectedPlaceholder: '@',
        sort: '<',
        additionalLabelsCallback: '<',
        displayProp: '@'
    },
    require: {
        ngModel: 'ngModel'
    }
} as IComponentOptions & { name: string };

export class SearchModel {
    id: string | number;
    value?: string;
    displayName?: string;
}