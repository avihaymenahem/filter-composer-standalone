import ctrl from './CSVFilter.controller';
const tpl = require('./CSVFilterView.html');

const CSVFilter = () => ({
    restrict: 'E',
    template: tpl,
    scope: {
        selectedItem: '=',
        filterModel: '=',
        operator: '='
    },
    controller: ['$scope', '$element', ctrl],
    controllerAs: 'vm',
    link: function($scope, $elmenet) {
        
    }
});

export default CSVFilter;
