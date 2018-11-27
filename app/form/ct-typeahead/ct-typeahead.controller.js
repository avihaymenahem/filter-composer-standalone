import { cloneDeep } from 'lodash';

export default (scope) => {
  
  scope._keyup = () => scope.onKeyup({ event: scope.tempModel });
  scope.$watch("model", (newValue) => {
     scope.tempModel = cloneDeep(scope.model);
  })
 
};