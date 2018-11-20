import './CSVFilter.scss';
import CSVFilter from './CSVFilter.directive';

export default angular.module('CT.Components.Filters')
    .directive('csvFilter', CSVFilter).name;
