require('./ct-dropdown.scss');
import ctDropdownController from './ct-dropdown.controller';

var template = require('./ct-dropdown.html');
const ctDropdown = () =>  {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      options: '=',
      default: '@',
      required: '=',
      attrAutoName: '@?'
    },
    controller: ['$scope', '$document', '$element', ctDropdownController],
    template
  };
};
 
export default angular.module("CT.Directives.ctDropdown", [])
    .directive('ctDropdown', ctDropdown).name;
