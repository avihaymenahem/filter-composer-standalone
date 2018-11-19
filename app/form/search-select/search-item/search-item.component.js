"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SearchItemComponent {
    constructor($sce) {
        this.$sce = $sce;
    }
    $onInit() {
        this.displayProp = this.displayProp || 'value';
        if (this.additionalLabelsCallback) {
            this.labels = this.additionalLabelsCallback(this.option);
        }
    }
    get value() {
        return this.option[this.displayProp];
    }
}
SearchItemComponent.$inject = ['$sce'];
exports.searchItemComponentOptions = {
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
};
//# sourceMappingURL=search-item.component.js.map