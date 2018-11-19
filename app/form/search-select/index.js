"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_item_1 = require("./search-item");
const search_select_component_1 = require("./search-select.component");
require("./search-select.component.scss");
exports.default = angular.module('CT.Components.SearchSelect', [
    search_item_1.searchItemComponentModule
]).component(search_select_component_1.SearchSelectComponentOptions.name, search_select_component_1.SearchSelectComponentOptions).name;
//# sourceMappingURL=index.js.map