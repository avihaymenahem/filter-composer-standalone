const ctCheckbox = () =>  {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      label: '@',
      disabled: '=',
      onChange: '&',
      parentComponent: '@',
      'auto-attr-chkbox': '@?',
      'auto-attr-chkbox-label': '@?',
    },
    link: (scope, element, attrs) => attrs.$observe('disabled', (value) => scope.disableCheckbox = value),
    template: `<label auto-attr="auto-attr-chkbox-label" ng-class="{ checked: model === true, disabled: disableCheckbox }" class="ct-form-control-checkBox" data-fbt="{{:: label}}">{{:: label}}
    <input type="checkbox" auto-attr="auto-attr-chkbox" ng-click="onChange()" ng-model="model"  />
    <div class="ct-form-control-indicator icon-font" ng-class="{ \'checkbox-off\': !model, \'checkbox-on\': model, secondary: parentComponent === 'ignoreQueryString' }" ></div>
     <ct-tooltip ng-if="parentComponent === 'ignoreQueryString'" group="CONFIGURATION.INFLUENCING_SEGMENTS" id="ignoreQueryString" placement="right">
    </label>`
  };
};

export default angular.module('CT.Directives.Checkbox', [])
.directive('ctCheckbox', ctCheckbox).name;