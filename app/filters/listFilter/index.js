import './ListFilter.scss';
import listFilterDrtv from './ListFilterDirective';

export default angular.module('CT.Components.Filters.List', [])
	.directive('listFilter', listFilterDrtv).name