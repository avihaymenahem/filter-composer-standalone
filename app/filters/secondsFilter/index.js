import './SecondsFilterDirective.scss';
import secondsFilter from './SecondsFilterDirective';

export default angular.module('CT.Components.Filters.Seconds', [])
	.directive('secondsFilter', secondsFilter).name;
