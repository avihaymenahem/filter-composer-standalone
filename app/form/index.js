// import _ctCheckbox from './ct-checkbox';
// import _ctRadioButton from './ct-radio-button';
import _ctTextbox from './ct-textbox';
// import _ctTypeahead from './ct-typeahead';
// import _ctTypeahead2 from './ct-typeahead2';
// import _ctDropdown from './ct-dropdown';
// import _ctSelector from './ct-selector';
// import _ctDeviceSelector from './ct-device-selector';
// import _ctRules from './ct-rules';
// import _ctSlider from './ct-slider';
// import _ctTooltip from './ct-tooltip';
// import _ctTags from './ct-tags';
// import _ctDescriptiveDropdown from './ct-descriptive-dropdown';
import _ctSearchSelect from './search-select';
import './ct-form.scss';

// const ctCheckbox = angular.module("CT.Directives.ctCheckbox", [])
//     .directive('ctCheckbox', _ctCheckbox).name;

// const ctRadioBtn = angular.module("CT.Directives.ctRadioBtn", [])
//     .directive('ctRadioButton', _ctRadioButton).name;

// const ctTypeAhead = angular.module("CT.Directives.ctTypeAhead", [])
//     .directive('ctTypeahead', _ctTypeahead).name;

// const ctTypeAhead2 = angular.module("CT.Directives.ctTypeAhead2", [])
//     .directive('ctTypeahead2', _ctTypeahead2).name;

// const ctDropdown = angular.module("CT.Directives.ctDropdown", [])
//     .directive('ctDropdown', _ctDropdown).name;

// const ctSelector = angular.module("CT.Directives.ctSelector", [])
//     .directive('ctSelector', _ctSelector).name;

// const ctDeviceSelector = angular.module("CT.Directives.ctDeviceSelector", [])
//     .directive('ctDeviceSelector', _ctDeviceSelector).name;

// const ctSlider = angular.module("CT.Directives.ctSlider", [])
//     .directive('ctSlider', _ctSlider).name;

// const ctTooltip = angular.module("CT.Directives.ctTooltip", [])
//     .directive('ctTooltip', _ctTooltip).name;

// const ctTags = angular.module("CT.Directives.ctTags", [])
//     .directive('ctTags', _ctTags).name;

// const ctDescriptiveDropdown = angular.module("CT.Directives.ctDescriptiveDropdown", [])
//     .directive('ctDescriptiveDropdown', _ctDescriptiveDropdown).name;

export default [/*ctCheckbox, ctRadioBtn, ctTypeAhead, ctDropdown, ctSelector, ctDeviceSelector, ..._ctRules, ctSlider, ctTooltip, ctTypeAhead2, ctTags,ctDescriptiveDropdown, */..._ctTextbox, _ctSearchSelect];