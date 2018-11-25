import './PercentageFilterDirective.scss';
import percentageFilter from './PercentageFilterDirective';

export default angular.module('CT.Components.Filters')
	.directive('percentageFilter', percentageFilter).name;
