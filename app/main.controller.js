/**
 * Example Controller
 */
class MainCtrl {
    constructor(scope) {
        this.controllerName = 'Main Controller';
        scope.filtersList = require('./filtersMock.json');
        scope.filtersModel = {};
        scope.configuration = {
            context: undefined
        };
    }
}

MainCtrl.$inject = ['$scope']

export default MainCtrl;