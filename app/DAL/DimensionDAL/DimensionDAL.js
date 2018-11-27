const CACHE_INTERVAL_TIMEOUT = 30000;
// var memoize = require('memoizee');

export default class DimensionDAL {

    // constructor(RestProxyFactory, ConfigurationService) {
    //     let self = this;
    //     self._restProxy = RestProxyFactory.getInstance();
    //     self._configurationService = ConfigurationService;
    //     self._restProxy.setBasePath(self._configurationService.configuration.configurationUrl);
        
    //     self._get = memoize(
    //         self._restProxy.get.bind(self._restProxy),
    //         { maxAge: CACHE_INTERVAL_TIMEOUT, promise: true, normalizer: JSON.stringify }
    //     );
    // }

    /**
     * Retrieving dimension data from configuration
     * service according to the input dimension name
     * .
     * @param { String } dimension
     * @param { Object } filter
     * @param { String } projectType
     * @param { Boolean } overrideCache use cache
     * @returns { Promise } retrieved/cached values under the data member
     * @memberof DimensionDAL
     */
    getDimensionData(dimension, filter, projectType, overrideCache) {
        let self = this;
        let params = { dimension , projectType };
        if (filter) {
            params.filter = btoa(JSON.stringify(filter));
        }
       
        // if (overrideCache) {
        //     return self._restProxy.get(
        //         `filter/querydimensionvalues`,
        //         params,
        //         true
        //     )
        // }

        // return self._get(
        //     `filter/querydimensionvalues`,
        //     params,
        //     true
        // )

        return new Promise(resolve => resolve(require (`./${ dimension }.json`)));
    }

    /**
     * Retrieving dimension data from configuration
     * service according to a search term
     * .
     * @param { String } dimension
     * @param { Object } searchTerm
     * @param { String } projectType
     * @param { Boolean } overrideCache use cache
     * @returns { Promise } retrieved/cached values under the data member
     * @memberof DimensionDAL
     */
    getSearchData(dimension, searchTerm, projectType, overrideCache) {
        if (searchTerm == "") {
            return this.getDimensionData(dimension, searchTerm, projectType);
        }

        // let self = this;
        // let params = { dimension ,projectType };

        // if (searchTerm) {
        //     params.searchTerm = encodeURIComponent(searchTerm);
        // }

        // if (overrideCache) {
        //     return self._restProxy.get(
        //         `filter/querydimensionvalues/search`,
        //          params,
        //          true
        //      )
        // }

        // return self._get(
        //    `filter/querydimensionvalues/search`,
        //     params,
        //     true
        // )    

        let all = require(`./${ dimension }.json`);
        return new Promise (resolve => resolve(data.filter(entry => ~entry.indexOf(searchTerm))))
    }
}