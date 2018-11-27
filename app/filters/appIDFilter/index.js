import './AppIDFilterDirective.scss';
import appIDFilter from './AppIDFilterDirective';

export default angular.module('CT.Components.Filters.AppId', [])
    .directive('appIdFilter', appIDFilter).name;
