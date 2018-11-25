require('./ct-dropdown.scss');
import ctDropdownController from './ct-dropdown.controller';

var template = require('./ct-dropdown.html');
export default () =>  {
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