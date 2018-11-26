import './ct-tags.scss';
import ctrl from './ct-tags.controller';

const tpl = require('./ct-tags.html');

const ctTags = () => ({
    restrict: 'E',
    template: tpl,
    scope: {
        selectedModel: '=',
        options: '=',
        doSearch: '&',
        onSelect: '&',
        onRemove: '&',
        noResultsText: '@',
        placeholder: '@',
        tagging: '&?',
        paste: '&?',
        taggingTokens: '@?',
        onOpenClose: '&?',
        isSearching: '=?',
        useLocalFilter: '='
    },
    controller: ['$scope', '$element', ctrl],
    controllerAs: 'vm',
});

export default angular.module("CT.Directives.ctTags", [])
    .directive('ctTags', ctTags).name;
