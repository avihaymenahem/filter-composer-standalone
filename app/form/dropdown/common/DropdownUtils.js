export  default class DropdownUtils {
	static dropDownFixPosition(button,dropdown){
		var dropDownTop = button.getBoundingClientRect().top + (button.getBoundingClientRect().bottom - button.getBoundingClientRect().top);
		dropdown.style.top = dropDownTop + "px"
		dropdown.style.left = button.getBoundingClientRect().left + "px"
	}
}