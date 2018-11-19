import * as angular from 'angular';
import {searchItemComponentOptions} from './search-item.component';
import './search-item.component.scss';

export const searchItemComponentModule = angular.module('CT.Components.SearchItem', [])
    .component('ctSearchItem', searchItemComponentOptions).name;