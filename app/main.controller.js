/**
 * Example Controller
 */
class MainCtrl {
    constructor(scope) {
        this.controllerName = 'Main Controller';
        scope.filtersList = require('./filters.json');
        scope.filtersModel = {};
        scope.configuration = {
            context: undefined
        };
    }
}

MainCtrl.$inject = ['$scope']

export default MainCtrl;