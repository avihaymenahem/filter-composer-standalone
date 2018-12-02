import './SetFilterDirective.scss';
import setFilter from './SetFilterDirective';

export default angular.module('CT.Components.Filters.Set', [])
    .directive('setFilter', setFilter).name;
