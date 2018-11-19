/**
 * Example Controller
 */
class MainCtrl {
    constructor() {
        this.controllerName = 'Main Controller';
        this.filtersList = require('./filters.json');
        this.filtersModel = {};
        this.configuration = {
            context: undefined
        };
    }
}

export default MainCtrl;