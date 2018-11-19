import './BasicFilterDirective.scss';
import BasicFilter from './BasicFilterDirective';

export default angular.module('CT.Components.Filters')
    .directive('basicFilter', BasicFilter).name;
