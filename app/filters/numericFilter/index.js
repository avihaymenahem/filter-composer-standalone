import './NumericFilterDirective.scss';
import numericFilter from './NumericFilterDirective';

export default angular.module('CT.Components.Filters.Numeric', [])
    .directive('numericFilter', numericFilter).name;
