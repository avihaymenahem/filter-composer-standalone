import CtLoader from './ct-loader.directive';

CtLoader.$inject = [];

export default angular.module("CT.Components.CtLoader", [])
    .directive('ctLoader', CtLoader).name; 