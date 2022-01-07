/// <reference path="./lib.event.bus.d.ts" />

interface IsUtils {
	isNumber(arg: any): arg is number;

	isString(arg: any): arg is string;

	isObject(obj: any): obj is Object;

	isFun(arg: any): arg is Function;

	isArray(arg: any): arg is any[];

	isEmpty(arg: any): boolean;

	/** 校验手机号码 */
	isPhoneNumber(str: string): boolean;
}

interface StrUtils {
	/** 任意类型转为字符串 */
	toString(arg: any): string;

	repeatStr(str: string, count: number): string;

	insertStr(src: string, index: number, str: string): string;

	/** 判断字符串中是否包含子字符串 */
	contains(src: string, ...subs: string[]): boolean;

	/** 补全字符串,len补全后字符串长度, padStr用于补全时填充的字符串 */
	padStart(src: string, len: number, padStr?: string): string;

	/** 补全字符串,len补全后字符串长度, padStr用于补全时填充的字符串 */
	padEnd(src: string, len: number, padStr?: string): string;
}

interface NumberUtils {
	toInt(num: number): number;

	fixed(num: number, fractionDigits?: number): string;

	strToInt(numStr: string): number;

	strToNumber(numStr: string): number;

	/**获取有效小数位数(不计算补0)*/
	decimalsLen(num: number): number;

	/**计算两个数之和(避免小数精度丢失)*/
	sum(num1: number, num2: number): number;

	/**计算两个数之积(避免小数精度丢失)*/
	multiplication(num1: number, num2: number): number;
}

interface ArrayUtils {
	strToArray(str: string, separator?: string): string[];

	strToNumberArray(str: string, separator?: string): number[];
}

interface DateUtils {
	getCurTimestamp(): number;

	getZeroTimestamp(timestamp?: number): number;

	getMothStartAndEnd(timestamp?: number): { startTime: number, endTime: number };

	toTimestamp(date: Date): number;

	toDate(timestamp: number): Date;

	format(time: number | Date, formatStr?: string): string;
}

interface ViewHelper {
	disposeSizeStyle(size: number | string, defUnit?: 'px' | 'rpx'): string;

	toCssStyleString(obj: Record<string, string | number | undefined>): string;
}

/** 隐私辅助工具 */
interface PrivacyHelper {
	/** 过滤名称,只显示开头一个字符 */
	filterName(name: string): string;

	/** 过滤电话号码,显示前两位和后四位 */
	filterPhoneNumber(phoneNumber: string): string;
}

interface ToastUtils {
	showToast: (opt: ToastOptions) => void;
	hideToast: () => void;
	showSuccessToast: (opt?: CustomToastOptions | string) => void;
	showFailToast: (opt?: CustomToastOptions | string) => void;
	showMsgToast: (opt?: CustomToastOptions | string) => void;
	showLoading: (opt?: CustomToastOptions | string) => void;
	hideLoading: () => void;
	setToastEnable: (enable: boolean) => void;
}

interface DialogUtils {
	showDialog: (opt: ModalOptions) => void;
	showTipDialog: (opt: TipModalOptions) => void;
	showLoginFailDialog: (errMsg: string) => void;
	showNoLoginDialog: () => void;
	showUpdateTipDialog: () => void;
	showNetFailedDialog: () => void;
}

interface LoginHelper {
	readonly stateChangeTag: string;

	checkLogin(): boolean;

	getToken(): string | undefined;

	getLoginState(): LoginResp;

	clearLoginState(callEvent: boolean): void;

	autoLogin(): void;

	authLogin(): void;
}

type RouteName = string;

interface Route {
	name: RouteName;
	url: string;
	isTab?: boolean;
	isIndex?: boolean;
}

type toRouteType = 'to' | 'reLaunch' | 'redirectTo';

interface ToRouteOption {
	name?: RouteName;
	url?: string;
	params?: Record<string, any>;
	jsonParams?: boolean;
	toType?: toRouteType;
}

interface ToPluginOption {
	name?: RouteName;
	url?: string;
	params?: Record<string, any>;
}

interface Router {
	init: (mainPage: WxPage.Instance) => void;

	getMainPage(): WxPage.Instance | undefined;

	/**
	 * @param to ToRouteOption or RouteName
	 * **/
	to: (to: ToRouteOption | RouteName) => Promise<any>;
	pop: (delta?: number) => Promise<any>;
	popTo: (to: ToRouteOption | RouteName, toBeforePage: boolean | undefined) => Promise<any>;
	getRouteStack: () => Array<Route>;
	getTopRoute: () => Route | undefined;
	toPlugin: (to: ToPluginOption) => void;
}
