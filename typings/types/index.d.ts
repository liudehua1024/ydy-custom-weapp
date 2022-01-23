/// <reference path="./wx/index.d.ts" />
/// <reference path="./view/index.d.ts" />
/// <reference path="./models/index.d.ts" />
/// <reference path="./http/index.d.ts" />
/// <reference path="./utils/index.d.ts" />

interface IGlobalData {
	serviceShop: ShopInfo; // 当前母店(服务点)
	screenConfig: ScreenConfig;
	navBarConfig: NavBarConfig;
}

interface IAppOption {
	globalData: IGlobalData;
	userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
	initConfig: () => void;
}

interface ScreenConfig {
	windowWidth: number;
	windowHeight: number;
	screenWidth: number;
	screenHeight: number;
	contentWidth: number;
	contentHeight: number;
}

interface Rect {
	/** 下边界坐标，单位：px */
	bottom: number;
	/** 高度，单位：px */
	height: number;
	/** 左边界坐标，单位：px */
	left: number;
	/** 右边界坐标，单位：px */
	right: number;
	/** 上边界坐标，单位：px */
	top: number;
	/** 宽度，单位：px */
	width: number;
}

interface NavBarConfig {
	navBarHeight: number; // 标题栏高度
	statusBarHeight: number; // 手机状态栏高度
	capsuleMenuRect: Rect;
}

interface GlobalConstants {
	serviceShopId: number;
	tabBarHeight: number;
	defProvince: string,
	defCity: string,
	defDistrict: string,
	defAddress: string,
	defLatitude: number,
	defLongitude: number
}

interface HandlePageOption {
	<TData extends WxPage.DataOption = WxPage.DataOption,
		TCustom extends WxPage.CustomOption = WxPage.CustomOption>(
		opt: WxPage.Options<TData, TCustom>
	): WechatMiniprogram.Page.Options<IAnyObject, WxPage.CustomOption>;
}

interface GlobalFun {
	$getAppGlobalData(): IGlobalData;

	$handlePageOption: HandlePageOption;

	$createApiRequest(): ApiRequest;
}

interface GlobalUtils {
	$isUtils: IsUtils;
	$strUtils: StrUtils;
	$numUtils: NumberUtils;
	$arrayUtils: ArrayUtils;
	$dateUtils: DateUtils;
	$viewHelper: ViewHelper;
	$privacyHelper: PrivacyHelper;
	$toastUtils: ToastUtils;
	$eventBus: IEventBusManager;
	$dialogUtils: DialogUtils;
	$router: Router;
	$loginHelper: LoginHelper;
}

declare const wx: WechatMiniprogram.Wx & { constants: GlobalConstants } & GlobalUtils & GlobalFun;
