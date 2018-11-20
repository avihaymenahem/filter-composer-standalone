import ClickOutside from './clickOutside';

ClickOutside.$inject = ['$document', '$parse', '$timeout']

export default angular.module('CT.Directives.ClickOutside', [])
.directive('clickOutside', ClickOutside).name;