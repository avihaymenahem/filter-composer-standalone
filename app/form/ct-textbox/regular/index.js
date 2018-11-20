const tpl = require('./ct-textbox.text.html');

const ctTextbox = () => ({
    restrict: 'E',
    scope: {
        model: '=',
        placeholder: '@',
        className: '@',
        required: '=',
        disabled: '=',
        maxlength: '=',
        name: '@',
        icon: '@',
        filledIcon: '@',
        onReset: '&',
        onFocus: '&',
        onBlur: '&',
        onChange: '&',
        ctAutoId: '@?'
    },
    template: tpl,
});

export default angular.module('CT.Directives.ctTextbox', [])
    .directive('ctTextbox', ctTextbox).name;
