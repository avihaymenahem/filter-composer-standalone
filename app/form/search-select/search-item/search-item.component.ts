import {IComponentController, IComponentOptions, ISCEService} from 'angular';
import {SearchModel} from '../search-select.component';

class SearchItemComponent implements IComponentController {
    static $inject = ['$sce'];

    searchItemComponentCtrl: this;
    labels: { value: string, class: string }[];
    option: SearchModel;
    searchTerm: string;
    additionalLabelsCallback: (item: SearchModel) => { value: string, class: string }[];
    displayProp: string;
    constructor(private $sce: ISCEService) {
    }

    $onInit() {
        this.displayProp = this.displayProp || 'value';
        if(this.additionalLabelsCallback){
            this.labels = this.additionalLabelsCallback(this.option);
        }
    }
    get value() {
        return this.option[this.displayProp];
    }
}

export const searchItemComponentOptions = {
    template: require('./search-item.component.html'),
    controller: SearchItemComponent,
    controllerAs: 'searchItemComponentCtrl',
    transclude: true,
    bindings: {
        selectedPlaceholder: '<',
        isSelected: '<',
        labels: '<',
        option: '<',
        searchTerm: '<',
        additionalLabelsCallback: '<',
        displayProp: '<'
    }
} as IComponentOptions;