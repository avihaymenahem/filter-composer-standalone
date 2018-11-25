import './NumericFilterDirective.scss';
import numericFilter from './NumericFilterDirective';

export default angular.module('CT.Components.Filters')
    .directive('numericFilter', numericFilter).name;
