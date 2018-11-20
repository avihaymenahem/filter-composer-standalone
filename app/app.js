import 'babel-polyfill';
import '../assets/css/bootstrap-loader.scss';
import '../assets/css/main.scss';

import mainController from './main.controller.js';

require('ui-select');
require('ui-select/dist/select.css');

import loader from './loader';

import filterComposer from './filters/filterComposer';
import basicFilter from './filters/basicFilter';
import csvFilter from './filters/CSVFilter';

import formComponents from './form';
import clickOutside from './clickOutside';


let components = [
    'ui.select',
    clickOutside,
    filterComposer, 
    basicFilter,
    csvFilter,
    loader,
    ...formComponents
]

export default angular.module('CT', components)
    .controller('mainController', mainController)
