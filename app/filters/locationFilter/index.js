import './locationFilter.scss';
import locationFilterDirective from './locationFilter.directive';

export default angular.module('CT.Components.Filters.Location', [])
    .directive('locationFilter', locationFilterDirective).name;
