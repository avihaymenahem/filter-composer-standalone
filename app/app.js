import 'babel-polyfill';
import '../assets/css/bootstrap-loader.scss';
import '../assets/css/main.scss';

import mainController from './main.controller.js';

require('ui-select');
require('ui-select/dist/select.css');
require('angular-ui-bootstrap');

import loader from './loader';
import clickOutside from './clickOutside';

import ctDropdown from './form/dropdown';

import filterComposer from './filters/filterComposer';
import basicFilter from './filters/basicFilter';
import csvFilter from './filters/CSVFilter';
import numericFilter from './filters/numericFilter';
import percentageFilter from './filters/percentageFilter';
import secondsFilter from './filters/secondsFilter';
import formComponents from './form';

let components = [
    'ui.bootstrap',
    'ui.select',
    clickOutside,
    filterComposer, 
    basicFilter,
    csvFilter,
    numericFilter,
    percentageFilter,
    loader,
    ctDropdown,
    ...formComponents
]

export default angular.module('CT', components)
    .controller('mainController', mainController)
