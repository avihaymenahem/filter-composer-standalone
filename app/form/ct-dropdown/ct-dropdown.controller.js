import { find } from 'lodash';

export default (scope, $document, $element) => {
  scope.showDropdown = false;
  const getLabel = (selectedValue, options) => {
    return find(options, (o) => o.value == selectedValue).label;
  };

  scope.select = (selectedOption) => {
    scope.model = selectedOption.value;
  };

  scope.selectOption = (o) => {
    scope.showDropdown = false;
    scope.label = getLabel(scope.model, scope.options);
  };

  scope.$watch('model', (newValue) => {
    let selectedOption = find(scope.options, (o) => o.value == newValue);
    if(selectedOption) {
      scope.selectOption(selectedOption);
    }else {
       scope.showDropdown = false;
       scope.label = scope.default;
    }
  });

  scope.toggleDropdown = () => {
    if(scope.showDropdown) {
      scope.showDropdown = false;
    } else {
      scope.position = {
        top:  `${$element[0].getBoundingClientRect().top}px`,
        left: `${$element[0].getBoundingClientRect().left}px`,
        'min-width': `${$element[0].getBoundingClientRect().right - $element[0].getBoundingClientRect().left}px`
      };
      scope.showDropdown = true;
    }
  };

  scope.something = null;
};