import './BasicFilterDirective.scss';
import BasicFilter from './BasicFilterDirective';

export default angular.module('CT.Components.Filters.Basic', [])
    .directive('basicFilter', BasicFilter).name;
