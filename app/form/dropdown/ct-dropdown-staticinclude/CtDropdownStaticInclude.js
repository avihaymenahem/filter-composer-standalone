let dropdownStaticInclude = ($compile) => {
	return function(scope, element, attrs) {
		var template = attrs.ctDropdownStaticInclude;
		var contents = element.html(template).contents();
		$compile(contents)(scope);
	};
}

export default dropdownStaticInclude