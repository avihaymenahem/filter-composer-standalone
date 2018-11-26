import './CSVFilter.scss';
import CSVFilter from './CSVFilter.directive';

export default angular.module('CT.Components.Filters.CSV', [])
    .directive('csvFilter', CSVFilter).name;
