import './PercentageFilterDirective.scss';
import percentageFilter from './PercentageFilterDirective';

export default angular.module('CT.Components.Filters.Percentage', [])
	.directive('percentageFilter', percentageFilter).name;
