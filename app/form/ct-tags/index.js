import './ct-tags.scss';
import ctrl from './ct-tags.controller';

const tpl = require('./ct-tags.html');

export default () => ({
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