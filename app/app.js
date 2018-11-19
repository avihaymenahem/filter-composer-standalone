import 'babel-polyfill';
import './assets/css/bootstrap-loader.scss';
import './assets/css/main.scss';

import mainController from './main.controller.js';
import filterComposer from './filters/filterComposer';

export default angular.module('example', [filterComposer])
    .controller('mainController', mainController)
