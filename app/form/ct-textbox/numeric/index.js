const _ctNumericTextbox = () => {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            value: '@',
            placeholder: '@',
            className: '@',
            required: '=',
            disabled: '=',
            maxlength: '=',
            min: '@',
            max: '@',
            precision: '@'
        },
        controller: ['$scope', ($scope) => {
            const defaultPrecision = 2;
            $scope.$watch("model", (newVal) => {
                if (newVal) {
                    $scope._model = Number(newVal);
                } else {
                    $scope._model = undefined;
                }
                
            });
            
            $scope.onBlur = ($event) => {
                if ($scope.max && parseFloat($event.target.value) > $scope.max) {
                    $scope._model = $scope.max;
                    setValue();
                    return
                }

                if ($scope.min && parseFloat($event.target.value) < $scope.min) {
                    $scope._model = $scope.min;
                    setValue();
                    return
                }
                
                if ($scope._model === null || $scope._model === undefined) {
                    $scope.model = $scope._model = undefined;
                    setValue();
                    return
                }

                if ($scope._model % 1 !== 0) {
                    $scope._model = parseFloat($scope._model.toFixed($scope.precision || defaultPrecision));
                }

                // $scope._model = Math.max($scope._model, $scope.min);
                // $scope._model = Math.min($scope._model, $scope.max);                

                setValue();
            }
            
            /**
             * Hack to make sure the value really updates in cases of 
             * "Bad" floating numbers i.e "0." => "0"
             */
            const setValue = function () {
                const temp = $scope._model;
                
                $scope.model = $scope._model = undefined;

                setTimeout(function() {
                    $scope.model = $scope._model = temp;
                    $scope._model = Number($scope._model);
                }, 0);
            }
        }],
        template: require('./ct-textbox.numeric.html') 
    };
};


export default angular.module("CT.Directives.ctNumericTextbox", [])
    .directive('ctNumericTextbox', _ctNumericTextbox).name;