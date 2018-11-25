import './SecondsFilterDirective.scss';
import secondsFilter from './SecondsFilterDirective';

export default angular.module('CT.Components.Filters')
	.directive('secondsFilter', secondsFilter).name;
