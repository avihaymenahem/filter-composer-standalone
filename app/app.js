/** NOTE: Order is important here, do not change */

/** sryles */
import '../assets/css/bootstrap-loader.scss';
import '../assets/css/main.scss';

/** vendors */
import 'babel-polyfill';
require('angular-ui-bootstrap');
require('ui-select');
require('ui-select/dist/select.css');
import 'angular-sanitize';


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
import filters from './filters';

const components = [
    'ngSanitize',
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
