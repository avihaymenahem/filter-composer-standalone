/** sryles */
import '../assets/css/bootstrap-loader.scss';
import '../assets/css/main.scss';

/** vendors */
import 'babel-polyfill';
require('ui-select');
require('ui-select/dist/select.css');
require('angular-ui-bootstrap');

/** app */
import mainController from './main.controller.js';

/** common */
import loader from './loader';
import clickOutside from './clickOutside';

/** DAL */
import DimensionDAL from './DAL/DimensionDAL';

/** form */
import formComponents from './form';

/** filters */
// import filterComposer from './filters/filterComposer';
// import basicFilter from './filters/basicFilter';
// import csvFilter from './filters/CSVFilter';
// import numericFilter from './filters/numericFilter';
// import percentageFilter from './filters/percentageFilter';
// import secondsFilter from './filters/secondsFilter';
// import booleanFilter from './filters/Boolean';
import filters from './filters';

let components = [
    'ui.bootstrap',
    'ui.select',
    DimensionDAL,
    clickOutside,
    loader,
    ...filters,
    ...formComponents
]

export default angular.module('CT', components)
    .controller('mainController', mainController)
