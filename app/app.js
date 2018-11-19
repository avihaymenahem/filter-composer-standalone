import 'babel-polyfill';
import '../assets/css/bootstrap-loader.scss';
import '../assets/css/main.scss';

import mainController from './main.controller.js';

import filterComposer from './filters/filterComposer';
import basicFilter from './filters/basicFilter';
import formComponents from './form';

let components = [
    filterComposer, 
    basicFilter
]

components = components.concat(formComponents)

export default angular.module('example', components)
    .controller('mainController', mainController)
