require('./ct-typeahead.scss');
import ctTypeaheadController from './ct-typeahead.controller';

var template = require('./ct-typeahead.html');
const ctTypeahead = () => {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            values: '=',
            placeholder: '@',
            onKeyup: '&',
            name: '@',
            existsInValidation: '=',
            updateModelOnBlur: '=',
            onSelect: '=',
            isRequired: '='
        },
        controller: ['$scope', ctTypeaheadController],
        template
    };
};

export default angular.module("CT.Directives.Typeahead", [])
    .directive('ctTypeahead', ctTypeahead).name;
