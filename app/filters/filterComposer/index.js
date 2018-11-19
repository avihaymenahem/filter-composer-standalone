import './FilterComposerDirective.scss';
import FilterComposer from './FilterComposerDirective';

export default angular.module('example.components', [])
    .directive('filterComposer', FilterComposer).name;
