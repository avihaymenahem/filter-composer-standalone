import DimensionDAL from './DimensionDAL'

// DimensionDAL.$inject = ['RestProxyFactory','ConfigurationService'];

export default angular.module('CT.Services.DimensionDAL',[])
	.service('DimensionDAL', DimensionDAL).name