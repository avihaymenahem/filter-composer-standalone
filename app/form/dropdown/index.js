import './CtDropdownStyle.scss';

import ctDropdownFormDirective from'./ct-dropdown-form/CtDropdownFormDirective'
import ctDropdownMultiselectDirective from './ct-dropdown-multiselect/CtDropdownMultiselectDirective';
import ctDropdownStaticInclude from './ct-dropdown-staticinclude/CtDropdownStaticInclude'

ctDropdownFormDirective.$inject = []
ctDropdownMultiselectDirective.$inject = ['$filter', '$document', '$compile', '$parse'];
ctDropdownStaticInclude.$inject = ['$compile'];

var module = angular.module("CT.Components.Form.dropdown", [])
	.directive('dropdownForm', ctDropdownFormDirective)
	.directive('ctDropdownStaticInclude', ctDropdownStaticInclude)
	.directive('dropdownMultiSelect', ctDropdownMultiselectDirective)

export default module.name
