import './FilterComposerDirective.scss';
import FilterComposer from './FilterComposerDirective';

export default angular.module('CT.Components.Filters', [])
    .directive('filterComposer', FilterComposer).name;
