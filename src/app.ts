// app.ts
import { injection } from '@/utils/injection';

App<IAppOption>({
	globalData: {
		serviceShop: {} as ShopInfo,
		screenConfig: {} as ScreenConfig,
		navBarConfig: {} as NavBarConfig
	},
	onLaunch() {
		/**将一些方法挂载到wx上*/
		injection();
		this.initConfig();
		wx.$loginHelper.autoLogin();
		
	},
	initConfig(): void {
		const systemInfo = wx.getSystemInfoSync();

		const capsuleMenuRect = wx.getMenuButtonBoundingClientRect();
		const navBarConfig = this.globalData.navBarConfig;

		navBarConfig.navBarHeight =
			(capsuleMenuRect.top - systemInfo.statusBarHeight) * 2 + capsuleMenuRect.height;
		navBarConfig.statusBarHeight = systemInfo.statusBarHeight;
		navBarConfig.capsuleMenuRect = capsuleMenuRect;

		const screenConfig = this.globalData.screenConfig;
		screenConfig.screenWidth = systemInfo.screenWidth;
		screenConfig.screenHeight = systemInfo.screenHeight;
		screenConfig.windowWidth = systemInfo.windowWidth;
		screenConfig.windowHeight = systemInfo.windowHeight;
	}
});
