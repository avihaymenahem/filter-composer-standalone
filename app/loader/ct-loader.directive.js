const CtLoader = () => {
    let directive = {
        restrict    : 'E',
        template    : require("./ct-loader.view.html"),
        scope       : {
            size: '@',
            loading: '=',
            loaderContainerClass: '@',
            loaderClass: '@'
        },
        link        : (scope, element, attrs, ctrl) => {
            //set default values
            scope.loaderContainerClass = !scope.loaderContainerClass ? 'loader-container' : scope.loaderContainerClass;
            scope.loaderClass = !scope.loaderClass ? 'loader' : scope.loaderClass;

            scope.$watch('loading', function(newValue) {
                element.parent().attr("ct-loaded", !newValue);
            });
        }
    };
    
    return directive;
};

export default CtLoader;
