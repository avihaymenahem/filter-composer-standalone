import * as angular from 'angular';
import {searchItemComponentModule} from './search-item';
import {SearchSelectComponentOptions} from './search-select.component';
import './search-select.component.scss';

export default angular.module('CT.Components.SearchSelect', [
    searchItemComponentModule
]).component(SearchSelectComponentOptions.name, SearchSelectComponentOptions).name;