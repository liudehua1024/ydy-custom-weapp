import { ApiCommand } from '@/api/command';
import { RouterManager } from '@/router/router';
import { routes } from '@/router/routes';
import { handlePageOption } from '@/utils/createOptions';
import { dialogUtils } from '@/utils/dialogUtils';
import { EventBusManager } from '@/utils/eventBusHelper';
import { MyLoginHelper } from '@/utils/loginHelper';
import { toastUtils } from '@/utils/toastUtils';
import { arrayUtils, isUtils, numUtils, strUtils, viewHelper } from '@/utils/utils';

const injectionConstants = () => {
	wx.constants = {
		serviceShopId: 10,
		tabBarHeight: 110
	};
};

const createApiRequest = (): ApiRequest => {
	return new ApiCommand();
};

const getAppGlobalData = (): IGlobalData => {
	const app = getApp<IAppOption>();
	if (app) {
		return app.globalData;
	}

	return {} as IGlobalData;
};

const injectionFun = () => {
	wx.$createApiRequest = createApiRequest;
	wx.$getAppGlobalData = getAppGlobalData;
	wx.$handlePageOption = handlePageOption;
};

const injectionUtils = () => {
	wx.$isUtils = isUtils;
	wx.$strUtils = strUtils;
	wx.$numUtils = numUtils;
	wx.$arrayUtils = arrayUtils;
	wx.$viewHelper = viewHelper;
	wx.$toastUtils = toastUtils;
	wx.$dialogUtils = dialogUtils;
	wx.$eventBus = new EventBusManager();
	wx.$router = new RouterManager(routes);
	wx.$loginHelper = new MyLoginHelper();
};

export const injection = () => {
	injectionConstants();
	injectionFun();
	injectionUtils();
};
